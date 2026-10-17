import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import {
  createAdjacencyMatrix,
  createAdjacencyMatrices,
  getMemberIndices,
} from "@/analysis/common/adjacencyMatrices.js";
import { getEdgeTypes } from "@/analysis/edges/edgeTypes.js";

const makeMember = (id, likes = [], dislikes = []) => ({ id, likes, dislikes });

describe("createAdjacencyMatrix", () => {
  it("throws for an unknown preference type", () => {
    expect(() => createAdjacencyMatrix([makeMember("a")], "neutral")).toThrow(
      'Unknown preference "neutral". Expected "likes" or "dislikes".',
    );
  });

  it("builds a matrix where rows choose columns", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a", "c"]),
      makeMember("c", []),
    ];

    const matrix = createAdjacencyMatrix(members, "likes");

    expect(matrix.tolist()).toEqual([
      [0, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ]);
  });

  it("ignores references to unknown member ids", () => {
    const members = [makeMember("a", ["b"]), makeMember("b", ["ghost"])];

    const matrix = createAdjacencyMatrix(members, "likes");

    expect(matrix.tolist()).toEqual([
      [0, 1],
      [0, 0],
    ]);
  });
});

describe("createAdjacencyMatrices", () => {
  it("builds both preference matrices", () => {
    const members = [
      makeMember("a", ["b"], ["c"]),
      makeMember("b", [], ["a"]),
      makeMember("c", ["a"], []),
    ];

    const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

    expect(adjLikes.tolist()).toEqual([
      [0, 1, 0],
      [0, 0, 0],
      [1, 0, 0],
    ]);
    expect(adjDislikes.tolist()).toEqual([
      [0, 0, 1],
      [1, 0, 0],
      [0, 0, 0],
    ]);
  });
});

describe("getMemberIndices", () => {
  it("returns member ids in matrix row order", () => {
    const members = [makeMember("a"), makeMember("b"), makeMember("c")];

    expect(getMemberIndices(members)).toEqual(["a", "b", "c"]);
  });
});

describe("getEdgeTypes", () => {
  const classify = (likes, dislikes, memberIndices) =>
    getEdgeTypes(np.array(likes), np.array(dislikes), memberIndices);

  it("classifies a mutual like as type I", () => {
    const result = classify(
      [
        [0, 1],
        [1, 0],
      ],
      [
        [0, 0],
        [0, 0],
      ],
      ["a", "b"],
    );

    expect(result.typeI).toEqual(
      expect.arrayContaining([
        ["a", "b"],
        ["b", "a"],
      ]),
    );
    expect(result.typeI).toHaveLength(2);
    expect(result.typeII).toEqual([]);
  });

  it("classifies a one-sided like as type II", () => {
    const result = classify(
      [
        [0, 1],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
      ],
      ["a", "b"],
    );

    expect(result.typeII).toEqual([["a", "b"]]);
    expect(result.typeI).toEqual([]);
    expect(result.typeIII).toEqual([]);
    expect(result.typeIV).toEqual([]);
    expect(result.typeV).toEqual([]);
    expect(result.typeVI).toEqual([]);
    expect(result.typeVII).toEqual([]);
  });

  it("classifies a one-sided dislike as type III", () => {
    const result = classify(
      [
        [0, 0],
        [0, 0],
      ],
      [
        [0, 1],
        [0, 0],
      ],
      ["a", "b"],
    );

    expect(result.typeIII).toEqual([["a", "b"]]);
    expect(result.typeI).toEqual([]);
    expect(result.typeIV).toEqual([]);
  });

  it("classifies a mutual dislike as type IV", () => {
    const result = classify(
      [
        [0, 0],
        [0, 0],
      ],
      [
        [0, 1],
        [1, 0],
      ],
      ["a", "b"],
    );

    expect(result.typeIV).toEqual(
      expect.arrayContaining([
        ["a", "b"],
        ["b", "a"],
      ]),
    );
    expect(result.typeIV).toHaveLength(2);
  });

  it("classifies an asymmetric like/dislike pair as types V and VI", () => {
    // a likes b; b dislikes a.
    const result = classify(
      [
        [0, 1],
        [0, 0],
      ],
      [
        [0, 0],
        [1, 0],
      ],
      ["a", "b"],
    );

    expect(result.typeV).toEqual([["a", "b"]]);
    expect(result.typeVI).toEqual([["b", "a"]]);
  });

  it("classifies a both-like-and-dislike edge as type VII", () => {
    const result = classify(
      [
        [0, 1],
        [0, 0],
      ],
      [
        [0, 1],
        [0, 0],
      ],
      ["a", "b"],
    );

    expect(result.typeVII).toEqual([["a", "b"]]);
    expect(result.typeI).toEqual([]);
  });

  it("sorts each type's edges by the choosing member id", () => {
    // Both `c -> b` and `a -> b` are one-sided likes. `argwhere` walks the
    // matrix in row-major order, which follows the memberIds order `["c", "a",
    // "b"]`, so the edges come out `[c -> b, a -> b]` before sorting. Sorting
    // by the first element (the choosing member) reorders them to `a -> b` then
    // `c -> b`, regardless of that input order.
    const result = classify(
      [
        [0, 0, 1], // c likes b
        [0, 0, 1], // a likes b
        [0, 0, 0], // b likes nobody
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      ["c", "a", "b"],
    );

    expect(result.typeII).toEqual([
      ["a", "b"],
      ["c", "b"],
    ]);
  });

  it("reports each member's edge types as a share of their total edges", () => {
    const result = classify(
      [
        [0, 1, 0, 0], // a likes b
        [0, 0, 0, 0], // b likes nobody
        [0, 0, 0, 0], // c likes nobody
        [0, 0, 0, 0], // d likes nobody
      ],
      [
        [0, 0, 1, 0], // a dislikes c
        [0, 0, 0, 0], // b dislikes nobody
        [1, 0, 0, 0], // c dislikes a
        [0, 0, 0, 0], // d dislikes nobody
      ],
      ["a", "b", "c", "d"],
    );

    expect(result.memberInEdges.a).toEqual({
      typeI: 0,
      typeII: 0.5,
      typeIII: 0,
      typeIV: 0.5,
      typeV: 0,
      typeVI: 0,
      typeVII: 0,
    });
    // `b` only receives a one-sided like; it never chooses anyone, so it has
    // no attributed edges of its own.
    expect(result.memberInEdges.b).toEqual({
      typeI: 0,
      typeII: 0,
      typeIII: 0,
      typeIV: 0,
      typeV: 0,
      typeVI: 0,
      typeVII: 0,
    });
    expect(result.memberInEdges.c).toEqual({
      typeI: 0,
      typeII: 0,
      typeIII: 0,
      typeIV: 1,
      typeV: 0,
      typeVI: 0,
      typeVII: 0,
    });
    expect(result.memberInEdges.d).toEqual({
      typeI: 0,
      typeII: 0,
      typeIII: 0,
      typeIV: 0,
      typeV: 0,
      typeVI: 0,
      typeVII: 0,
    });
  });

  it("keeps zero shares (not NaN) for members with no edges", () => {
    const result = classify(
      [
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
      ],
      ["a", "b"],
    );

    const zeroShares = {
      typeI: 0,
      typeII: 0,
      typeIII: 0,
      typeIV: 0,
      typeV: 0,
      typeVI: 0,
      typeVII: 0,
    };

    expect(result.memberInEdges.a).toEqual(zeroShares);
    expect(result.memberInEdges.b).toEqual(zeroShares);
  });
});
