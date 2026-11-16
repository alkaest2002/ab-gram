// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const MAX_HEAD_SHARE = 0.4;

/**
 * Head/tail breaks: recursively split the heavy-tailed "head" (values above
 * the mean) until the classical stop condition.
 *
 * @param {import("numpy-ts").NDArray} sorted - Sorted (ascending) values.
 * @returns {number[]} Break means, in increasing order.
 */
const headTailBreaks = (sorted) => {
  /** @type {number[]} */
  const breaks = [];
  let current = sorted;
  while (current.size > 0) {
    const n = current.size;
    const mean = current.mean();
    const head = current.compress(current.greater(mean));
    if (head.size === 0) break; // no split possible (all values equal)
    breaks.push(mean);
    if (head.size / n >= MAX_HEAD_SHARE) break; // classical stop
    current = head;
  }
  return breaks;
};

/**
 * Head/tail breaks strategy: head/tail breaks only carves the heavy-tailed
 * high end, so this votes on the high cutoff and abstains on the low side
 * (low = -Infinity).
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const headTailStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS) return NO_SPLIT;

  const breaks = headTailBreaks(impactVisibleSorted);
  if (breaks.length === 0) return NO_SPLIT;

  // ========================================================================
  // CLASSIFY — high = lower bound of the last (highest) class (final head).
  // ========================================================================
  const lastBreak = breaks[breaks.length - 1];
  let highStart = impactVisibleSorted.size;
  for (let i = impactVisibleSorted.size - 1; i >= 0; i -= 1) {
    if (impactVisibleSorted.get([i]) > lastBreak) highStart = i;
    else break;
  }

  // ========================================================================
  // SEPARATION CHECK — no low tail; switch off high if it is not separated.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, -1, highStart);
};
