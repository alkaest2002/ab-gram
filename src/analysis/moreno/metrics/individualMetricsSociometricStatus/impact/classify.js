// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { IMPACT_STRATEGIES } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/registry.js";

// ============================================================================
// IMPACT CLASSIFICATION
// Each threshold strategy classifies every member low/average/high; the final
// impact class is the majority vote of the strategies that propose a split.
// ============================================================================

/**
 * Map values to -1 (low), 0 (average) or +1 (high) for a { low, high } pair.
 * Low wins when both thresholds would apply.
 *
 * @param {number[]} values - Sorted visible impacts.
 * @param {{ low: number, high: number }} thresholds - Inclusive cutoffs.
 * @returns {number[]} Labels in the same order as `values`.
 */
const labelValues = (values, { low, high }) =>
  values.map((v) => (v <= low ? -1 : v >= high ? 1 : 0)); // low wins ties

/**
 * Classify every member as low / high / average for one threshold pair.
 * Infinite bounds mean "that side is never flagged".
 *
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @param {{ low: number, high: number }} thresholds - Inclusive cutoffs.
 * @returns {{
 *   isLowImpact: import("numpy-ts").NDArray,
 *   isHighImpact: import("numpy-ts").NDArray,
 *   isAverageImpact: import("numpy-ts").NDArray,
 * }}
 */
const classifyImpact = (impact, thresholds) => {
  const none = impact.less(0); // all-false boolean array (impact is non-negative)
  const isLowImpact = isFinite(thresholds.low)
    ? impact.less_equal(thresholds.low)
    : none;
  let isHighImpact = isFinite(thresholds.high)
    ? impact.greater_equal(thresholds.high)
    : none;

  // Low wins deterministically if both ever apply.
  isHighImpact = isHighImpact.logical_and(isLowImpact.logical_not());
  const isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();
  return { isLowImpact, isHighImpact, isAverageImpact };
};

/**
 * Sum a list of boolean masks into a single integer vote-count array.
 *
 * @param {import("numpy-ts").NDArray[]} booleanArrays - Boolean masks.
 * @returns {import("numpy-ts").NDArray} Integer vote counts.
 */
const countVotes = (booleanArrays) => {
  let total = booleanArrays[0].astype("int32");
  for (let i = 1; i < booleanArrays.length; i += 1) {
    total = total.add(booleanArrays[i].astype("int32"));
  }
  return total;
};

/**
 * Classify impact by majority vote across the strategies that propose a split.
 * A strategy that abstains does not vote; if all abstain, everyone is average.
 * Tie-breaks: a non-average class beats average, and low beats high.
 *
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @param {{ sorted: number[], allImpacts: number[], groupSize: number }} context - Visible impacts, all impacts and group size.
 * @returns {{
 *   isLowImpact: import("numpy-ts").NDArray,
 *   isHighImpact: import("numpy-ts").NDArray,
 *   isAverageImpact: import("numpy-ts").NDArray,
 * }}
 */
export const classifyImpactByVote = (impact, context) => {
  if (context.sorted.length === 0) return classifyImpact(impact, NO_SPLIT);

  const active = IMPACT_STRATEGIES.map(({ run }) => run(context)).filter(
    (thresholds) =>
      labelValues(context.sorted, thresholds).some((label) => label !== 0),
  );

  if (active.length === 0) return classifyImpact(impact, NO_SPLIT);

  const perStrategy = active.map((thresholds) =>
    classifyImpact(impact, thresholds),
  );

  const lowVotes = countVotes(perStrategy.map(({ isLowImpact }) => isLowImpact));
  const highVotes = countVotes(perStrategy.map(({ isHighImpact }) => isHighImpact));
  const averageVotes = countVotes(
    perStrategy.map(({ isAverageImpact }) => isAverageImpact),
  );

  // Average wins only with a strict majority; otherwise a non-average class
  // beats average on ties, and low beats high on a low/high tie.
  const isAverageImpact = averageVotes
    .greater(lowVotes)
    .logical_and(averageVotes.greater(highVotes));
  const isLowImpact = isAverageImpact
    .logical_not()
    .logical_and(lowVotes.greater_equal(highVotes));
  const isHighImpact = isAverageImpact
    .logical_not()
    .logical_and(highVotes.greater(lowVotes));

  return { isLowImpact, isHighImpact, isAverageImpact };
};
