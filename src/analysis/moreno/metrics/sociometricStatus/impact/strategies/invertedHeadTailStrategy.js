// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 4;
const MAX_MEMBERS = 35;
const MAX_TAIL_SHARE = 0.4;

/**
 * Inverted head/tail breaks: recursively split the light-tailed "tail" (values
 * below the mean) until the mirrored classical stop condition.
 *
 * @param {import("numpy-ts").NDArray} sorted - Sorted (ascending) values.
 * @returns {number[]} Break means, in decreasing order.
 */
const invertedHeadTailBreaks = (sorted) => {
  /** @type {number[]} */
  const breaks = [];
  let current = sorted;
  while (current.size > 0) {
    const n = current.size;
    const mean = current.mean();
    const tail = current.compress(current.less(mean));
    if (tail.size === 0) break; // no split possible (all values equal)
    breaks.push(mean);
    if (tail.size / n >= MAX_TAIL_SHARE) break; // mirrored classical stop
    current = tail;
  }
  return breaks;
};

/**
 * Inverted head/tail breaks strategy for 4–35 visible members: recursively
 * carves the sparse low end, so this votes on the low cutoff and abstains on
 * the high side (high = Infinity).
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const invertedHeadTailStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain when the strategy requirements are not met.
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS || impactVisibleSorted.size > MAX_MEMBERS) {
    return NO_SPLIT;
  }

  // ========================================================================
  // FIND CLASSIFICATION BOUNDARIES — use the final tail as the low tail.
  // ========================================================================
  const breaks = invertedHeadTailBreaks(impactVisibleSorted);
  if (breaks.length === 0) return NO_SPLIT;

  const lastBreak = breaks[breaks.length - 1];
  const lowCount = impactVisibleSorted.compress(impactVisibleSorted.less(lastBreak)).size;
  const lowEnd = lowCount > 0 ? lowCount - 1 : -Infinity;

  // ========================================================================
  // SEPARATION CHECK — no high tail; switch off low if it is not separated.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, lowEnd, Infinity);
};
