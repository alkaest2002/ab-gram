import * as np from "numpy-ts";
import {
  computeCohesion,
  computeConflict,
  computePositiveReciprocity,
  computeNegativeReciprocity,
} from "./groupMetrics.js";
import {
  computeReceivedPositive,
  computeReceivedNegative,
  computeGivenPositive,
  computeGivenNegative,
  computeMutualPositive,
  computeMutualNegative,
  computeImpact,
  computeBalance,
  computeExpressivity,
  computeOrientation,
  computeAffiliation,
  computeInfluence,
  computeSociometricStatus,
} from "./individualMetrics.js";

//////////////////////////////////////////////////////////////////////////////////
// GROUP LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/*
MORENO GROUP LEVEL METRICS
- "cohesion":            Group cohesion index (mutual like pairs / total possible pairs)
- "conflict":            Group conflict index (mutual dislike pairs / total possible pairs)
- "positiveReciprocity": Positive reciprocity index (mutual like pairs / total likes)
- "negativeReciprocity": Negative reciprocity index (mutual dislike pairs / total dislikes)
 */
const GROUP_LEVEL_METRIC_KEYS = [
  "cohesion",
  "conflict",
  "positiveReciprocity",
  "negativeReciprocity",
];

/**
 * Compute Moreno's group-level sociometric metrics.
 *
 * `adjLikes` is the "likes" adjacency matrix and `adjDislikes` the "dislikes"
 * one, both following the `members` ordering produced by
 * `createAdjacencyMatrices`, so `matrix[i][j] === 1` means member `i` chose
 * member `j`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray}
 *   A `1` x `GROUP_LEVEL_METRIC_KEYS.length` matrix holding, in column order, the
 *   cohesion, conflict, positive-reciprocity and negative-reciprocity metrics.
 */
const computeMorenoGroupLevelMetrics = (adjLikes, adjDislikes) => {
  return np.array([
    [
      computeCohesion(adjLikes),
      computeConflict(adjDislikes),
      computePositiveReciprocity(adjLikes),
      computeNegativeReciprocity(adjDislikes),
    ],
  ]);
};


//////////////////////////////////////////////////////////////////////////////////
// INDIVIDUAL LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/*
MORENO INDIVIDUAL LEVEL METRICS
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
- "ss": Sociometric status (0 to 8, see SOCIOMETRIC STATUS CODES below)
*/
const INDIVIDUAL_LEVEL_METRIC_KEYS = [
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
  "ss",
];

/**
 * Compute Moreno's sociometric indices for every member.
 *
 * `adjLikes` is the "likes" adjacency matrix and `adjDislikes` the "dislikes"
 * one, both following the `members` ordering produced by
 * `createAdjacencyMatrices`, so `matrix[i][j] === 1` means member `i` chose
 * member `j`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray}
 *   A `size` x `INDIVIDUAL_LEVEL_METRIC_KEYS.length` matrix. Rows are members
 *   (aligned with the matrix row/column order) and columns are the metrics in
 *   `INDIVIDUAL_LEVEL_METRIC_KEYS` order.
 */
const computeIndividualLevelMetrics = (adjLikes, adjDislikes) => {
  const size = adjLikes.shape[0];
  if (size === 0) return np.empty([0, INDIVIDUAL_LEVEL_METRIC_KEYS.length]);

  // Received nominations: column sums (how many members chose me).
  const rp = computeReceivedPositive(adjLikes);
  const rr = computeReceivedNegative(adjDislikes);

  // Given nominations: row sums (how many members I chose).
  const gp = computeGivenPositive(adjLikes);
  const gr = computeGivenNegative(adjDislikes);

  // Mutual connections: A[i][j] && A[j][i] === elementwise A * A^T.
  const mp = computeMutualPositive(adjLikes);
  const mr = computeMutualNegative(adjDislikes);

  // Derived indices.
  const impact = computeImpact(rp, rr);
  const balance = computeBalance(rp, rr);
  const expressivity = computeExpressivity(gp, gr);
  const orientation = computeOrientation(gp, gr);
  const affiliation = computeAffiliation(balance, orientation);
  const influence = computeInfluence(rp, mp);
  const sociometricStatus = computeSociometricStatus(rp, rr, expressivity, impact);

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
    sociometricStatus,
  ]);
};

//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute Moreno's group-level sociometric metrics and return them as a
 * plain object mirroring a pandas DataFrame.
 *
 * This mirrors `getMorenoIndividualLevelMetrics`, but the group is a single
 * observation: there is exactly one row (the group) and one column per metric
 * in `GROUP_LEVEL_METRIC_KEYS`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is `["group"]`, `columnIndex` is the metric name per column
 *   (in `GROUP_LEVEL_METRIC_KEYS` order), and `values` holds the single group row.
 */
export const getGroupLevelMetrics = (adjLikes, adjDislikes) => {
  const result = computeMorenoGroupLevelMetrics(adjLikes, adjDislikes);

  return {
    rowIndex: ["group"],
    columnIndex: [...GROUP_LEVEL_METRIC_KEYS],
    values: result.tolist(),
  };
};

/**
 * Compute Moreno's classic sociometric indices and return them as a plain
 * object mirroring a pandas DataFrame.
 *
 * This is the module's entry point for individual-level indices: it receives
 * the already-built adjacency matrices, computes the indices, and converts the
 * resulting NDArray to plain data only at this final boundary.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @param {string[]} memberIndices - Member ids aligned with the matrix row/column
 *   order.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is the member id per row, `columnIndex` is the metric name per
 *   column (in `INDIVIDUAL_LEVEL_METRIC_KEYS` order), and `values[i][j]` is the
 *   score of member `rowIndex[i]` for metric `columnIndex[j]`.
 */
export const getIndividualLevelMetrics = (
  adjLikes,
  adjDislikes,
  memberIndices,
) => {
  const result = computeIndividualLevelMetrics(adjLikes, adjDislikes);

  return {
    rowIndex: memberIndices,
    columnIndex: [...INDIVIDUAL_LEVEL_METRIC_KEYS],
    values: result.tolist(),
  };
};
