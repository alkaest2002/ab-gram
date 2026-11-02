// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { SOCIOMETRIC_STATUS } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { toSortedVisible } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/helpers.js";
import { classifyImpactByVote } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/classify.js";
import { classifyBalance } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/balance/classify.js";

export { SOCIOMETRIC_STATUS } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";

// ============================================================================
// STEP 1: VISIBILITY
// ============================================================================
const classifyVisibility = (impact, expressivity) => {
  const hasNoOpinionsReceived = impact.equal(0);
  const hasNoOpinionsGiven = expressivity.equal(0);
  return {
    isolated: hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven),
    ignored: hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven.logical_not()),
  };
};

// ============================================================================
// STEP 5: STATUS ASSIGNMENT (decision tree, first match wins)
// ============================================================================
const assignStatus = (visibility, impactClass, balance) => {
  const S = SOCIOMETRIC_STATUS;
  const { isolated, ignored } = visibility;
  const { isLowImpact, isHighImpact, isAverageImpact } = impactClass;
  const { isPositiveBalance, isNegativeBalance, isNeutralBalance } = balance;

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
    S.UNCLASSIFIED, // safety default (unreachable for valid inputs)
  );
};

// ============================================================================
// ORCHESTRATOR
// ============================================================================

/**
 * Classify members into sociometric status (codes 0-8; 99 is a safety
 * default that is unreachable for valid input).
 *
 * VISIBILITY (takes precedence over everything else)
 * - Isolated: impact = 0 and expressivity = 0
 * - Ignored:  impact = 0 and expressivity > 0
 *
 * IMPACT CLASSIFICATION (majority vote of the splitting strategies)
 * Low/high cutoffs are derived from members who received at least one opinion
 * (impact > 0), so isolated/ignored members don't drag the thresholds down.
 * Percentiles are nearest-rank, mirrored for the upper side so the bottom
 * p% and top p% always hold the same number of members; the median is the
 * true median (mean of the two middle values for even n).
 * Tails never include the tied median bulk: a cutoff that reaches the median
 * is pulled in to the nearest value strictly beyond it.
 * Four strategies each propose { low, high } cutoffs:
 * - Jenks: natural breaks into up to three classes, gated by goodness of
 *   variance fit (GVF >= 0.75) so structureless data abstains.
 * - Percentile: nearest-rank 20th/80th percentiles, tie-trimmed; abstains
 *   with fewer than 5 visible members.
 * - Tukey: strict inner fences (Q1 - 1.5*IQR, Q3 + 1.5*IQR) over visible
 *   members; a value exactly on a fence is not an outlier.
 * - Binomial (GB): exact two-sided Binomial(N-1, p) limits at alpha = 0.05,
 *   where p is the network's opinion density (computed over all members).
 * Each strategy classifies every member low/average/high; a strategy that
 * proposes no effective split (NO_SPLIT or thresholds that flag no visible
 * member) abstains from the vote. If every strategy abstains, everyone is
 * average. The final class per member is the plurality of the
 * non-abstaining strategies: average wins only if it has strictly more votes
 * than both low and high; otherwise low wins unless high has strictly more
 * votes than low.
 * Comparisons are inclusive (impact <= low, impact >= high) and low wins if
 * both ever apply. Cutoffs are observed values, so members tied with a cutoff
 * share its class (the tail can be larger than the nominal percentile).
 *
 * BALANCE CLASSIFICATION (dynamic ratio threshold)
 * - Positive: rp > threshold x rr
 * - Negative: rr > threshold x rp
 * - Neutral:  neither
 * The threshold depends on impact (total opinions received, n):
 * - n <= 3:  2.0 (strict, little evidence)
 * - n >= 15: 1.5 (lenient, more evidence)
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
  const visibility = classifyVisibility(impact, expressivity);

  const allImpacts = impact.flatten().toArray();
  const sorted = toSortedVisible(impact);
  const impactClass = classifyImpactByVote(impact, {
    sorted,
    allImpacts,
    groupSize: allImpacts.length,
  });

  const balance = classifyBalance(rp, rr, impact);
  return assignStatus(visibility, impactClass, balance);
};
