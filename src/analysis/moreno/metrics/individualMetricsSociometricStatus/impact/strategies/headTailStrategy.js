// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const MAX_HEAD_SHARE = 0.4;

/**
 * Head/tail breaks: recursively split the heavy-tailed "head" (values above
 * the mean) until the classical stop condition.
 *
 * @param {number[]} sorted - Sorted (ascending) values.
 * @returns {number[]} Break means, in increasing order.
 */
const headTailBreaks = (sorted) => {
  /** @type {number[]} */
  const breaks = [];
  let current = sorted;
  while (current.length > 0) {
    const n = current.length;
    const mean = current.reduce((s, v) => s + v, 0) / n;
    const head = current.filter((v) => v > mean);
    if (head.length === 0) break; // no split possible (all values equal)
    breaks.push(mean);
    if (head.length / n >= MAX_HEAD_SHARE) break; // classical stop
    current = head;
  }
  return breaks;
};

/**
 * Head/tail breaks strategy: head/tail breaks only carves the heavy-tailed
 * high end, so this votes on the high cutoff and abstains on the low side
 * (low = -Infinity).
 *
 * @param {{ visibleSortedImpacts: number[], visibleGroupSize: number }} context - Sorted visible impacts and their count.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const headTailStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  if (visibleGroupSize < MIN_MEMBERS) return NO_SPLIT;

  const breaks = headTailBreaks(visibleSortedImpacts);
  if (breaks.length === 0) return NO_SPLIT;

  // ========================================================================
  // CLASSIFY — high = lower bound of the last (highest) class (final head).
  // ========================================================================
  const lastBreak = breaks[breaks.length - 1];
  let highStart = visibleSortedImpacts.length;
  for (let i = visibleSortedImpacts.length - 1; i >= 0; i -= 1) {
    if (visibleSortedImpacts[i] > lastBreak) highStart = i;
    else break;
  }

  // ========================================================================
  // SEPARATION CHECK — no low tail; switch off high if it is not separated.
  // ========================================================================
  return finalizeSplit(visibleSortedImpacts, -1, highStart);
};
