// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MAX_MEMBERS = 4;

/**
 * Largest-gap strategy: split the sorted visible impacts at the two widest
 * gaps into low / average / high tails. A side whose gap is empty (equal
 * values) collapses to the corresponding infinite bound.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const largestGapStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  if (impactVisibleSorted.size > MAX_MEMBERS) return NO_SPLIT;

  const gapOrder = impactVisibleSorted.diff().argsort(); // ascending by gap size
  const n = impactVisibleSorted.size;
  const [c1, c2] = [gapOrder.get([n - 2]), gapOrder.get([n - 3])].sort((a, b) => a - b);

  // ========================================================================
  // SEPARATION CHECK — c1 is the low/average boundary, c2 the average/high.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, c1, c2 + 1);
};
