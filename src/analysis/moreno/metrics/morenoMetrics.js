// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeRankedScores } from "@/analysis/common/commonMetrics";
import { MAX_MEMBERS_COUNT } from "@/utils/sociogram/sociogramValidationFunctions.js";
import {
  computeCohesion,
  computeCohesionTypeII,
  computeConflict,
  computeConflictTypeII,
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
  computeReceivedPreferenceScore,
} from "./individualMetrics.js";

//////////////////////////////////////////////////////////////////////////////////
// GROUP LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/*
MORENO GROUP LEVEL METRICS
- "cohesion":            Group cohesion index, type I (mutual like pairs / total possible pairs)
- "cohesionTypeII":      Group cohesion index, type II (mutual like edges / total likes)
- "conflict":            Group conflict index, type I (mutual dislike pairs / total possible pairs)
- "conflictTypeII":      Group conflict index, type II (mutual dislike edges / total dislikes)
- "positiveReciprocity": Positive reciprocity index (mutual like pairs / total likes)
- "negativeReciprocity": Negative reciprocity index (mutual dislike pairs / total dislikes)
 */
const GROUP_LEVEL_METRIC_KEYS = [
  "cohesion",
  "cohesionTypeII",
  "conflict",
  "conflictTypeII",
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
 *   cohesion (types I and II), conflict (types I and II), positive-reciprocity
 *   and negative-reciprocity metrics.
 */
const computeMorenoGroupLevelMetrics = (adjLikes, adjDislikes) => {
  return np.array([
    [
      computeCohesion(adjLikes),
      computeCohesionTypeII(adjLikes),
      computeConflict(adjDislikes),
      computeConflictTypeII(adjDislikes),
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
- "ss": Sociometric status (codes 0-8, see `computeSociometricStatus`)
- "bns": Bonus, the order-weighted received likes (`computeReceivedPreferenceScore`)
- "mls": Malus, the order-weighted received dislikes (`computeReceivedPreferenceScore`)
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
  "bns",
  "mls",
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
 * @param {Array<{ id: string, likes?: string[], dislikes?: string[] }>} members - All members, in matrix row/column order, used for the order-weighted bonus/malus scores.
 * @returns {import("numpy-ts").NDArray}
 *   A `size` x `INDIVIDUAL_LEVEL_METRIC_KEYS.length` matrix. Rows are members
 *   (aligned with the matrix row/column order) and columns are the metrics in
 *   `INDIVIDUAL_LEVEL_METRIC_KEYS` order.
 */
const computeIndividualLevelMetrics = (adjLikes, adjDislikes, members) => {
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

  // Bonus/malus depend on the order of the preference lists, which the 0/1
  // adjacency matrices do not retain, so they are derived from `members`.
  const bonus = computeReceivedPreferenceScore(members, "likes", MAX_MEMBERS_COUNT);
  const malus = computeReceivedPreferenceScore(members, "dislikes", MAX_MEMBERS_COUNT);

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
    bonus,
    malus,
  ]);
};

//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute Moreno's group-level sociometric metrics and return them as a
 * plain object mirroring a pandas DataFrame.
 *
 * This mirrors `getIndividualLevelMetrics`, but the group is a single
 * observation: there is exactly one row (the group) and one column per metric
 * in `GROUP_LEVEL_METRIC_KEYS`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @returns {{
 *   ids: string[],
 *   metrics: string[],
 *   rawValuesById: number[][],
 *   rawValuesByMetric: number[][],
 *   rankedValuesById: number[][],
 *   rankedValuesByMetric: number[][],
 * }}
 *   `ids` is `["group"]` and `metrics` is the metric name per column (in
 *   `GROUP_LEVEL_METRIC_KEYS` order). `rawValuesById` and `rankedValuesById`
 *   hold the raw and ranked scores with rows indexed by `ids` and columns by
 *   `metrics`; `rawValuesByMetric` and `rankedValuesByMetric` hold the same data
 *   transposed (rows indexed by `metrics`, columns by `ids`).
 */
export const getGroupLevelMetrics = (adjLikes, adjDislikes) => {
  const rawValues = computeMorenoGroupLevelMetrics(adjLikes, adjDislikes);
  const rankedValues = computeRankedScores(rawValues);

  return {
    ids: ["group"],
    metrics: [...GROUP_LEVEL_METRIC_KEYS],
    rawValuesById: rawValues.tolist(),
    rankedValuesById: rankedValues.tolist(),
    rawValuesByMetric: rawValues.T.tolist(),
    rankedValuesByMetric: rankedValues.T.tolist(),
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
 * @param {Array<{ id: string, likes?: string[], dislikes?: string[] }>} members - All members, in the same order as `memberIndices`, used for the order-weighted bonus/malus scores.
 * @returns {{
 *   ids: string[],
 *   metrics: string[],
 *   rawValuesById: number[][],
 *   rawValuesByMetric: number[][],
 *   rankedValuesById: number[][],
 *   rankedValuesByMetric: number[][],
 * }}
 *   `ids` is the member id per row (the `memberIndices` argument) and `metrics`
 *   is the metric name per column (in `INDIVIDUAL_LEVEL_METRIC_KEYS` order).
 *   `rawValuesById[i][j]` and `rankedValuesById[i][j]` hold the raw and ranked
 *   score of member `ids[i]` for metric `metrics[j]`. `rawValuesByMetric` and
 *   `rankedValuesByMetric` hold the same data transposed (rows indexed by
 *   `metrics`, columns by `ids`).
 */
export const getIndividualLevelMetrics = (
  adjLikes,
  adjDislikes,
  memberIndices,
  members,
) => {
  const rawValues = computeIndividualLevelMetrics(adjLikes, adjDislikes, members);
  const rankedValues = computeRankedScores(rawValues);

  return {
    ids: memberIndices,
    metrics: [...INDIVIDUAL_LEVEL_METRIC_KEYS],
    rawValuesById: rawValues.tolist(),
    rankedValuesById: rankedValues.tolist(),
    rawValuesByMetric: rawValues.T.tolist(),
    rankedValuesByMetric: rankedValues.T.tolist(),
  };
};
