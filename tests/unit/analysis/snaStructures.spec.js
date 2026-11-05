// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import { getSnaStructures } from "@/analysis/sna/structures/snaStructures.js";

const makeMember = (id, likes = []) => ({ id, name: id, likes, dislikes: [] });

const STRUCTURE_KEYS = [
  "asymmetricDyads",
  "symmetricDyads",
  "cliques",
  "strongComponentsWithReciprocalEdges",
  "strongComponents",
  "weakComponents",
];

describe("getSnaStructures", () => {
  it("returns one object per structure type and the louvain communities", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const result = getSnaStructures(graph);

    expect(Object.keys(result)).toEqual([...STRUCTURE_KEYS, "louvainCommunities"]);
    STRUCTURE_KEYS.forEach((key) => {
      expect(result[key]).toHaveProperty("structures");
      expect(result[key].structures).toBeInstanceOf(Array);
    });

    expect(result.louvainCommunities).toHaveProperty("structures");
    expect(result.louvainCommunities).toHaveProperty("modularity");
    expect(result.louvainCommunities.structures).toBeInstanceOf(Array);
    expect(typeof result.louvainCommunities.modularity).toBe("number");
  });

  it("reports symmetric dyads and cliques for a mutual triangle", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const {
      asymmetricDyads,
      symmetricDyads,
      cliques,
      strongComponentsWithReciprocalEdges,
      strongComponents,
      weakComponents,
    } = getSnaStructures(graph);

    expect(asymmetricDyads.structures).toEqual([]);
    expect(symmetricDyads.structures).toEqual([
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ]);
    expect(cliques.structures).toEqual([["a", "b", "c"]]);
    expect(strongComponentsWithReciprocalEdges.structures).toEqual([["a", "b", "c"]]);
    expect(strongComponents.structures).toEqual([["a", "b", "c"]]);
    expect(weakComponents.structures).toEqual([["a", "b", "c"]]);
  });

  it("separates asymmetric and symmetric dyads", () => {
    const members = [makeMember("a", ["b", "c"]), makeMember("b", ["a"]), makeMember("c", [])];
    const graph = createLikesGraph(members, "likes");

    const { asymmetricDyads, symmetricDyads } = getSnaStructures(graph);

    expect(asymmetricDyads.structures).toEqual([["a", "c"]]);
    expect(symmetricDyads.structures).toEqual([["a", "b"]]);
  });

  it("drops strong and weak components smaller than three members", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["c"]),
      makeMember("c", ["d"]),
      makeMember("d", []),
    ];
    const graph = createLikesGraph(members, "likes");

    const {
      asymmetricDyads,
      symmetricDyads,
      cliques,
      strongComponentsWithReciprocalEdges,
      strongComponents,
      weakComponents,
    } = getSnaStructures(graph);

    expect(asymmetricDyads.structures).toEqual([
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
    ]);
    expect(symmetricDyads.structures).toEqual([]);
    expect(cliques.structures).toEqual([]);
    expect(strongComponentsWithReciprocalEdges.structures).toEqual([]);
    // Each node is its own strongly connected component, so every one is
    // smaller than the three-member minimum.
    expect(strongComponents.structures).toEqual([]);
    expect(weakComponents.structures).toEqual([["a", "b", "c", "d"]]);
  });

  it("reports strongly connected reciprocal components of at least three members", () => {
    const members = [
      makeMember("a", ["b", "d"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["b", "d"]),
      makeMember("d", ["a", "c"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const {
      asymmetricDyads,
      symmetricDyads,
      cliques,
      strongComponentsWithReciprocalEdges,
      strongComponents,
      weakComponents,
    } = getSnaStructures(graph);

    expect(asymmetricDyads.structures).toEqual([]);
    expect(symmetricDyads.structures).toEqual([
      ["a", "b"],
      ["a", "d"],
      ["b", "c"],
      ["c", "d"],
    ]);
    expect(cliques.structures).toEqual([]);
    expect(strongComponentsWithReciprocalEdges.structures).toEqual([["a", "b", "c", "d"]]);
    expect(strongComponents.structures).toEqual([["a", "b", "c", "d"]]);
    expect(weakComponents.structures).toEqual([["a", "b", "c", "d"]]);
  });

  it("reports louvain communities as a partition of every member", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const { louvainCommunities } = getSnaStructures(graph, { seed: 42, runs: 5 });

    // A partition: every member appears exactly once across the communities.
    expect(louvainCommunities.structures.flat().sort()).toEqual(["a", "b", "c"]);
    expect(Number.isFinite(louvainCommunities.modularity)).toBe(true);
  });

  it("returns singleton communities and q = 0 for an edgeless graph", () => {
    const members = [makeMember("a"), makeMember("b"), makeMember("c")];
    const graph = createLikesGraph(members, "likes");

    const { louvainCommunities } = getSnaStructures(graph);

    expect(louvainCommunities.modularity).toBe(0);
    expect(louvainCommunities.structures).toEqual([["a"], ["b"], ["c"]]);
  });
});
