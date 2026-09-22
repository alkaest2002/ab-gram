/*
MORENO CLASSIC
- "rp": Received positive nominations (in-degree from likes adjacency matrix)
- "rr": Received negative nominations (in-degree from dislikes adjacency matrix)
- "gp": Given positive nominations (out-degree likes adjacency matrix)
- "gr": Given negative nominations (out-degree from dislikes adjacency matrix)
- "mp": Mutual positive connections (bidirectional positive edges)
- "mr": Mutual negative connections (bidirectional negative edges)
- "im": Impact index (rp + rr)
- "bl": Balance index (rp - rr)
- "ei": Expressivity index (gp + gr)
- "or": Orientation index (gp - gr)
- "ai": Affiliation index (bl + or)
- "ii": Influence index (rp + mp)
*/

import * as np from "numpy-ts";

import { createAdjacencyMatrices } from "@/utils/analysis/adjacencyMatrixRelated";

/**
 * The Moreno classic metric keys, in the order they appear as columns of the
 * result matrix. Column `i` of a Moreno result holds the metric named by
 * `METRIC_KEYS[i]`.
 */
const METRIC_KEYS = [
  "rp",
  "rr",
  "gp",
  "gr",
  "mp",
  "mr",
  "im",
  "bl",
  "ei",
  "or",
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
const getAdjacencyMatrices = (members) => {
  const key = membersCacheKey(members);

  const cached = adjacencyMatricesCache.get(key);
  if (cached) return cached;

  const matrices = createAdjacencyMatrices(members);
  adjacencyMatricesCache.set(key, matrices);

  return matrices;
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
const morenoClassic = (adjA, adjB) => {
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
  const impact = rp.add(rr);
  const balance = rp.subtract(rr);
  const expressivity = gp.add(gr);
  const orientation = gp.subtract(gr);
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
    impact,
    balance,
    expressivity,
    orientation,
    affiliation,
    influence,
  ]);
};

/**
 * Compute Moreno's classic sociometric indices and return them as a plain
 * object mirroring a pandas DataFrame.
 *
 * This is the module's single entry point: it builds the adjacency matrices,
 * computes the indices, and converts the resulting NDArray to plain data only
 * at this final boundary.
 *
 * @param {import("@/stores/sociogram").Member[]} members
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is the member id per row, `columnIndex` is the metric name per
 *   column (in `METRIC_KEYS` order), and `values[i][j]` is the score of member
 *   `rowIndex[i]` for metric `columnIndex[j]`.
 */
export const getMorenoClassic = (members) => {
  const { adjLikes, adjDislikes } = getAdjacencyMatrices(members);
  const result = morenoClassic(adjLikes, adjDislikes);

  return {
    rowIndex: members.map((member) => member.id),
    columnIndex: [...METRIC_KEYS],
    values: result.tolist(),
  };
};
