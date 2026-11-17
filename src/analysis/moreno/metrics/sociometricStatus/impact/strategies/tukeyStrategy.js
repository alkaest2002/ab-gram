// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import {
  percentileOf,
  finalizeSplit,
} from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 7;
const MAX_MEMBERS = 35;
const K = 1;

/**
 * Tukey strategy for 7–35 visible members: strict inner fences
 * (Q1 - k*IQR, Q3 + k*IQR) over visible impacts. Values beyond a fence are
 * outliers; cutoffs are the nearest observed values strictly beyond each fence.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const tukeyStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain when the strategy requirements are not met.
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS || impactVisibleSorted.size > MAX_MEMBERS)
    return NO_SPLIT;

  const q1 = percentileOf(impactVisibleSorted, 25);
  const q3 = percentileOf(impactVisibleSorted, 75);
  const iqr = q3 - q1;
  if (iqr === 0) return NO_SPLIT;

  // ========================================================================
  // FIND CLASSIFICATION BOUNDARIES — split the sorted values at the fences.
  // ========================================================================
  const lowCount = impactVisibleSorted.less(q1 - K * iqr).sum();
  const highCount = impactVisibleSorted.greater(q3 + K * iqr).sum();

  // ========================================================================
  // SEPARATION CHECK — switch off a tail that is not separated by one vote.
  // ========================================================================
  return finalizeSplit(
    impactVisibleSorted,
    lowCount ? lowCount - 1 : -Infinity,
    highCount ? impactVisibleSorted.size - highCount : Infinity,
  );
};
