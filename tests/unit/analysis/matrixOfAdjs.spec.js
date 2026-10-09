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

  it("classifies a one-sided like as type I", () => {
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

    expect(result.typeI).toEqual([["a", "b"]]);
    expect(result.typeII).toEqual([]);
    expect(result.typeIII).toEqual([]);
    expect(result.typeIV).toEqual([]);
    expect(result.typeV).toEqual([]);
    expect(result.typeVI).toEqual([]);
    expect(result.typeVII).toEqual([]);
  });

  it("classifies a mutual like as type II", () => {
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

    expect(result.typeII).toEqual(
      expect.arrayContaining([
        ["a", "b"],
        ["b", "a"],
      ]),
    );
    expect(result.typeII).toHaveLength(2);
    expect(result.typeI).toEqual([]);
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
});
