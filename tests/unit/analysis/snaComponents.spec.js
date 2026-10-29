// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import { getSnaComponents } from "@/analysis/sna/components/snaComponents.js";

const makeMember = (id, likes = []) => ({ id, name: id, likes, dislikes: [] });

const COMPONENT_KEYS = [
  "dyads",
  "cliques",
  "strongComponentsWithReciprocalEdges",
  "strongComponents",
  "weakComponents",
];

describe("getSnaComponents", () => {
  it("returns one array per component type and the louvain communities", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const result = getSnaComponents(graph);

    expect(Object.keys(result)).toEqual([...COMPONENT_KEYS, "louvainCommunities"]);
    COMPONENT_KEYS.forEach((key) => expect(result[key]).toBeInstanceOf(Array));

    expect(result.louvainCommunities).toHaveProperty("communities");
    expect(result.louvainCommunities).toHaveProperty("q");
    expect(result.louvainCommunities.communities).toBeInstanceOf(Array);
    expect(typeof result.louvainCommunities.q).toBe("number");
  });

  it("reports dyads and cliques for a mutual triangle", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const {
      dyads,
      cliques,
      strongComponentsWithReciprocalEdges,
      strongComponents,
      weakComponents,
    } = getSnaComponents(graph);

    expect(dyads).toEqual([
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ]);
    expect(cliques).toEqual([["a", "b", "c"]]);
    expect(strongComponentsWithReciprocalEdges).toEqual([["a", "b", "c"]]);
    expect(strongComponents).toEqual([["a", "b", "c"]]);
    expect(weakComponents).toEqual([["a", "b", "c"]]);
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
      dyads,
      cliques,
      strongComponentsWithReciprocalEdges,
      strongComponents,
      weakComponents,
    } = getSnaComponents(graph);

    expect(dyads).toEqual([]);
    expect(cliques).toEqual([]);
    expect(strongComponentsWithReciprocalEdges).toEqual([]);
    // Each node is its own strongly connected component, so every one is
    // smaller than the three-member minimum.
    expect(strongComponents).toEqual([]);
    expect(weakComponents).toEqual([["a", "b", "c", "d"]]);
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
      dyads,
      cliques,
      strongComponentsWithReciprocalEdges,
      strongComponents,
      weakComponents,
    } = getSnaComponents(graph);

    expect(dyads).toEqual([
      ["a", "b"],
      ["a", "d"],
      ["b", "c"],
      ["c", "d"],
    ]);
    expect(cliques).toEqual([]);
    expect(strongComponentsWithReciprocalEdges).toEqual([["a", "b", "c", "d"]]);
    expect(strongComponents).toEqual([["a", "b", "c", "d"]]);
    expect(weakComponents).toEqual([["a", "b", "c", "d"]]);
  });

  it("reports louvain communities as a partition of every member", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const { louvainCommunities } = getSnaComponents(graph, { seed: 42, runs: 5 });

    // A partition: every member appears exactly once across the communities.
    expect(louvainCommunities.communities.flat().sort()).toEqual(["a", "b", "c"]);
    expect(Number.isFinite(louvainCommunities.q)).toBe(true);
  });

  it("returns singleton communities and q = 0 for an edgeless graph", () => {
    const members = [
      makeMember("a"),
      makeMember("b"),
      makeMember("c"),
    ];
    const graph = createLikesGraph(members, "likes");

    const { louvainCommunities } = getSnaComponents(graph);

    expect(louvainCommunities.q).toBe(0);
    expect(louvainCommunities.communities).toEqual([["a"], ["b"], ["c"]]);
  });
});
