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
  it("returns one array per component type and a membersStats object", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const result = getSnaComponents(graph);

    expect(Object.keys(result)).toEqual([...COMPONENT_KEYS, "membersStats"]);
    COMPONENT_KEYS.forEach((key) => expect(result[key]).toBeInstanceOf(Array));
    expect(result.membersStats).toBeInstanceOf(Object);
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

  it("reports, per member, the percentage of each type's components containing it", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const { membersStats } = getSnaComponents(graph);

    // Three dyads; every member appears in exactly two of them.
    expect(membersStats.a.dyads).toBeCloseTo(2 / 3);
    expect(membersStats.b.dyads).toBeCloseTo(2 / 3);
    expect(membersStats.c.dyads).toBeCloseTo(2 / 3);

    // The single clique / strong / weak component contains everyone.
    expect(membersStats.a.cliques).toBe(1);
    expect(membersStats.a.strongComponentsWithReciprocalEdges).toBe(1);
    expect(membersStats.a.strongComponents).toBe(1);
    expect(membersStats.a.weakComponents).toBe(1);
  });

  it("reports 0% for a component type with no components", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["c"]),
      makeMember("c", ["d"]),
      makeMember("d", []),
    ];
    const graph = createLikesGraph(members, "likes");

    const { membersStats } = getSnaComponents(graph);

    // No dyads exist, so no member can be present in one.
    ["a", "b", "c", "d"].forEach((id) =>
      expect(membersStats[id].dyads).toBe(0),
    );
  });
});
