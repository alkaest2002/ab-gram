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
    makeMember("a", "Alice", ["b"]),
    makeMember("b", "Bob", ["c"]),
    makeMember("c", "Carol"),
    makeMember("d", "Dave"),
  ];

  const graph = createLikesGraph(members, "likes");

  describe("getNodePaths", () => {
    it("classifies every node by its shortest undirected path length", () => {
      const paths = getNodePaths(graph);

      expect(paths.a).toEqual({
        oneHop: ["b"],
        twoHops: ["c"],
        multipleHops: [],
        unreachable: ["d"],
      });

      expect(paths.b).toEqual({
        oneHop: ["a", "c"],
        twoHops: [],
        multipleHops: [],
        unreachable: ["d"],
      });

      expect(paths.c).toEqual({
        oneHop: ["b"],
        twoHops: ["a"],
        multipleHops: [],
        unreachable: ["d"],
      });
    });
  });

  describe("getNodePathsFor", () => {
    it("returns the precomputed paths of a specific node", () => {
      const paths = getNodePaths(graph);

      expect(getNodePathsFor(paths, "a")).toEqual({
        oneHop: ["b"],
        twoHops: ["c"],
        multipleHops: [],
        unreachable: ["d"],
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

      // The ego plus b, c, e (reachable) and d, f (unreachable) = six nodes.
      expect(countOccurrences(svg, 'fill="#FFFFFF"')).toBe(6);

      // Five dashed boundaries separate the center (ego) and the four rings.
      expect(countOccurrences(svg, 'fill="none"')).toBe(5);

      // d dislikes the ego (red), b, c and e are reachable (blue), f is
      // unreachable (black).
      expect(svg).toContain('stroke="#FF0000"');
      expect(svg).toContain('stroke="#0000FF"');
      expect(svg).toContain('stroke="#000000"');

      // d dislikes the ego and e likes it: two direction markers.
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

      // a - b is ring 1 (radius 80) and a - b - c is ring 2 (radius 135).
      // Ring 3 is empty, so c must stay on ring 2 rather than shifting inward:
      // a single ring-2 node is placed straight up from the center at (300, 165).
      const cNode = svg.match(
        /<circle([^>]*)><\/circle><text[^>]*>c<\/text>/,
      );
      expect(cNode).not.toBeNull();
      expect(cNode[1]).toContain('cx="300"');
      expect(cNode[1]).toContain('cy="165"');
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
