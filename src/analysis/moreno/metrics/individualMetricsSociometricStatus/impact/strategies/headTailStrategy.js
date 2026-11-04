// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";

// Strategy parameters.
const MIN_VISIBLE_MEMBERS = 5;
const MAX_HEAD_SHARE = 0.4; // keep splitting while the head is < 40% of the data

/**
 * Head/tail breaks: recursively split the heavy-tailed "head" (values above
 * the mean) until the classical stop condition.
 *
 * @param {number[]} sorted - Sorted (ascending) values.
 * @returns {number[]} Break means, in increasing order.
 */
const headTailBreaks = (sorted) => {
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
    // No split if there are not enough visible members.
    if (visibleGroupSize < MIN_VISIBLE_MEMBERS) return NO_SPLIT;

    // Compute the breaks for the head/tail strategy
    const breaks = headTailBreaks(visibleSortedImpacts);

    // No split if no breaks were found
    if (breaks.length === 0) return NO_SPLIT;

    // High = lower bound of the last (highest) class, i.e. the final head.
    let high = Infinity;
    const lastBreak = breaks[breaks.length - 1];
    for (let i = visibleSortedImpacts.length - 1; i >= 0; i -= 1) {
        if (visibleSortedImpacts[i] > lastBreak) high = visibleSortedImpacts[i];
        else break;
    }

    return { low: -Infinity, high };
};
