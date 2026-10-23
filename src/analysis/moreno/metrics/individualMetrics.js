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
 * Formula:
 *
 *   $$ rp_i = \sum_{j} a_{ji} $$
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
 * Formula:
 *
 *   $$ rr_i = \sum_{j} d_{ji} $$
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
 * Formula:
 *
 *   $$ gp_i = \sum_{j} a_{ij} $$
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
 * Formula:
 *
 *   $$ gr_i = \sum_{j} d_{ij} $$
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
 * Formula:
 *
 *   $$ mp_i = \sum_{j} a_{ij}\,a_{ji} $$
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
 * Formula:
 *
 *   $$ mr_i = \sum_{j} d_{ij}\,d_{ji} $$
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
 * Formula:
 *
 *   $$ im_i = rp_i + rr_i $$
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeImpact = (rp, rr) => rp.add(rr);

/**
 * Balance index: received positive minus received negative nominations.
 *
 * Formula:
 *
 *   $$ bl_i = rp_i - rr_i $$
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeBalance = (rp, rr) => rp.subtract(rr);

/**
 * Expressivity index: total opinions given (positive + negative).
 *
 * Formula:
 *
 *   $$ ei_i = gp_i + gr_i $$
 *
 * @param {import("numpy-ts").NDArray} gp - Given positive nominations.
 * @param {import("numpy-ts").NDArray} gr - Given negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeExpressivity = (gp, gr) => gp.add(gr);

/**
 * Orientation index: given positive minus given negative nominations.
 *
 * Formula:
 *
 *   $$ or_i = gp_i - gr_i $$
 *
 * @param {import("numpy-ts").NDArray} gp - Given positive nominations.
 * @param {import("numpy-ts").NDArray} gr - Given negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeOrientation = (gp, gr) => gp.subtract(gr);

/**
 * Affiliation index: balance plus orientation.
 *
 * Formula:
 *
 *   $$ ai_i = bl_i + or_i $$
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
 * Formula:
 *
 *   $$ ii_i = rp_i + mp_i $$
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} mp - Mutual positive connections.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeInfluence = (rp, mp) => rp.add(mp);

/**
 * Status codes (9 categories).
 */
export const SOCIOMETRIC_STATUS = Object.freeze({
  ISOLATED: 0, //      no opinions received, none given
  IGNORED: 1, //       no opinions received, but gave opinions
  MARGINAL: 2, //      low impact
  APPRECIATED: 3, //   average impact, positive balance
  POPULAR: 4, //       high impact, positive balance
  DISLIKED: 5, //      average impact, negative balance
  REJECTED: 6, //      high impact, negative balance
  AMBIVALENT: 7, //    average impact, neutral balance
  CONTROVERSIAL: 8, // high impact, neutral balance
});

/**
 * Classify members into sociometric status (0-8).
 *
 * VISIBILITY (takes precedence over everything else)
 * - Isolated: impact = 0 and expressivity = 0
 * - Ignored:  impact = 0 and expressivity > 0
 *
 * IMPACT CLASSIFICATION (nearest-rank percentiles)
 * Percentiles are computed only over members who received at least one
 * opinion (impact > 0). Isolated/ignored members would otherwise pile up at
 * zero and push the thresholds down, making "Marginal" unreachable in sparse
 * networks.
 * - Low impact:     impact ≤ 20th percentile
 * - High impact:    impact ≥ 80th percentile
 * - Average impact: everything in between
 *
 * Because comparisons are inclusive (≤ / ≥), ties at a threshold can classify
 * more than 20% of members as low or high.
 *
 * If the 20th and 80th percentiles collapse to the same value (that value is
 * then the median), and the distribution shows meaningful inequality
 * (Gini ≥ 0.3, or Gini ≥ 0.2 with peak-to-peak spread ≥ 3), the fallback is:
 *   1. Outer percentiles (5th / 95th, inclusive), only for ≥ 20 visible
 *      members, each side used only if strictly beyond the median.
 *   2. Otherwise median-strict: impact < median is low, > median is high.
 * If the Gini condition is not met, everyone is treated as average impact.
 *
 * BALANCE CLASSIFICATION (dynamic ratio threshold)
 * - Positive: rp > threshold × rr
 * - Negative: rr > threshold × rp
 * - Neutral:  neither
 *
 * The threshold depends on impact (total opinions received, n):
 * - n ≤ 3:  2.0 (strict, little evidence)
 * - n ≥ 15: 1.5 (lenient, more evidence)
 * - linear interpolation in between
 *
 * Note: low impact deliberately overrides balance. A member in the bottom
 * impact tier is "Marginal" even if their few opinions are mostly negative.
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @param {import("numpy-ts").NDArray} expressivity - Opinions given (gp + gr).
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @returns {import("numpy-ts").NDArray} Status codes, same shape as the inputs.
 */
