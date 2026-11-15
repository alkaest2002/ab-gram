// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const Z_CUTOFF = 3.5; // robust z-score beyond which a value is an outlier
const MAD_FLOOR = 0.5; // floor on the median absolute deviation
const MAD_SCALE = 1.4826; // MAD -> normal-distribution standard-deviation scale

/**
 * Robust z-score strategy: flags values whose scaled distance from the median
 * (median absolute deviation) exceeds Z_CUTOFF. More resistant to outliers
 * than Tukey's IQR fences.
 *
 * @param {{ impactVisibleSorted: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const robustZScoreStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VVOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  if (impactVisibleSorted.length < MIN_MEMBERS) return NO_SPLIT;

  // Convert to NumPy array for efficient gap calculations.
  const npValues = np.array(impactVisibleSorted, "int32");

  const median = npValues.median();
  const deviations = npValues.subtract(median).absolute();
  const mad = Math.max(deviations.median(), MAD_FLOOR);

  const lowFence = median - Z_CUTOFF * MAD_SCALE * mad;
  const highFence = median + Z_CUTOFF * MAD_SCALE * mad;

  let lowEnd = -1;
  for (let i = 0; i < impactVisibleSorted.length; i += 1) {
    if (impactVisibleSorted[i] < lowFence) lowEnd = i;
    else break;
  }

  let highStart = impactVisibleSorted.length;
  for (let i = impactVisibleSorted.length - 1; i >= 0; i -= 1) {
    if (impactVisibleSorted[i] > highFence) highStart = i;
    else break;
  }

  // ========================================================================
  // SEPARATION CHECK — switch off a tail that is not separated by one vote.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, lowEnd, highStart);
};
