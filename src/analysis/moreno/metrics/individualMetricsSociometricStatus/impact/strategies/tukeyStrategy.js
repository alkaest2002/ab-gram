// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import {
  percentileOf,
  finalizeSplit,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters
const MIN_MEMBERS = 3;
const K = 1;

/**
 * Tukey strategy: strict inner fences (Q1 - k*IQR, Q3 + k*IQR) over visible
 * impacts. Values beyond a fence are outliers; cutoffs are the nearest observed
 * values strictly beyond each fence.
 *
 * @param {{ visibleSortedImpacts: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const tukeyStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
  const values = visibleSortedImpacts;

  // ========================================================================
  // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  const q1 = percentileOf(values, 25);
  const q3 = percentileOf(values, 75);
  const iqr = q3 - q1;
  if (visibleGroupSize < MIN_MEMBERS || iqr === 0) return NO_SPLIT;

  // ========================================================================
  // CLASSIFY — split the sorted values at the fences.
  // ========================================================================
  const lowFence = q1 - K * iqr;
  const highFence = q3 + K * iqr;

  let lowEnd = -1;
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] < lowFence) lowEnd = i;
    else break;
  }

  let highStart = values.length;
  for (let i = values.length - 1; i >= 0; i -= 1) {
    if (values[i] > highFence) highStart = i;
    else break;
  }

  // ========================================================================
  // SEPARATION CHECK — switch off a tail that is not separated by one vote.
  // ========================================================================
  return finalizeSplit(values, lowEnd, highStart);
};
