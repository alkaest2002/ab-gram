import * as np from "numpy-ts";
import { computeGiniCoefficient } from "./common.js";

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
  const size = adjLikes.shape[0];

  // Total directed nominations of each preference kind.
  const totalLikes = adjLikes.sum();
  const totalDislikes = adjDislikes.sum();

  // Number of mutual (reciprocal) like pairs. `adjLikes * adjLikes.T` is
  // non-zero exactly where both directions of a like exist; its sum counts each
  // mutual pair twice (once per direction), so halve it to count distinct pairs.
  const totalReciprocalLikes = adjLikes.multiply(adjLikes.T).sum() / 2;

  // Number of mutual (reciprocal) dislike pairs, counted the same way.
  const totalReciprocalDislikes = adjDislikes.multiply(adjDislikes.T).sum() / 2;

  // Every unordered pair of members, floored at 1 so groups smaller than two
  // members avoid a division by zero.
  const totalPossiblePairs = Math.max((size * (size - 1)) / 2, 1);

  const cohesion = totalReciprocalLikes / totalPossiblePairs;
  const conflict = totalReciprocalDislikes / totalPossiblePairs;
  const positiveReciprocity = totalReciprocalLikes / totalLikes;
  const negativeReciprocity = totalReciprocalDislikes / totalDislikes;

  return np.array([
    [cohesion, conflict, positiveReciprocity, negativeReciprocity],
  ]);
};

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
  const rp = adjLikes.sum(0);
  const rr = adjDislikes.sum(0);

  // Given nominations: row sums (how many members I chose).
  const gp = adjLikes.sum(1);
  const gr = adjDislikes.sum(1);

  // Mutual connections: A[i][j] && A[j][i] === elementwise A * A^T.
  const mp = adjLikes.multiply(adjLikes.T).sum(1);
  const mr = adjDislikes.multiply(adjDislikes.T).sum(1);

  // Derived indices.
  const impact = rp.add(rr);
  const balance = rp.subtract(rr);
  const expressivity = gp.add(gr);
  const orientation = gp.subtract(gr);
  const affiliation = balance.add(orientation);
  const influence = rp.add(mp);
  const sociometricStatus = getSociometricStatus(rp, rr, expressivity, impact);

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

/**
 * Classify members into sociometric status (0-8) using:
 *
 * IMPACT CLASSIFICATION (Percentile-based)
 * - Low impact:     impact ≤ 20th percentile
 * - High impact:    impact ≥ 80th percentile
 * - Average impact: between the 20th and 80th percentiles
 *
 * When the 20th and 80th percentiles collapse to the same value, classification
 * falls back to min/max when the impact distribution shows meaningful
 * inequality: a Gini coefficient ≥ 0.3, or a Gini ≥ 0.15 combined with a
 * peak-to-peak spread (max − min) ≥ 3. Otherwise everyone is treated as
 * average impact.
 *
 * BALANCE CLASSIFICATION (Dynamic ratio threshold)
 * - Positive:  rp > threshold × rr  (threshold depends on sample size)
 * - Negative:  rr > threshold × rp
 * - Neutral:   neither condition met
 *
 * Dynamic threshold scales with sample size:
 * - Few opinions (n≤3):  threshold = 2.0:1 ratio (strict, uncertain)
 * - Many opinions (n≥15): threshold = 1.5:1 ratio (lenient, confident)
 * - Linear interpolation between 3 and 15 opinions
 *
 * STATUS CODES (9 categories):
 *   0: Isolated     – no opinions received, none given
 *   1: Ignored      – no opinions received, but gave opinions
 *   2: Marginal     – low impact (below the 20th percentile)
 *   3: Appreciated  – average impact, positive balance
 *   4: Popular      – high impact, positive balance
 *   5: Disliked     – average impact, negative balance
 *   6: Rejected     – high impact, negative balance
 *   7: Ambivalent   – average impact, neutral balance
 *   8: Controversial– high impact, neutral balance
 *
 * @param {NDArray} rp - Received positive nominations (in-degree from likes)
 * @param {NDArray} rr - Received negative nominations (in-degree from dislikes)
 * @param {NDArray} expressivity - Expressivity index (gp + gr, opinions given)
 * @param {NDArray} impact - Impact index (rp + rr, total opinions received)
 * @returns {NDArray} Status codes, shape matches input arrays
 */
