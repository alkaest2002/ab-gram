import { describe, it, expect } from "vitest";

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

  describe("getNodePaths", () => {
    it("classifies every node by its shortest directed path length", () => {
      const paths = getNodePaths(graph);

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
  });

  describe("getNodePathsFor", () => {
    it("returns the precomputed paths of a specific node", () => {
      const paths = getNodePaths(graph);

      expect(getNodePathsFor(paths, "a")).toEqual({
        mutuality: ["b"],
        oneHop: ["c"],
        twoHops: ["d"],
        multipleHops: ["e"],
        unreachable: ["f", "g"],
      });
    });

    it("returns undefined for a node that is not present", () => {
      expect(getNodePathsFor(getNodePaths(graph), "z")).toBeUndefined();
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
    const nodePaths = getNodePaths(likesGraph);

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
      expect(countOccurrences(svg, 'fill="#FFFFFF"')).toBe(6);

      // Six dashed boundaries separate the center (ego) and the five rings.
      expect(countOccurrences(svg, 'fill="none"')).toBe(6);

      // d dislikes the ego (red), b and c are reachable (blue), e and f are
      // unreachable (black). e likes the ego but the ego cannot reach e, so it
      // still lands on the unreachable ring.
      expect(svg).toContain('stroke="#FF0000"');
      expect(svg).toContain('stroke="#0000FF"');
      expect(svg).toContain('stroke="#000000"');

      // Direct relationships carry a direction marker: a likes b (outward),
      // d dislikes the ego (inward) and e likes the ego (inward).
      expect(countOccurrences(svg, "<polygon")).toBe(3);
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
        getNodePaths(likes),
      );

      // a likes b (blue stroke + blue outward marker) and c dislikes a (red
      // stroke + red inward marker): two direction markers in total.
      expect(svg).toContain('stroke="#0000FF"');
      expect(svg).toContain('stroke="#FF0000"');
      expect(svg).toContain('fill="#0000FF"');
      expect(svg).toContain('fill="#FF0000"');
      expect(countOccurrences(svg, "<polygon")).toBe(2);
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
        getNodePaths(sparseLikes),
      );

      // a - b is ring 2 (oneHop, radius 135) and a - b - c is ring 3 (twoHops,
      // radius 190). Ring 1 (mutuality) is empty, so b and c keep their ring
      // slots rather than shifting inward: a single ring-3 node is placed
      // straight up from the center at (300, 110).
      const cNode = svg.match(
        /<circle([^>]*)><\/circle><text[^>]*>c<\/text>/,
      );
      expect(cNode).not.toBeNull();
      expect(cNode[1]).toContain('cx="300"');
      expect(cNode[1]).toContain('cy="110"');
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
