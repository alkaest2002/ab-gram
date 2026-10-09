import * as np from "numpy-ts";
import { computeGiniCoefficient } from "../../common/commonMetrics.js";

//////////////////////////////////////////////////////////////////////////////////
// MORENO INDIVIDUAL-LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Received positive nominations: how many likes each member received.
 *
 * This is the column sum (in-degree) of the likes adjacency matrix.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeReceivedPositive = (adjLikes) => adjLikes.sum(0);

/**
 * Received negative nominations: how many dislikes each member received.
 *
 * This is the column sum (in-degree) of the dislikes adjacency matrix.
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeReceivedNegative = (adjDislikes) => adjDislikes.sum(0);

/**
 * Given positive nominations: how many likes each member gave.
 *
 * This is the row sum (out-degree) of the likes adjacency matrix.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeGivenPositive = (adjLikes) => adjLikes.sum(1);

/**
 * Given negative nominations: how many dislikes each member gave.
 *
 * This is the row sum (out-degree) of the dislikes adjacency matrix.
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeGivenNegative = (adjDislikes) => adjDislikes.sum(1);

/**
 * Mutual positive connections: how many mutual like pairs each member has.
 *
 * `adjLikes * adjLikes.T` is non-zero exactly where both directions of a like
 * exist; the row sum counts each member's mutual like partners.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeMutualPositive = (adjLikes) =>
  adjLikes.multiply(adjLikes.T).sum(1);

/**
 * Mutual negative connections: how many mutual dislike pairs each member has.
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeMutualNegative = (adjDislikes) =>
  adjDislikes.multiply(adjDislikes.T).sum(1);

/**
 * Impact index: total opinions received (positive + negative).
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeImpact = (rp, rr) => rp.add(rr);

/**
 * Balance index: received positive minus received negative nominations.
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeBalance = (rp, rr) => rp.subtract(rr);

/**
 * Expressivity index: total opinions given (positive + negative).
 *
 * @param {import("numpy-ts").NDArray} gp - Given positive nominations.
 * @param {import("numpy-ts").NDArray} gr - Given negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeExpressivity = (gp, gr) => gp.add(gr);

/**
 * Orientation index: given positive minus given negative nominations.
 *
 * @param {import("numpy-ts").NDArray} gp - Given positive nominations.
 * @param {import("numpy-ts").NDArray} gr - Given negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeOrientation = (gp, gr) => gp.subtract(gr);

/**
 * Affiliation index: balance plus orientation.
 *
 * @param {import("numpy-ts").NDArray} balance - Balance index.
 * @param {import("numpy-ts").NDArray} orientation - Orientation index.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeAffiliation = (balance, orientation) =>
  balance.add(orientation);

/**
 * Influence index: received positive plus mutual positive nominations.
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} mp - Mutual positive connections.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeInfluence = (rp, mp) => rp.add(mp);

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
 * inequality: a Gini coefficient ≥ 0.3, or a Gini ≥ 0.2 combined with a
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
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations
 *   (in-degree from likes).
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations
 *   (in-degree from dislikes).
 * @param {import("numpy-ts").NDArray} expressivity - Expressivity index
 *   (gp + gr, opinions given).
 * @param {import("numpy-ts").NDArray} impact - Impact index (rp + rr, total
 *   opinions received).
 * @returns {import("numpy-ts").NDArray} Status codes, shape matches input arrays.
 */
export const computeSociometricStatus = (rp, rr, expressivity, impact) => {
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
    if (gini >= 0.3 || (gini >= 0.2 && ptp >= 3)) {
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
