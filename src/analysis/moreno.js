/*
MORENO GROUP LEVEL METRICS
- "cohesion": Group cohesion coefficient (total reciprocal like pairs / total choices)
- "tension": Group tension coefficient (total dislikes / total choices)

Where, summed over the whole group:
  - total likes       = sum of the likes adjacency matrix (every "like" nomination)
  - total dislikes    = sum of the dislikes adjacency matrix (every "dislike" nomination)
  - total choices     = total likes + total dislikes (every nomination)
  - reciprocal pairs  = number of mutual like pairs (A likes B AND B likes A),
                        each distinct pair counted once

So:
  - cohesion = reciprocal pairs / (total likes + total dislikes)
  - tension  = total dislikes   / (total likes + total dislikes)

Both coefficients range in [0, 1], and an empty group (no nominations) yields
0 for both.
*/

/**
 * Compute Moreno's group-level sociometric coefficients.
 *
 * `adjA` is the "likes" adjacency matrix and `adjB` the "dislikes" one, both
 * following the `members` ordering produced by `createAdjacencyMatrices`, so
 * `matrix[i][j] === 1` means member `i` chose member `j`.
 *
 * @param {number[][]} adjA - Likes adjacency matrix.
 * @param {number[][]} adjB - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray}
 *   A `1` x `GROUP_METRIC_KEYS.length` matrix holding, in column order, the
 *   cohesion and tension coefficients.
 */
const computeMorenoGroupLevelMetrics = (adjA, adjB) => {
  const likes = np.array(adjA);
  const dislikes = np.array(adjB);

  // Total directed nominations of each preference kind.
  const totalLikes = likes.sum();
  const totalDislikes = dislikes.sum();

  // Number of mutual (reciprocal) like pairs. `likes * likes.T` is non-zero
  // exactly where both directions of a like exist; its sum counts each mutual
  // pair twice (once per direction), so halve it to count distinct pairs.
  const totalReciprocalLikes = likes.multiply(likes.T).sum() / 2;

  // Every nomination (like or dislike). Floored at 1 so an empty group yields
  // 0 for both coefficients instead of NaN.
  const totalChoices = Math.max(totalLikes + totalDislikes, 1);

  const cohesion = totalReciprocalLikes / totalChoices;
  const tension = totalDislikes / totalChoices;

  return np.array([[cohesion, tension]]);
};

/**
 * Compute Moreno's group-level sociometric coefficients and return them as a
 * plain object mirroring a pandas DataFrame.
 *
 * This mirrors `getMorenoIndividualLevelMetrics`, but the group is a single
 * observation: there is exactly one row (the group) and one column per metric
 * in `GROUP_METRIC_KEYS`.
 *
 * @param {number[][]} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {number[][]} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is `["group"]`, `columnIndex` is the metric name per column
 *   (in `GROUP_METRIC_KEYS` order), and `values` holds the single group row.
 */
export const getMorenoGroupLevelMetrics = (adjLikes, adjDislikes) => {
  const result = computeMorenoGroupLevelMetrics(adjLikes, adjDislikes);

  return {
    rowIndex: ["group"],
    columnIndex: [...GROUP_METRIC_KEYS],
    values: result.tolist(),
  };
};

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
- "ss": Sociometric status (0-7, see APPROACH 1 below)

SOCIOMETRIC STATUS CODES (Approach 1: Proportion + Confidence Band)
====================================================================

Approach 1 defines "neutral balance" not as balance=0, but as a confidence band around
50/50 opinion, scaled by sample size:
  - neutral_band = 0.5 ± 1σ * sqrt(p(1-p) / n)

Where:
  - p = proportion of positive opinions received (rp / (rp + rr))
  - n = total opinions received (rp + rr)
  - σ = 1 standard error (confidence margin)

This means:
  - Small sample (few opinions) → wide neutral band → harder to escape neutral status
  - Large sample (many opinions) → narrow neutral band → strong consensus needed

Example: "3L + 1D" vs "17L + 15D"
  - 3L + 1D: p=0.75, SE≈0.22, band=[0.53, 0.97] → outside band → POSITIVE
  - 17L + 15D: p=0.53, SE≈0.09, band=[0.44, 0.62] → inside band → NEUTRAL

Impact band (relative to the sample's impact distribution):
  - Low impact     = below the 20th percentile
  - High impact    = at or above the 80th percentile
  - Average impact = in between the two

STATUS CODES:
  0: Isolated       – no opinions received (rp + rr = 0)
  1: Marginal       – low impact (impact < 20th percentile)
  2: Appreciated    – average impact, positive balance (outside upper band)
  3: Popular        – high impact, positive balance
  4: Disliked       – average impact, negative balance (outside lower band)
  5: Rejected       – high impact, negative balance
  6: Ambitendent    – average impact, neutral balance (inside confidence band)
  7: Controversial  – high impact, neutral balance (polarizing)
*/

import * as np from "numpy-ts";

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
  "ss",
];