const getSociometricStatus = (rp, rr, expressivity, impact) => {
  // Get impact size
  const impactSize = impact.size;

  // VISIBILITY CLASSIFICATION: Isolation and Ignorance
  // ============================================================================
  // Members with no opinions received are isolated or ignored (can't be ranked).
  // These take precedence over impact/balance classification.
  const hasNoOpinionsReceived = impact.equal(0);
  const hasNoOpinionsGiven = expressivity.equal(0);

  const isolated = hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven);
  const ignored = hasNoOpinionsReceived.logical_and(
    hasNoOpinionsGiven.logical_not(),
  );

  // IMPACT CLASSIFICATION
  // ============================================================================
  // Set percentile thresholds.
  const LOW_IMPACT_PERCENTILE = 20;
  const HIGH_IMPACT_PERCENTILE = 80;

  // Define initial isLowImpact, isAverageImpact, isHighImpact
  // So that every member is considered having average impact.
  let isLowImpact = np.full([impactSize], 0);
  let isHighImpact = np.full([impactSize], 0);
  let isAverageImpact = np.full([impactSize], 1);

  // Calculate 20th and 80th percentiles
  // -------------------------------------------------
  // Sort impact values and define percentile index function.
  const impactSorted = impact.flatten().sort();
  const percentileIndex = (percentile) =>
    Math.floor((impactSize * percentile) / 100);

  // Calculate low impact threshold.
  const lowImpactThreshold = impactSorted.get([
    percentileIndex(LOW_IMPACT_PERCENTILE),
  ]);

  // Calculate high impact threshold.
  const highImpactThreshold = impactSorted.get([
    percentileIndex(HIGH_IMPACT_PERCENTILE),
  ]);

  // If low and high impact thresholds are equal...
  // do not use percentile-based thresholds; use min/max instead
  // under certain conditions, otherwise everyone is considered
  // as having average impact.
  if (lowImpactThreshold === highImpactThreshold) {
    // Compute once and reuse.
    const gini = computeGiniCoefficient(impact);
    const ptp = np.ptp(impact);

    // If Gini coefficient is high or PTP is large, use min/max thresholds.
    if (gini >= 0.3 || (gini >= 0.15 && ptp >= 3)) {
      const minVal = np.min(impact);
      const maxVal = np.max(impact);
      isLowImpact = impact.less_equal(minVal);
      isHighImpact = impact.greater_equal(maxVal);
      isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();
    }
  } else {
    isLowImpact = impact.less_equal(lowImpactThreshold);
    isHighImpact = impact.greater_equal(highImpactThreshold);
    isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();
  }

  // BALANCE CLASSIFICATION: Dynamic ratio threshold
  // ============================================================================
  // Intuition: fewer opinions received → we're less certain → require stronger ratio
  // more opinions received → we're more certain → accept weaker ratio
  //
  // Parameters (tune these based on social context)
  const LESS_LENIENT_RATIO = 2.0; // Ratio threshold when few opinions
  const MORE_LENIENT_RATIO = 1.5; // Ratio threshold when many opinions
  const MIN_OPINIONS_FOR_THRESHOLD = 3; // Opinion count where MIN_RATIO applies
  const MAX_OPINIONS_FOR_THRESHOLD = 15; // Opinion count where MAX_RATIO applies

  // Compute dynamic threshold per member (vectorized)
  // Formula: threshold(n) = LESS_LENIENT_RATIO + (MORE_LENIENT_RATIO - LESS_LENIENT_RATIO) × (n - minN) / (maxN - minN)
  const ratioSpan = MORE_LENIENT_RATIO - LESS_LENIENT_RATIO;
  const opinionSpan = MAX_OPINIONS_FOR_THRESHOLD - MIN_OPINIONS_FOR_THRESHOLD;

  // Offset: how far above minimum opinion count
  const opinionOffset = impact.subtract(MIN_OPINIONS_FOR_THRESHOLD);

  // Clamp offset to valid range [0, opinionSpan]
  const clampedLower = np.maximum(opinionOffset, 0); // Floor at 0 (below minN)
  const clampedOffset = np.minimum(clampedLower, opinionSpan); // Cap at opinionSpan (above maxN)

  // Normalize to [0, 1] and interpolate the ratio adjustment
  const normalizedOffset = clampedOffset.divide(opinionSpan);
  const thresholdAdjustment = normalizedOffset.multiply(ratioSpan);

  // Final per-member threshold (ranges 2.0 to 1.5 as opinions increase)
  const dynamicThreshold = np
    .full([impactSize], LESS_LENIENT_RATIO)
    .add(thresholdAdjustment);

  // Balance classification using the dynamic threshold
  // Positive:  "I have lots of likes relative to dislikes"
  // Negative:  "I have lots of dislikes relative to likes"
  // Neutral:   "I'm roughly balanced or unclear"
  const isPositiveBalance = rp.greater(rr.multiply(dynamicThreshold));
  const isNegativeBalance = rr.greater(rp.multiply(dynamicThreshold));
  const isNeutralBalance = isPositiveBalance
    .logical_or(isNegativeBalance)
    .logical_not();

  // STATUS ASSIGNMENT: Decision tree
  // ============================================================================
  // Priority order (first match wins):
  // 1. Isolation (no visibility → can't be ranked)
  // 2. Ignorance (no visibility but gave opinions)
  // 3. Low impact (overrides balance—marginal members)
  // 4. High impact + balance combination
  // 5. Average impact + balance combination
  //
  // This uses np.select which is like a vectorized if-else chain:
  // returns values[i] where conditions[i] is first true, else default

  return np.select(
    [
      // Tier 1: Visibility (short-circuit before impact/balance)
      isolated, // 0: isolated
      ignored, // 1: ignored

      // Tier 2: Low impact (short-circuit before balance nuance)
      isLowImpact, // 2: marginal

      // Tier 3: High impact × balance combinations
      isHighImpact.logical_and(isPositiveBalance), // 4: popular
      isHighImpact.logical_and(isNegativeBalance), // 6: rejected
      isHighImpact.logical_and(isNeutralBalance), // 8: controversial

      // Tier 4: Average impact × balance combinations
      isAverageImpact.logical_and(isPositiveBalance), // 3: appreciated
      isAverageImpact.logical_and(isNegativeBalance), // 5: disliked
      isAverageImpact.logical_and(isNeutralBalance), // 7: ambivalent
    ],
    [0, 1, 2, 4, 6, 8, 3, 5, 7], // Status codes (order matches conditions)
    -1, // Safety default (unreachable for valid inputs)
  );
};

///////////// EXPORTS

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
