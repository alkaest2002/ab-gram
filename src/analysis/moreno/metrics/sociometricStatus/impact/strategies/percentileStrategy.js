// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import {
  finalizeSplit,
  rankIndex,
} from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 10;
const MAX_MEMBERS = 35;
const LOW_PERCENTILE = 10;
const HIGH_PERCENTILE = 90;

/**
 * Plain-percentile strategy for 10–35 visible members: cuts at the configured
 * low/high percentiles with tie-trimming.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const percentileStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS || impactVisibleSorted.size > MAX_MEMBERS) {
    return NO_SPLIT;
  }

  // ========================================================================
  // CLASSIFY + SEPARATION CHECK — tail cutoffs at the configured percentiles.
  // ========================================================================
  const n = impactVisibleSorted.size;
  const lowEnd = rankIndex(n, LOW_PERCENTILE);
  const highStart = n - 1 - rankIndex(n, 100 - HIGH_PERCENTILE);
  return finalizeSplit(impactVisibleSorted, lowEnd, highStart);
};