/**
 * The Moreno group-level metric keys, in the order they appear as columns of
 * the group-level result row.
 *
 * - "cohesion": group cohesion coefficient — total reciprocal likes over every
 *   nomination (likes + dislikes).
 * - "tension": group tension coefficient — total dislikes over every nomination
 *   (likes + dislikes).
 */
const GROUP_METRIC_KEYS = ["cohesion", "tension"];

/**
 * Compute Moreno's sociometric indices for every member.
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
const computeIndividualLevelMetrics = (adjA, adjB) => {
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
  const sociometricStatus = getSociometricStatus(rp, rr, impact)

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
    sociometricStatus
  ]);
};

/**
 * Classify members into sociometric status using impact percentiles and
 * proportion + confidence band for balance classification.
 *
 * Note: Neutral balance is defined relative to a confidence band around 50/50 opinion.
 * A person's balance is "neutral" if their proportion of positive opinions falls within
 * 0.5 ± 1σ (one standard error), accounting for sample size and variance.
 *
 * Large samples (more opinions received) require stronger consensus to escape the neutral band.
 * Small samples with few opinions are more likely to be classified as "neutral".
 *
 * @param {NDArray} rp - Received positive nominations (likes received)
 * @param {NDArray} rr - Received negative nominations (dislikes received)
 * @param {NDArray} impact - Impact index (rp + rr)
 * @returns {NDArray} Array of status codes (0-7)
 */
const getSociometricStatus = (rp, rr, impact) => {
  const LOW_IMPACT_PERCENTILE = 20;
  const HIGH_IMPACT_PERCENTILE = 80;
  const size = impact.size;

  // Total opinions received per member.
  const totalOpinions = rp.add(rr);

  // Impact percentiles (nearest-rank: floor of the sorted position).
  const impactSorted = impact.flatten().sort();
  const lowImpactThreshold = impactSorted.get([Math.floor((size * LOW_IMPACT_PERCENTILE) / 100)]);
  const highImpactThreshold = impactSorted.get([Math.floor((size * HIGH_IMPACT_PERCENTILE) / 100)]);

  // Impact bands. `isolated` short-circuits in the select below before any of
  // the impact classification is consulted.
  const isolated = totalOpinions.equal(0);
  const isLowImpact = impact.less(lowImpactThreshold);
  const isHighImpact = impact.greater_equal(highImpactThreshold);
  const isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();

  // Approach 1: proportion of positive opinions + 1σ confidence band.
  // The denominator is floored at 1 so isolated members (0 opinions) avoid a
  // 0/0 division; their status is already decided by `isolated`.
  const safeTotal = np.maximum(totalOpinions, 1);
  const proportion = rp.divide(safeTotal);
  const variance = proportion.multiply(proportion.multiply(-1).add(1)); // p(1 - p)
  const standardError = variance.divide(safeTotal).sqrt();
  const bandLower = standardError.multiply(-1).add(0.5);
  const bandUpper = standardError.add(0.5);

  // Balance classification against the confidence band.
  const isPositiveBalance = proportion.greater(bandUpper);
  const isNegativeBalance = proportion.less(bandLower);
  const isNeutralBalance = isPositiveBalance.logical_or(isNegativeBalance).logical_not();

  // Classify into sociometric status (0-7). First matching condition wins.
  return np.select(
    [
      isolated,                                       // 0: isolated
      isLowImpact,                                    // 1: marginal
      isHighImpact.logical_and(isPositiveBalance),    // 3: popular
      isHighImpact.logical_and(isNegativeBalance),    // 5: rejected
      isHighImpact.logical_and(isNeutralBalance),     // 7: controversial
      isAverageImpact.logical_and(isPositiveBalance), // 2: appreciated
      isAverageImpact.logical_and(isNegativeBalance), // 4: disliked
      isAverageImpact.logical_and(isNeutralBalance),  // 6: ambivalent
    ],
    [0, 1, 3, 5, 7, 2, 4, 6],
    0,
  );
};

/**
 * Compute Moreno's classic sociometric indices and return them as a plain
 * object mirroring a pandas DataFrame.
 *
 * This is the module's single entry point: it receives the already-built
 * adjacency matrices, computes the indices, and converts the resulting NDArray
 * to plain data only at this final boundary.
 *
 * @param {number[][]} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {number[][]} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @param {string[]} MemberIndices - Member ids aligned with the matrix row/column
 *   order.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is the member id per row, `columnIndex` is the metric name per
 *   column (in `METRIC_KEYS` order), and `values[i][j]` is the score of member
 *   `rowIndex[i]` for metric `columnIndex[j]`.
 */
export const getMorenoIndividualLevelMetrics = (adjLikes, adjDislikes, MemberIndices) => {
  const result = computeIndividualLevelMetrics(adjLikes, adjDislikes);

  return {
    rowIndex: MemberIndices,
    columnIndex: [...METRIC_KEYS],
    values: result.tolist(),
  };
};