export const computeSociometricStatus = (rp, rr, expressivity, impact) => {
  const impactSize = impact.size;

  // VISIBILITY CLASSIFICATION
  // ============================================================================
  const hasNoOpinionsReceived = impact.equal(0);
  const hasNoOpinionsGiven = expressivity.equal(0);

  const isolated = hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven);
  const ignored = hasNoOpinionsReceived.logical_and(
    hasNoOpinionsGiven.logical_not(),
  );

  // IMPACT CLASSIFICATION
  // ============================================================================
  const LOW_IMPACT_PERCENTILE = 20;
  const HIGH_IMPACT_PERCENTILE = 80;
  const OUTER_LOW_PERCENTILE = 5;
  const OUTER_HIGH_PERCENTILE = 95;
  // With nearest-rank, 5/95 differ from min/max only from 20 members up.
  const MIN_VISIBLE_FOR_OUTER_PERCENTILES = 20;
  const GINI_STRONG = 0.3;
  const GINI_MODERATE = 0.2;
  const PTP_MIN_FOR_MODERATE_GINI = 3;

  // Default: everyone is average impact. Built as boolean arrays (impact is
  // non-negative), so np.select and logical_* always receive booleans.
  let isLowImpact = impact.less(0);
  let isHighImpact = impact.less(0);

  // Only members who received opinions take part in the percentile calculation.
  const visibleImpacts = impact
    .flatten()
    .toArray()
    .filter((value) => value > 0)
    .sort((a, b) => a - b); // numeric sort (default JS sort is lexicographic)

  if (visibleImpacts.length > 0) {
    // Nearest-rank percentile, clamped so the index is always valid.
    const percentileValue = (percentile) =>
      visibleImpacts[
        Math.min(
          visibleImpacts.length - 1,
          Math.floor((visibleImpacts.length * percentile) / 100),
        )
      ];

    const lowImpactThreshold = percentileValue(LOW_IMPACT_PERCENTILE);
    const highImpactThreshold = percentileValue(HIGH_IMPACT_PERCENTILE);

    if (lowImpactThreshold !== highImpactThreshold) {
      isLowImpact = impact.less_equal(lowImpactThreshold);
      isHighImpact = impact.greater_equal(highImpactThreshold);
    } else {
      // Percentiles collapsed: the shared value is the median (at least 60%
      // of visible members sit on it). Only split the group if the
      // distribution is unequal enough (measured over visible members only).
      const medianValue = lowImpactThreshold;
      const ptp =
        visibleImpacts[visibleImpacts.length - 1] - visibleImpacts[0];
      const gini = computeGiniCoefficient(np.array(visibleImpacts));

      if (
        gini >= GINI_STRONG ||
        (gini >= GINI_MODERATE && ptp >= PTP_MIN_FOR_MODERATE_GINI)
      ) {
        // Outer percentiles (5/95) are a distinct strategy only for larger
        // groups; below that they equal min/max and ties could flag most of
        // the group. Each side is used only if it lies strictly beyond the
        // median, so the bulk of tied members is never swept into a tail.
        const outerLow = percentileValue(OUTER_LOW_PERCENTILE);
        const outerHigh = percentileValue(OUTER_HIGH_PERCENTILE);
        const useOuterLow =
          visibleImpacts.length >= MIN_VISIBLE_FOR_OUTER_PERCENTILES &&
          outerLow < medianValue;
        const useOuterHigh =
          visibleImpacts.length >= MIN_VISIBLE_FOR_OUTER_PERCENTILES &&
          outerHigh > medianValue;

        if (useOuterLow || useOuterHigh) {
          if (useOuterLow) isLowImpact = impact.less_equal(outerLow);
          if (useOuterHigh) isHighImpact = impact.greater_equal(outerHigh);
        } else {
          // Median-strict: strictly below / above the typical value.
          isLowImpact = impact.less(medianValue);
          isHighImpact = impact.greater(medianValue);
        }
      }
    }
  }

  // A member can't be both low and high (the min/max fallback only applies
  // when ptp > 0 in practice, since Gini is 0 for a constant distribution),
  // but guard anyway so low wins deterministically.
  isHighImpact = isHighImpact.logical_and(isLowImpact.logical_not());
  const isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();

  // BALANCE CLASSIFICATION: dynamic ratio threshold
  // ============================================================================
  // Fewer opinions received -> less certain -> require a stronger ratio.
  const LESS_LENIENT_RATIO = 2.0; // threshold at or below MIN_OPINIONS
  const MORE_LENIENT_RATIO = 1.5; // threshold at or above MAX_OPINIONS
  const MIN_OPINIONS_FOR_THRESHOLD = 3;
  const MAX_OPINIONS_FOR_THRESHOLD = 15;

  // threshold(n) = LESS + (MORE - LESS) * clamp((n - minN) / (maxN - minN), 0, 1)
  const ratioSpan = MORE_LENIENT_RATIO - LESS_LENIENT_RATIO;
  const opinionSpan = MAX_OPINIONS_FOR_THRESHOLD - MIN_OPINIONS_FOR_THRESHOLD;

  const clampedOffset = np.minimum(
    np.maximum(impact.subtract(MIN_OPINIONS_FOR_THRESHOLD), 0),
    opinionSpan,
  );
  const dynamicThreshold = clampedOffset
    .divide(opinionSpan)
    .multiply(ratioSpan)
    .add(LESS_LENIENT_RATIO);

  const isPositiveBalance = rp.greater(rr.multiply(dynamicThreshold));
  const isNegativeBalance = rr.greater(rp.multiply(dynamicThreshold));
  const isNeutralBalance = isPositiveBalance
    .logical_or(isNegativeBalance)
    .logical_not();

  // STATUS ASSIGNMENT: decision tree (first match wins)
  // ============================================================================
  const S = SOCIOMETRIC_STATUS;

  return np.select(
    [
      isolated,
      ignored,
      isLowImpact,
      isHighImpact.logical_and(isPositiveBalance),
      isHighImpact.logical_and(isNegativeBalance),
      isHighImpact.logical_and(isNeutralBalance),
      isAverageImpact.logical_and(isPositiveBalance),
      isAverageImpact.logical_and(isNegativeBalance),
      isAverageImpact.logical_and(isNeutralBalance),
    ],
    [
      S.ISOLATED,
      S.IGNORED,
      S.MARGINAL,
      S.POPULAR,
      S.REJECTED,
      S.CONTROVERSIAL,
      S.APPRECIATED,
      S.DISLIKED,
      S.AMBIVALENT,
    ],
    -1, // Safety default (unreachable for valid inputs)
  );
};;
