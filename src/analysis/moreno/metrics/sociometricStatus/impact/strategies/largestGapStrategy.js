// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 4;
const MAX_MEMBERS = 6;

/**
 * Largest-gap strategy for 4–6 visible members: split the sorted impacts at
 * the two widest gaps into low / average / high tails. A side whose gap is
 * empty (equal values) collapses to the corresponding infinite bound.
 *
 * Abstains when the second-largest gap ties with an unselected gap, making
 * the boundary pair ambiguous. Exactly two equally largest gaps are allowed.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const largestGapStrategy = ({ impactVisibleSorted }) => {
  const n = impactVisibleSorted.size;

  // ========================================================================
  // VOTE ELIGIBILITY — abstain when the strategy requirements are not met.
  // ========================================================================
  if (n < MIN_MEMBERS || n > MAX_MEMBERS) return NO_SPLIT;

  // ========================================================================
  // FIND CLASSIFICATION BOUNDARIES — split at the two widest gaps.
  // ========================================================================
  // Gap i lies between sorted[i] and sorted[i + 1]. Sort gap indices by
  // ascending size.
  const gaps = impactVisibleSorted.diff();
  const gapOrder = gaps.argsort().toArray();

  // The boundary pair must be uniquely determined; abstain when gaps tie.
  if (gaps.get([gapOrder[n - 3]]) === gaps.get([gapOrder[n - 4]])) return NO_SPLIT;

  // The two widest gaps are the last two entries; order them by position.
  const [c1, c2] = [gapOrder[n - 2], gapOrder[n - 3]].sort((a, b) => a - b);

  // ========================================================================
  // SEPARATION CHECK — c1 is the low/average boundary, c2 the average/high.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, c1, c2 + 1);
};
