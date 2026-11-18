// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { IMPACT_STRATEGIES } from "@/analysis/moreno/metrics/sociometricStatus/impact/registry.js";

// ============================================================================
// IMPACT CLASSIFICATION
// Each threshold strategy votes for the members it flags on a finite side;
// the final impact class is the majority vote across the active strategies.
// ============================================================================

/**
 * Whether a { low, high } pair proposes at least one numeric cutoff.
 * Infinite bounds mean "that side is never flagged"; a pair with two infinite
 * bounds (NO_SPLIT) proposes no split and abstains from the vote.
 *
 * @param {{ low: number, high: number }} thresholds - Inclusive cutoffs.
 * @returns {boolean} True when at least one bound is finite.
 */
const hasNumericThreshold = ({ low, high }) => isFinite(low) || isFinite(high);

/**
 * Classify members for one threshold pair. Each finite bound flags its side
 * (low when impact <= low, high when impact >= high); an infinite bound flags
 * nothing on that side. "Average" is proposed only when both bounds are finite
 * (a real middle band); otherwise the strategy abstains on the members it does
 * not flag.
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
  const none = np.zeros(impact.shape).astype("bool"); // all-false boolean array (impact is non-negative)
  const hasLow = isFinite(thresholds.low);
  const hasHigh = isFinite(thresholds.high);

  const isLowImpact = hasLow ? impact.less_equal(thresholds.low) : none;
  let isHighImpact = hasHigh ? impact.greater_equal(thresholds.high) : none;

  // Low wins deterministically if both ever apply.
  isHighImpact = isHighImpact.logical_and(isLowImpact.logical_not());

  // A single-sided strategy (only one finite bound) abstains on the rest
  // instead of voting them average, so it only votes for its flagged tail.
  const isAverageImpact =
    hasLow && hasHigh ? isLowImpact.logical_or(isHighImpact).logical_not() : none;

  return { isLowImpact, isHighImpact, isAverageImpact };
};

/**
 * Classify every member as average (no low or high impact).
 *
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @returns {{
 *   isLowImpact: import("numpy-ts").NDArray,
 *   isHighImpact: import("numpy-ts").NDArray,
 *   isAverageImpact: import("numpy-ts").NDArray,
 * }}
 */
const classifyAllAverage = (impact) => {
  const none = np.zeros(impact.shape).astype("bool");
  const all = np.ones(impact.shape).astype("bool");
  return { isLowImpact: none, isHighImpact: none, isAverageImpact: all };
};

/**
 * Sum a list of boolean masks into a single integer vote-count array.
 *
 * @param {import("numpy-ts").NDArray[]} booleanArrays - Boolean masks.
 * @returns {import("numpy-ts").NDArray} Integer vote counts.
 */
const countVotes = (booleanArrays) =>
  np
    .stack(
      booleanArrays.map((a) => a.astype("int32")),
      0,
    )
    .sum(0);

/**
 * Classify impact by majority vote across the strategies that propose a split.
 * Each strategy votes only for the members it flags on a finite side and
 * abstains on the rest; if no strategy votes for a member, it is average.
 * Tie-breaks: a non-average class beats average, and low beats high.
 *
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @param {import("numpy-ts").NDArray} impactVisibleSorted - Sorted visible impacts.
 * @returns {{
 *   isLowImpact: import("numpy-ts").NDArray,
 *   isHighImpact: import("numpy-ts").NDArray,
 *   isAverageImpact: import("numpy-ts").NDArray,
 *   impactThresholds: Array<{ strategy: string, thresholds: { low: number, high: number } }>,
 * }}
 */
export const classifyImpactByVote = (impact, impactVisibleSorted) => {
  const context = { impact, impactVisibleSorted };

  // Compute every strategy's proposed cutoffs (keyed by name) so they can be
  // reported in full, including the strategies that abstain from the vote.
  const impactThresholds = IMPACT_STRATEGIES.map(({ name, run }) => ({
    strategy: name,
    thresholds: run(context),
  }));

  // With few visible impacts there is no meaningful spread, so
  // skip the vote and classify everyone as average.
  if (impactVisibleSorted.size < 4) {
    return { ...classifyAllAverage(impact), impactThresholds };
  }

  // Strategies that propose at least one numeric cutoff vote; the rest abstain.
  const active = impactThresholds.filter(({ thresholds }) => hasNumericThreshold(thresholds));

  // If no strategy proposes a numeric cutoff, classify everyone as average.
  if (active.length === 0) {
    return { ...classifyAllAverage(impact), impactThresholds };
  }

  // Do the classification for each active strategy.
  const perStrategy = active.map(({ thresholds }) => classifyImpact(impact, thresholds));

  // Count the number of votes for each impact class.
  const lowVotes = countVotes(perStrategy.map(({ isLowImpact }) => isLowImpact));
  const highVotes = countVotes(perStrategy.map(({ isHighImpact }) => isHighImpact));
  const averageVotes = countVotes(perStrategy.map(({ isAverageImpact }) => isAverageImpact));

  // Members nobody voted on (every active strategy abstained) are average.
  const noVotes = lowVotes.add(averageVotes).add(highVotes).equal(0);

  // Average wins with a strict majority (or when nobody voted); otherwise a
  // non-average class beats average on ties, and low beats high on a low/high tie.
  const isAverageImpact = averageVotes
    .greater(lowVotes)
    .logical_and(averageVotes.greater(highVotes))
    .logical_or(noVotes);
  const isLowImpact = isAverageImpact.logical_not().logical_and(lowVotes.greater_equal(highVotes));
  const isHighImpact = isAverageImpact.logical_not().logical_and(highVotes.greater(lowVotes));

  return { isLowImpact, isHighImpact, isAverageImpact, impactThresholds };
};
