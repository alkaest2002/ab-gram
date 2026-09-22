/*
MORENO CLASSIC
- "rp": Received positive nominations (in-degree from likes adjacency matrix)
- "rr": Received negative nominations (in-degree from dislikes adjacency matrix)
- "gp": Given positive nominations (out-degree likes adjacency matrix)
- "gr": Given negative nominations (out-degree from dislikes adjacency matrix)
- "mp": Mutual positive connections (bidirectional positive edges)
- "mr": Mutual negative connections (bidirectional negative edges)
- "bl": Balance index (rp - rr)
- "or": Orientation index (gp - gr)
- "im": Impact index (rp + rr)
- "ai": Affiliation index (bl + or)
- "ii": Influence index (rp + mp)
*/

import * as np from "numpy-ts";

import { createAdjacencyMatrices } from "@/utils/analysis/adjacencyMatrix";

/**
 * Stable cache key for a group of members. Serializing only the fields the
 * adjacency matrices depend on (id, likes, dislikes) keeps the key cheap while
 * still distinguishing every member ordering and preference change.
 *
 * @param {import("@/stores/sociogram").Member[]} members
 * @returns {string}
 */
const membersCacheKey = (members) =>
  JSON.stringify(
    members.map(({ id, likes, dislikes }) => [id, likes, dislikes])
  );

/**
 * Cache of adjacency matrices keyed by a serialized snapshot of the members.
 * @type {Map<string, { adjLikes: number[][], adjDislikes: number[][] }>}
 */
const adjacencyMatricesCache = new Map();

/**
 * Build (or reuse) the likes/dislikes adjacency matrices for a group.
 *
 * The matrices are memoized so repeated computations over the same members do
 * not rebuild the same structures. Callers must treat the returned matrices as
 * read-only.
 *
 * @param {import("@/stores/sociogram").Member[]} members
 * @returns {{ adjLikes: number[][], adjDislikes: number[][] }}
 */
export const getAdjacencyMatrices = (members) => {
  const key = membersCacheKey(members);

  const cached = adjacencyMatricesCache.get(key);
  if (cached) return cached;

  const matrices = createAdjacencyMatrices(members);
  adjacencyMatricesCache.set(key, matrices);

  return matrices;
};

/**
 * The Moreno classic metric keys, in the order they appear as columns of the
 * result matrix. Column `i` of a Moreno result holds the metric named by
 * `METRIC_KEYS[i]`.
 */
export const METRIC_KEYS = [
  "rp",
  "rr",
  "gp",
  "gr",
  "mp",
  "mr",
  "bl",
  "or",
  "im",
  "ai",
  "ii",
];

/**
 * Build an object with one empty array per metric key.
 * @returns {Record<string, number[]>}
 */
const emptyMetrics = () => {
  const metrics = {};
  for (const key of METRIC_KEYS) metrics[key] = [];
  return metrics;
};

/**
 * Empty result shapes returned when there are no members to analyze.
 */
const EMPTY_RAW_METRICS = Object.freeze(emptyMetrics());
const EMPTY_RANKED_METRICS = Object.freeze(emptyMetrics());

/**
 * Assign 1-based dense ranks, ordering by descending value.
 *
 * Ties share the same rank and the next distinct value continues at the
 * following rank: `[10, 10, 5, 5, 1]` becomes `[1, 1, 2, 2, 3]`.
 *
 * @param {number[]} values
 * @returns {number[]}
 */
const denseRank = (values) => {
  const unique = [...new Set(values)].sort((a, b) => b - a);
  const rankByValue = new Map(unique.map((value, index) => [value, index + 1]));
  return values.map((value) => rankByValue.get(value));
};

/**
 * Compute Moreno's classic sociometric indices for every member.
 *
 * `adjA` is the "likes" adjacency matrix and `adjB` the "dislikes" one, both
 * following the `members` ordering produced by `createAdjacencyMatrices`, so
 * `matrix[i][j] === 1` means member `i` chose member `j`.
 *
 * @param {number[][]} adjA - Likes adjacency matrix.
 * @param {number[][]} adjB - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray}
 *   A `size` x `METRIC_KEYS.length` matrix. Rows are members (aligned with the
 *   matrix row/column order) and columns are the metrics in `METRIC_KEYS` order.
 */
export const morenoClassic = (adjA, adjB) => {
  const size = adjA.length;
  if (size === 0) return np.empty([0, METRIC_KEYS.length]);

  const likes = np.array(adjA);
  const dislikes = np.array(adjB);

  // Received nominations: column sums (how many members chose me).
  const rp = likes.sum(0);
  const rr = dislikes.sum(0);

  // Given nominations: row sums (how many members I chose).
  const gp = likes.sum(1);
  const gr = dislikes.sum(1);

  // Mutual connections: A[i][j] && A[j][i] === elementwise A * A^T.
  const mp = likes.multiply(likes.T).sum(1);
  const mr = dislikes.multiply(dislikes.T).sum(1);

  // Derived indices.
  const balance = rp.subtract(rr);
  const orientation = gp.subtract(gr);
  const impact = rp.add(rr);
  const affiliation = balance.add(orientation);
  const influence = rp.add(mp);

  // Stack every metric as a column, keeping the numpy array until export.
  return np.column_stack([
    rp,
    rr,
    gp,
    gr,
    mp,
    mr,
    balance,
    orientation,
    impact,
    affiliation,
    influence,
  ]);
};

/**
 * Export a Moreno classic result to a standard (nested) JavaScript array.
 *
 * This is the only place the numpy array is converted back to a plain array,
 * so keep the NDArray returned by {@link morenoClassic} for as long as possible
 * and call this only when a plain array is required (rendering, serialization,
 * JSON output, ...).
 *
 * @param {import("numpy-ts").NDArray} result - A result from {@link morenoClassic}.
 * @returns {number[][]} Rows are members and columns are the metrics in
 *   `METRIC_KEYS` order.
 */
export const exportMorenoClassic = (result) => result.tolist();
