// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 4;
const MAX_MEMBERS = 6;

/**
 * For 4–6 visible members, split sorted impacts at the two widest adjacent
 * gaps. The earlier gap sets the low cutoff and the later gap sets the high
 * cutoff. The two gaps may be equally wide if both exceed the third widest.
 *
 * If the second- and third-widest gaps tie, use only the unique widest gap.
 * If fewer members lie to its left, set only the low cutoff (high = Infinity);
 * if fewer lie to its right, set only the high cutoff (low = -Infinity).
 * Return NO_SPLIT if this fallback has no unique widest gap or the two sides
 * have equal member counts. Also return NO_SPLIT outside the 4–6 member range.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const largestGapStrategy = ({ impactVisibleSorted }) => {
  // The number of visible members is the length of the sorted array.
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
  const gapOrder = gaps.argsort();
  const secondWidestGap = gapOrder.get([-2]);
  const thirdWidestGap = gapOrder.get([-3]);

  if (gaps.take([secondWidestGap, thirdWidestGap]).diff().sum() === 0) {
    // Take the widest gap
    const widestGap = gapOrder.get([-1]);

    // If the second-widest gap is tied, abstain.
    if (gaps.get([widestGap]) === gaps.get([secondWidestGap])) return NO_SPLIT;

    // Compute the number of members on each side of the widest gap. If they are equal, abstain.
    const leftCount = widestGap + 1;
    const rightCount = n - leftCount;
    if (leftCount === rightCount) return NO_SPLIT;

    // If the widest gap is unique, classify only its smaller side as a tail.
    return leftCount < rightCount
      ? finalizeSplit(impactVisibleSorted, widestGap, Infinity)
      : finalizeSplit(impactVisibleSorted, -Infinity, widestGap + 1);
  }

  // Select the two widest gaps and order their indices from left to right.
  const [c1, c2] = gapOrder.slice("-2:").sort().toArray();

  // ========================================================================
  // SEPARATION CHECK — c1 is the low/average boundary, c2 the average/high.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, c1, c2 + 1);
};
