// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

const MIN_MEMBERS = 4;
const MAX_MEMBERS = 6;
const MIN_DISTANCE = 2;

/**
 * For 4–6 visible members, use the impact score shared by more than half the
 * group as the baseline. Scores at least two received opinions below or above
 * it qualify as low or high, respectively. The two sides qualify independently.
 * Abstain outside this size range, without a strict majority, or if neither
 * side qualifies.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Visible impact scores sorted in ascending order.
 * @returns {{ low: number, high: number }} Inclusive cutoffs, or NO_SPLIT when abstaining.
 *   An absent low or high cutoff is represented by -Infinity or Infinity, respectively.
 */
export const majorityBaselineStrategy = ({ impactVisibleSorted }) => {
  const n = impactVisibleSorted.size;
  if (n < MIN_MEMBERS || n > MAX_MEMBERS) return NO_SPLIT;

  // In sorted scores, any strict majority necessarily occupies the middle index.
  const baseline = impactVisibleSorted.get([Math.floor(n / 2)]);

  // If the baseline is not shared by a strict majority, abstain.
  if (impactVisibleSorted.equal(baseline).sum() <= n / 2) return NO_SPLIT;

  // Count how many members are at least MIN_DISTANCE below or above the baseline.
  const lowCount = impactVisibleSorted.less_equal(baseline - MIN_DISTANCE).sum();
  const highCount = impactVisibleSorted.greater_equal(baseline + MIN_DISTANCE).sum();
  const lowEnd = lowCount ? lowCount - 1 : -Infinity;
  const highStart = highCount ? n - highCount : Infinity;
  return finalizeSplit(impactVisibleSorted, lowEnd, highStart);
};
