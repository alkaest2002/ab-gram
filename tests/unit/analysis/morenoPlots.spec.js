import { describe, it, expect } from "vitest";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import {
  getDirectedPaths,
  getNodeDirectedPaths,
} from "@/analysis/moreno/plots/morenoPlots.js";

const makeMember = (id, name, likes = [], dislikes = []) => ({
  id,
  name,
  likes,
  dislikes,
});

describe("morenoPlots", () => {
  const members = [
    makeMember("a", "Alice", ["b"]),
    makeMember("b", "Bob", ["c"]),
    makeMember("c", "Carol"),
    makeMember("d", "Dave"),
  ];

  const graph = createLikesGraph(members, "likes");

  describe("getDirectedPaths", () => {
    it("classifies every node by its shortest directed path length", () => {
      const paths = getDirectedPaths(graph);

      expect(paths.a).toEqual({
        directed: ["b"],
        oneHop: ["c"],
        multipleHops: [],
        unreachable: ["d"],
      });

      expect(paths.b).toEqual({
        directed: ["c"],
        oneHop: [],
        multipleHops: [],
        unreachable: ["a", "d"],
      });
    });
  });

  describe("getNodeDirectedPaths", () => {
    it("returns the precomputed paths of a specific node", () => {
      const paths = getDirectedPaths(graph);

      expect(getNodeDirectedPaths(paths, "a")).toEqual({
        directed: ["b"],
        oneHop: ["c"],
        multipleHops: [],
        unreachable: ["d"],
      });
    });

    it("returns undefined for a node that is not present", () => {
      expect(getNodeDirectedPaths(getDirectedPaths(graph), "z")).toBeUndefined();
    });
  });
});
