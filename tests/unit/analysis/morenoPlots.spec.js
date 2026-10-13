import { describe, it, expect, vi } from "vitest";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import {
  buildMorenoEgoPlot,
  getNodePaths,
  getMorenoEgoPlots,
  getNodePathsFor,
} from "@/analysis/moreno/plots/morenoPlots.js";

const makeMember = (id, name, likes = [], dislikes = []) => ({
  id,
  name,
  likes,
  dislikes,
});

const countOccurrences = (text, needle) =>
  text.split(needle).length - 1;

describe("morenoPlots", () => {
  const members = [
    makeMember("a", "Alice", ["b", "c"]),
    makeMember("b", "Bob", ["a"]),
    makeMember("c", "Carol", ["d"]),
    makeMember("d", "Dave", ["e"]),
    makeMember("e", "Eve"),
    makeMember("f", "Frank"),
    makeMember("g", "Grace", ["a"]),
  ];

  const graph = createLikesGraph(members, "likes");
  const dislikesGraph = createLikesGraph(members, "dislikes");

  describe("getNodePaths", () => {
    it("classifies every node by its shortest directed path length", () => {
      const paths = getNodePaths(graph, dislikesGraph);

      // a likes b and c. b likes a back (mutual); c leads to d, then e. g likes
      // a but a does not like g, so g is unreachable from a.
      expect(paths.a).toEqual({
        mutuality: ["b"],
        oneHop: ["c"],
        twoHops: ["d"],
        multipleHops: ["e"],
        unreachable: ["f", "g"],
      });

      // b likes a (mutual), which leads to c, then d, then e; f and g are not
      // reachable from b (g likes a, but b's outgoing choices never reach g).
      expect(paths.b).toEqual({
        mutuality: ["a"],
        oneHop: [],
        twoHops: ["c"],
        multipleHops: ["d", "e"],
        unreachable: ["f", "g"],
      });
    });

    it("places nodes the source dislikes in the unreachable bucket", () => {
      const dislikeMembers = [
        makeMember("a", "Alice", ["b"], ["c"]),
        makeMember("b", "Bob", ["c"], []),
        makeMember("c", "Carol", [], []),
      ];
      const likes = createLikesGraph(dislikeMembers, "likes");
      const dislikes = createLikesGraph(dislikeMembers, "dislikes");

      const paths = getNodePaths(likes, dislikes);

      // c is reachable through b (a -> b -> c), but a dislikes c, so it is
      // pushed to the unreachable bucket instead of twoHops.
      expect(paths.a).toEqual({
        mutuality: [],
        oneHop: ["b"],
        twoHops: [],
        multipleHops: [],
        unreachable: ["c"],
      });
    });
  });

  describe("getNodePathsFor", () => {
    it("returns the precomputed paths of a specific node", () => {
      const paths = getNodePaths(graph, dislikesGraph);

      expect(getNodePathsFor(paths, "a")).toEqual({
        mutuality: ["b"],
        oneHop: ["c"],
        twoHops: ["d"],
        multipleHops: ["e"],
        unreachable: ["f", "g"],
      });
    });

    it("returns undefined for a node that is not present", () => {
      expect(getNodePathsFor(getNodePaths(graph, dislikesGraph), "z")).toBeUndefined();
    });
  });

  describe("buildMorenoEgoPlot", () => {
    const egoMembers = [
      makeMember("a", "Alice", ["b"], []),
      makeMember("b", "Bob", ["c"], []),
      makeMember("c", "Carol", [], []),
      makeMember("d", "Dave", [], ["a"]),
      makeMember("e", "Eve", ["a"], []),
      makeMember("f", "Frank", [], []),
    ];

    const likesGraph = createLikesGraph(egoMembers, "likes");
    const dislikesGraph = createLikesGraph(egoMembers, "dislikes");
    const nodePaths = getNodePaths(likesGraph, dislikesGraph);

    it("places nodes on rings by reachability and colors them by priority", () => {
      const { memberId, svg } = buildMorenoEgoPlot(
        "a",
        likesGraph,
        dislikesGraph,
        nodePaths,
      );

      expect(memberId).toBe("a");
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg.endsWith("</svg>")).toBe(true);

      // The ego plus b, c, d, e, f = six nodes.
      expect(countOccurrences(svg, "fill='#FFFFFF'")).toBe(6);

      // Six dashed boundaries separate the center (ego) and the five rings.
      expect(countOccurrences(svg, "fill='none'")).toBe(6);

      // d dislikes the ego (red), b is liked by the ego and e likes the ego
      // (blue), and c and f have no direct relationship (black).
      expect(svg).toContain("stroke='#FF0000'");
      expect(svg).toContain("stroke='#0000FF'");
      expect(svg).toContain("stroke='#000000'");

      // Direct relationships carry a direction marker: a likes b (outward),
      // d dislikes the ego (inward) and e likes the ego (inward).
      expect(countOccurrences(svg, "<polygon")).toBe(3);
    });

    it("stacks the region names along the 12 o'clock line", () => {
      const { svg } = buildMorenoEgoPlot(
        "a",
        likesGraph,
        dislikesGraph,
        nodePaths,
      );

      // Innermost ring first, outermost ring last. The center (ego) is not
      // named, so there are exactly five region labels.
      const order = ["0MU", "0HP", "1HP", "2HP+", "UNR"];
      const textOf = (name) => {
        const match = svg.match(
          new RegExp(`<text([^>]*)>${name.replace("+", "\\+")}</text>`),
        );
        return match ? match[1] : null;
      };
      const coordinate = (attrs, axis) =>
        Number(attrs.match(new RegExp(`${axis}='([^']+)'`))[1]);

      const labels = order.map(textOf);
      labels.forEach((attrs) => expect(attrs).not.toBeNull());

      const canvas = svg.match(/viewBox='0 0 ([0-9.]+) ([0-9.]+)'/);
      expect(canvas).not.toBeNull();
      const centerX = Number(canvas[1]) / 2;
      const centerY = Number(canvas[2]) / 2;

      // All names share the center x and climb up from the center toward the
      // north, so their y decreases in ring order (innermost nearest center).
      const xs = labels.map((attrs) => coordinate(attrs, "x"));
      const ys = labels.map((attrs) => coordinate(attrs, "y"));
      xs.forEach((x) => expect(x).toBeCloseTo(centerX, 1));
      ys.forEach((y) => expect(y).toBeLessThan(centerY));
      for (let i = 1; i < ys.length; i += 1) {
        expect(ys[i]).toBeLessThan(ys[i - 1]);
      }

      // No node sits in the reserved north corridor, so the names never overlap
      // a node: every node's angle from the center stays outside the gap.
      const northGap = Math.PI / 3;
      const nodeCenters = [
        ...svg.matchAll(
          /<circle[^>]*fill='#FFFFFF'[^>]*cx='([^']+)'[^>]*cy='([^']+)'/g,
        ),
      ];
      expect(nodeCenters.length).toBeGreaterThan(0);
      nodeCenters.forEach((match) => {
        const angle = Math.atan2(
          Number(match[2]) - centerY,
          Number(match[1]) - centerX,
        );
        const fromNorth = Math.abs(
          Math.atan2(
            Math.sin(angle + Math.PI / 2),
            Math.cos(angle + Math.PI / 2),
          ),
        );
        expect(fromNorth).toBeGreaterThanOrEqual(northGap / 2 - 1e-9);
      });
    });

    it("keeps the north corridor clear on a crowded innermost ring", () => {
      // Many members reciprocate so ring 1 (0MU) is densely populated; the
      // reserved north gap must still hold even when the ring is full.
      const members = [
        makeMember("a", "Alice", ["b", "c", "d", "e", "f"]),
        makeMember("b", "Bob", ["a"]),
        makeMember("c", "Carol", ["a"]),
        makeMember("d", "Dave", ["a"]),
        makeMember("e", "Eve", ["a"]),
        makeMember("f", "Frank", ["a"]),
      ];
      const likes = createLikesGraph(members, "likes");
      const dislikes = createLikesGraph(members, "dislikes");

      // Ring 1 (mutuality, 5 nodes) consumes the first call; the four empty
      // rings consume the rest. A phase of 0.5 within one slot keeps the ring
      // in the safe arc; the same 0.5 over the full arc would push a node into
      // the north gap.
      const random = vi
        .spyOn(Math, "random")
        .mockReturnValueOnce(0.5)
        .mockReturnValue(0);

      try {
        const { svg } = buildMorenoEgoPlot(
          "a",
          likes,
          dislikes,
          getNodePaths(likes, dislikes),
        );

        const canvas = svg.match(/viewBox='0 0 ([0-9.]+) ([0-9.]+)'/);
        const centerX = Number(canvas[1]) / 2;
        const centerY = Number(canvas[2]) / 2;

        const northGap = Math.PI / 3;
        const nodeCenters = [
          ...svg.matchAll(
            /<circle[^>]*fill='#FFFFFF'[^>]*cx='([^']+)'[^>]*cy='([^']+)'/g,
          ),
        ];
        expect(nodeCenters.length).toBe(members.length);

        nodeCenters.forEach((match) => {
          const angle = Math.atan2(
            Number(match[2]) - centerY,
            Number(match[1]) - centerX,
          );
          const fromNorth = Math.abs(
            Math.atan2(
              Math.sin(angle + Math.PI / 2),
              Math.cos(angle + Math.PI / 2),
            ),
          );
          expect(fromNorth).toBeGreaterThanOrEqual(northGap / 2 - 1e-9);
        });
      } finally {
        random.mockRestore();
      }
    });

    it("marks a node that directly dislikes the ego and the ego's outgoing likes", () => {
      const outgoingMembers = [
        makeMember("a", "Alice", ["b"], []),
        makeMember("b", "Bob", [], []),
        makeMember("c", "Carol", [], ["a"]),
      ];
      const likes = createLikesGraph(outgoingMembers, "likes");
      const dislikes = createLikesGraph(outgoingMembers, "dislikes");

      const { svg } = buildMorenoEgoPlot(
        "a",
        likes,
        dislikes,
        getNodePaths(likes, dislikes),
      );

      // a likes b (blue stroke + blue outward marker) and c dislikes a (red
      // stroke + red inward marker): two direction markers in total.
      expect(svg).toContain("stroke='#0000FF'");
      expect(svg).toContain("stroke='#FF0000'");
      expect(svg).toContain("fill='#0000FF'");
      expect(svg).toContain("fill='#FF0000'");
      expect(countOccurrences(svg, "<polygon")).toBe(2);
    });

    it("strokes a node the ego dislikes red on the unreachable ring", () => {
      const dislikeMembers = [
        makeMember("a", "Alice", [], ["b"]),
        makeMember("b", "Bob", [], []),
        makeMember("c", "Carol", [], []),
      ];
      const likes = createLikesGraph(dislikeMembers, "likes");
      const dislikes = createLikesGraph(dislikeMembers, "dislikes");

      const { svg } = buildMorenoEgoPlot(
        "a",
        likes,
        dislikes,
        getNodePaths(likes, dislikes),
      );

      const circle = (label) => {
        const match = svg.match(
          new RegExp(`<circle([^>]*)></circle><text[^>]*>${label}</text>`),
        );
        return match ? match[1] : null;
      };
      const coordinate = (attrs, axis) =>
        Number(attrs.match(new RegExp(`${axis}='([^']+)'`))[1]);

      const ego = circle("a");
      const bNode = circle("b");
      expect(ego).not.toBeNull();
      expect(bNode).not.toBeNull();

      // a dislikes b, so b is red, sits on ring 5 (radius 360), and carries a
      // red outward direction marker (the ego points at b).
      expect(bNode).toContain("stroke='#FF0000'");
      expect(svg).toContain("<polygon fill='#FF0000'");
      const radiusOf = (attrs) =>
        Math.hypot(
          coordinate(attrs, "cx") - coordinate(ego, "cx"),
          coordinate(attrs, "cy") - coordinate(ego, "cy"),
        );
      expect(radiusOf(bNode)).toBeCloseTo(360, 0);
    });

    it("does not skip empty rings", () => {
      const sparseMembers = [
        makeMember("a", "Alice", ["b"], []),
        makeMember("b", "Bob", ["c"], []),
        makeMember("c", "Carol", [], []),
      ];
      const sparseLikes = createLikesGraph(sparseMembers, "likes");
      const sparseDislikes = createLikesGraph(sparseMembers, "dislikes");

      const { svg } = buildMorenoEgoPlot(
        "a",
        sparseLikes,
        sparseDislikes,
        getNodePaths(sparseLikes, sparseDislikes),
      );

      // Extract a node's circle attributes by its label.
      const circle = (label) => {
        const match = svg.match(
          new RegExp(`<circle([^>]*)></circle><text[^>]*>${label}</text>`),
        );
        return match ? match[1] : null;
      };
      const coordinate = (attrs, axis) =>
        Number(attrs.match(new RegExp(`${axis}='([^']+)'`))[1]);

      const ego = circle("a");
      const bNode = circle("b");
      const cNode = circle("c");
      expect(ego).not.toBeNull();
      expect(bNode).not.toBeNull();
      expect(cNode).not.toBeNull();

      const centerX = coordinate(ego, "cx");
      const centerY = coordinate(ego, "cy");
      const radiusOf = (attrs) =>
        Math.hypot(
          coordinate(attrs, "cx") - centerX,
          coordinate(attrs, "cy") - centerY,
        );

      // Ring 1 (mutuality) is empty, so b stays on ring 2 (oneHop, radius 150)
      // and c stays on ring 3 (twoHops, radius 220) instead of shifting inward.
      expect(radiusOf(bNode)).toBeCloseTo(150, 0);
      expect(radiusOf(cNode)).toBeCloseTo(220, 0);
    });

    it("keeps padding between the outermost boundary and the canvas edge", () => {
      const { svg } = buildMorenoEgoPlot(
        "a",
        likesGraph,
        dislikesGraph,
        nodePaths,
      );

      // The dashed boundary circles are the only elements with fill='none'.
      const boundaryRadii = [
        ...svg.matchAll(/<circle[^>]*r='([0-9.]+)'[^>]*fill='none'/g),
      ].map((match) => Number(match[1]));
      expect(boundaryRadii.length).toBe(6);

      const canvas = svg.match(/viewBox='0 0 ([0-9.]+) ([0-9.]+)'/);
      expect(canvas).not.toBeNull();
      const width = Number(canvas[1]);

      // The center sits at half the canvas; the outermost boundary must leave
      // at least the canvas padding (60 units) of margin on every side.
      expect(width / 2 - Math.max(...boundaryRadii)).toBeGreaterThanOrEqual(60);
    });

    it("starts each ring at its own random angular offset", () => {
      const members = [
        makeMember("a", "Alice", ["b"], []),
        makeMember("b", "Bob", ["c"], []),
        makeMember("c", "Carol", [], []),
      ];
      const likes = createLikesGraph(members, "likes");
      const dislikes = createLikesGraph(members, "dislikes");

      // Ring 1 (mutuality, empty) consumes the first call; ring 2 (oneHop, b)
      // gets 0.5 turns and ring 3 (twoHops, c) gets 0.25 turns.
      const random = vi
        .spyOn(Math, "random")
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.25)
        .mockReturnValue(0);

      try {
        const { svg } = buildMorenoEgoPlot(
          "a",
          likes,
          dislikes,
          getNodePaths(likes, dislikes),
        );

        const circle = (label) => {
          const match = svg.match(
            new RegExp(`<circle([^>]*)></circle><text[^>]*>${label}</text>`),
          );
          return match ? match[1] : null;
        };
        const coordinate = (attrs, axis) =>
          Number(attrs.match(new RegExp(`${axis}='([^']+)'`))[1]);

        const ego = circle("a");
        const bNode = circle("b");
        const cNode = circle("c");
        const angleOf = (attrs) =>
          Math.atan2(
            coordinate(attrs, "cy") - coordinate(ego, "cy"),
            coordinate(attrs, "cx") - coordinate(ego, "cx"),
          );

        // b (offset 0.5) points straight down; c (offset 0.25) points just
        // clockwise of the reserved north corridor, i.e. π/12 below east.
        expect(angleOf(bNode)).toBeCloseTo(Math.PI / 2, 5);
        expect(angleOf(cNode)).toBeCloseTo(Math.PI / 12, 5);
      } finally {
        random.mockRestore();
      }
    });
  });

  describe("getMorenoEgoPlots", () => {
    it("builds one cached plot per member", () => {
      const members = [
        makeMember("a", "Alice", ["b"], []),
        makeMember("b", "Bob", [], ["a"]),
      ];
      const likes = createLikesGraph(members, "likes");
      const dislikes = createLikesGraph(members, "dislikes");

      const plots = getMorenoEgoPlots(members, likes, dislikes);

      expect(plots.map((plot) => plot.memberId)).toEqual(["a", "b"]);
      plots.forEach((plot) => {
        expect(plot.svg.startsWith("<svg")).toBe(true);
        expect(plot.svg.endsWith("</svg>")).toBe(true);
      });
    });
  });
});
