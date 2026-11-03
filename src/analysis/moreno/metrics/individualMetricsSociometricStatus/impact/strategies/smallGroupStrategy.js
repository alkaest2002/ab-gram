// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";

/**
 * Small-group strategy: for the sub-minVisibleForEnablingAlgorithm regime
 * (2..threshold-1 visible members), find the largest gap between consecutive
 * sorted impacts and flag only the smaller side of that gap as the outlier
 * tail. The bulk stays average-impact so its balance can still decide status.
 *
 * @param {{ visibleSortedImpacts: number[], visibleGroupSize: number }} context - Sorted visible impacts and their count.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const smallGroupStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // Cache config.
    const cfg = CONFIG.impact.smallGroup;

    // Rename for clarity.
    const values = visibleSortedImpacts;

    // Complement to the tail strategies: only below its own visible threshold.
    if (visibleGroupSize < 2 || visibleGroupSize >= cfg.minVisibleForEnablingAlgorithm) return NO_SPLIT;

    // Find the largest gap between consecutive sorted values.
    let split = 0;
    let largestGap = 0;
    for (let i = 1; i < visibleGroupSize; i++) {
        const gap = values[i] - values[i - 1];
        if (gap > largestGap) {
            largestGap = gap;
            split = i - 1;
        }
    }

    // All equal — nothing to separate.
    if (largestGap === 0) return NO_SPLIT;

    // Second-largest gap, for contrast.
    let secondGap = 0;
    for (let i = 1; i < visibleGroupSize; i++) {
        if (i - 1 !== split) secondGap = Math.max(secondGap, values[i] - values[i - 1]);
    }

    // The spread of values in the group.
    const spread = values[visibleGroupSize - 1] - values[0];

    // A gap only counts if it's a real jump (>= 2 received opinions) and it
    // dominates the runner-up gap or the overall spread.
    const isDominant =
        largestGap >= cfg.minGap &&
        (largestGap >= 2 * secondGap || largestGap >= 0.5 * spread);

    if (!isDominant) return NO_SPLIT;

    // Flag only the smaller side of the gap as the outlier tail; the bulk
    // remains average. Equal sides (n = 4, 2v2) is a genuine two-way split.
    const leftCount = split + 1;
    const rightCount = visibleGroupSize - leftCount;

    if (leftCount < rightCount) {
        return { low: values[split], high: Infinity };
    }
    if (rightCount < leftCount) {
        return { low: -Infinity, high: values[split + 1] };
    }
    return { low: values[split], high: values[split + 1] };
};
