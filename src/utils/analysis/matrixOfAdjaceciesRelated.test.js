import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createAdjacencyMatrices,
  getEdgesTypes,
  getMemberIndices,
} from "./matrixOfAdjaceciesRelated.js";

const TYPE_KEYS = [
  "typeI",
  "typeII",
  "typeIII",
  "typeIV",
  "typeV",
  "typeVI",
  "typeVII",
];

/** Build a minimal member object (name mirrors id for readability). */
const member = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
  noLikes: likes.length === 0,
  noDislikes: dislikes.length === 0,
});

/**
 * Plain-JS reference implementation of the documented rules, returning
 * `[sourceIndex, targetIndex]` pairs. Used to validate the vectorized
 * numpy-ts implementation against a direct, easily-audited translation.
 *
 * A "both" reverse feeling (B likes AND dislikes A) counts as both a like and
 * a dislike, so a single edge can be pushed into two different categories.
 */
function referenceGetEdgesTypes(adjLikes, adjDislikes) {
  const size = adjLikes.length;
  const result = Object.fromEntries(TYPE_KEYS.map((key) => [key, []]));

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      if (i === j) continue;

      const likesAB = adjLikes[i][j];
      const dislikesAB = adjDislikes[i][j];
      const likesBA = adjLikes[j][i];
      const dislikesBA = adjDislikes[j][i];

      if (likesAB && dislikesAB) {
        result.typeVII.push([i, j]); // A likes and dislikes B
      } else if (likesAB && !dislikesAB) {
        // A likes B only; the reverse may contribute to both views below.
        if (!likesBA && !dislikesBA) result.typeI.push([i, j]);
        if (likesBA) result.typeII.push([i, j]);
        if (dislikesBA) result.typeV.push([i, j]);
      } else if (!likesAB && dislikesAB) {
        // A dislikes B only; the reverse may contribute to both views below.
        if (!likesBA && !dislikesBA) result.typeIII.push([i, j]);
        if (dislikesBA) result.typeIV.push([i, j]);
        if (likesBA) result.typeVI.push([i, j]);
      }
    }
  }

  return result;
}

/** Convert id-based edge lists into `[sourceIndex, targetIndex]` pairs. */
function toIndexPairs(result, idToIndex) {
  return Object.fromEntries(
    TYPE_KEYS.map((key) => [
      key,
      result[key].map(([a, b]) => [idToIndex[a], idToIndex[b]]),
    ]),
  );
}

test("classifies every edge type with the expected member ids", () => {
  const members = [
    member("A", ["B", "C"]), // A -> B: type I, A -> C: type V
    member("B", ["D"], ["D"]), // B -> D: type VII (likes and dislikes)
    member("C", ["D"], ["A"]), // C -> D: type II, C -> A: type VI
    member("D", ["C"]), // D -> C: type II (mutual with C)
    member("E", [], ["F"]), // E -> F: type III
    member("F"),
    member("G", [], ["H"]), // G -> H: type IV (mutual with H)
    member("H", [], ["G"]), // H -> G: type IV
  ];

  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
  const result = getEdgesTypes(adjLikes, adjDislikes, getMemberIndices(members));

  assert.deepEqual(result, {
    typeI: [["A", "B"]],
    typeII: [
      ["C", "D"],
      ["D", "C"],
    ],
    typeIII: [["E", "F"]],
    typeIV: [
      ["G", "H"],
      ["H", "G"],
    ],
    typeV: [["A", "C"]],
    typeVI: [["C", "A"]],
    typeVII: [["B", "D"]],
  });
});

test("matches a plain-JS reference across every 3-member preference state", () => {
  const ids = ["A", "B", "C"];
  const idToIndex = { A: 0, B: 1, C: 2 };

  // The six directed non-self pairs of a 3-member group, each in one of four
  // states: nothing (0), like (1), dislike (2), both (3).
  const pairs = [
    [0, 1],
    [1, 0],
    [0, 2],
    [2, 0],
    [1, 2],
    [2, 1],
  ];
  const total = 4 ** pairs.length;

  for (let code = 0; code < total; code += 1) {
    const likes = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const dislikes = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    let state = code;
    for (const [i, j] of pairs) {
      likes[i][j] = state % 2;
      dislikes[i][j] = (state >> 1) % 2;
      state = Math.floor(state / 4);
    }

    const expected = referenceGetEdgesTypes(likes, dislikes);
    const actual = toIndexPairs(getEdgesTypes(likes, dislikes, ids), idToIndex);

    assert.deepEqual(actual, expected, `preference state ${code}`);
  }
});

test("returns empty lists when there are no members", () => {
  assert.deepEqual(getEdgesTypes([], [], []), {
    typeI: [],
    typeII: [],
    typeIII: [],
    typeIV: [],
    typeV: [],
    typeVI: [],
    typeVII: [],
  });
});

test("a single member with no choices produces no edges", () => {
  const members = [member("A")];
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
  const result = getEdgesTypes(adjLikes, adjDislikes, getMemberIndices(members));

  assert.deepEqual(result, {
    typeI: [],
    typeII: [],
    typeIII: [],
    typeIV: [],
    typeV: [],
    typeVI: [],
    typeVII: [],
  });
});

test("forward like with a both reverse lands in typeII and typeV", () => {
  const members = [
    member("A", ["B"]), // A likes B (only)
    member("B", ["A"], ["A"]), // B likes AND dislikes A
  ];
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
  const result = getEdgesTypes(adjLikes, adjDislikes, getMemberIndices(members));

  assert.deepEqual(result, {
    typeI: [],
    typeII: [["A", "B"]], // mutual-like component
    typeIII: [],
    typeIV: [],
    typeV: [["A", "B"]], // conflict component
    typeVI: [],
    typeVII: [["B", "A"]], // B is ambivalent about A
  });
});

test("forward dislike with a both reverse lands in typeIV and typeVI", () => {
  const members = [
    member("A", [], ["B"]), // A dislikes B (only)
    member("B", ["A"], ["A"]), // B likes AND dislikes A
  ];
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
  const result = getEdgesTypes(adjLikes, adjDislikes, getMemberIndices(members));

  assert.deepEqual(result, {
    typeI: [],
    typeII: [],
    typeIII: [],
    typeIV: [["A", "B"]], // mutual-dislike component
    typeV: [],
    typeVI: [["A", "B"]], // conflict component
    typeVII: [["B", "A"]], // B is ambivalent about A
  });
});
