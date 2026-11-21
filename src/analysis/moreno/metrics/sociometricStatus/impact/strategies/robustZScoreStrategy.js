// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 15;
const MAX_MEMBERS = 35;
const Z_CUTOFF = 3.5; // robust z-score beyond which a value is an outlier
const MAD_FLOOR = 0.5; // floor on the median absolute deviation
const MAD_SCALE = 1.4826; // MAD -> normal-distribution standard-deviation scale

/**
 * Robust z-score strategy for 7–35 visible members: flags values whose scaled
 * distance from the median (median absolute deviation) exceeds Z_CUTOFF. More
 * resistant to outliers than Tukey's IQR fences.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const robustZScoreStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain when the strategy requirements are not met.
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS || impactVisibleSorted.size > MAX_MEMBERS) {
    return NO_SPLIT;
  }

  // ========================================================================
  // FIND CLASSIFICATION BOUNDARIES — use robust z-score fences.
  // ========================================================================
  // Compute the median and median absolute deviation (MAD) of the visible impacts.
  const median = impactVisibleSorted.median();
  const deviations = impactVisibleSorted.subtract(median).absolute();
  const mad = Math.max(deviations.median(), MAD_FLOOR);

  // Compute the low and high fences for outlier detection.
  const lowFence = median - Z_CUTOFF * MAD_SCALE * mad;
  const highFence = median + Z_CUTOFF * MAD_SCALE * mad;

  // Count the number of low and high outliers.
  const lowCount = impactVisibleSorted.compress(impactVisibleSorted.less(lowFence)).size;
  const highCount = impactVisibleSorted.compress(impactVisibleSorted.greater(highFence)).size;

  // Find the indices of the low and high outliers.
  const lowEnd = lowCount > 0 ? lowCount - 1 : -Infinity;
  const highStart = highCount > 0 ? impactVisibleSorted.size - highCount : Infinity;

  // ========================================================================
  // SEPARATION CHECK — switch off a tail that is not separated by one vote.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, lowEnd, highStart);
};
