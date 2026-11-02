// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { percentileOf } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/helpers.js";

/**
 * Tukey strategy: strict inner fences (Q1 - k*IQR, Q3 + k*IQR) over visible
 * impacts. Values beyond a fence are outliers; cutoffs are the nearest observed
 * values strictly beyond each fence.
 *
 * @param {{ visibleSortedImpacts: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const tukeyStrategy = ({ visibleSortedImpacts }) => {
    const q1 = percentileOf(visibleSortedImpacts, 25);
    const q3 = percentileOf(visibleSortedImpacts, 75);
    const iqr = q3 - q1;
    if (iqr === 0) return NO_SPLIT; // fences would collapse onto the median
    const k = CONFIG.tukey.k;
    const lowFence = q1 - k * iqr;
    const highFence = q3 + k * iqr;

    let low = -Infinity;
    for (const v of visibleSortedImpacts) {
        if (v < lowFence)
            low = v; // largest value strictly below the fence
        else break;
    }
    let high = Infinity;
    for (let i = visibleSortedImpacts.length - 1; i >= 0; i -= 1) {
        if (visibleSortedImpacts[i] > highFence)
            high = visibleSortedImpacts[i]; // smallest strictly above
        else break;
    }
    return { low, high };
};
