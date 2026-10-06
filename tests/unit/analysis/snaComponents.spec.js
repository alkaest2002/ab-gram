import { describe, it, expect } from "vitest";

import { createLikesGraph } from "@/analysis/snaBase.js";
import { getSnaComponents } from "@/analysis/snaComponents.js";

const makeMember = (id, likes = []) => ({ id, name: id, likes, dislikes: [] });

const COMPONENT_COLUMNS = [
  "diads",
  "cliques",
  "strongComponentsWithReciprocalEdges",
  "strongComponents",
  "weakComponents",
];

describe("getSnaComponents", () => {
  it("reports diads and cliques for a mutual triangle", () => {
    const members = [
      makeMember("a", ["b", "c"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["a", "b"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const result = getSnaComponents(graph);

    expect(result.rowIndex).toEqual(["likes"]);
    expect(result.columnIndex).toEqual(COMPONENT_COLUMNS);

    const [diads, cliques, reciprocal, strong, weak] = result.values[0];

    expect(diads).toEqual([
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ]);
    expect(cliques).toEqual([["a", "b", "c"]]);
    // A three-member strong component is too small for these categories.
    expect(reciprocal).toEqual([]);
    expect(strong).toEqual([["a", "b", "c"]]);
    expect(weak).toEqual([]);
  });

  it("reports a weak component of at least four members", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["c"]),
      makeMember("c", ["d"]),
      makeMember("d", []),
    ];
    const graph = createLikesGraph(members, "likes");

    const result = getSnaComponents(graph);

    const [diads, cliques, reciprocal, strong, weak] = result.values[0];

    expect(diads).toEqual([]);
    expect(cliques).toEqual([]);
    expect(reciprocal).toEqual([]);
    expect(strong).toEqual([["a"], ["b"], ["c"], ["d"]]);
    expect(weak).toEqual([["a", "b", "c", "d"]]);
  });

  it("reports strongly connected reciprocal components of at least four members", () => {
    const members = [
      makeMember("a", ["b", "d"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", ["b", "d"]),
      makeMember("d", ["a", "c"]),
    ];
    const graph = createLikesGraph(members, "likes");

    const result = getSnaComponents(graph);

    const [diads, cliques, reciprocal, strong, weak] = result.values[0];

    expect(diads).toEqual([
      ["a", "b"],
      ["a", "d"],
      ["b", "c"],
      ["c", "d"],
    ]);
    expect(cliques).toEqual([]);
    expect(reciprocal).toEqual([["a", "b", "c", "d"]]);
    expect(strong).toEqual([["a", "b", "c", "d"]]);
    expect(weak).toEqual([["a", "b", "c", "d"]]);
  });
});
