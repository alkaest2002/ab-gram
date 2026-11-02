// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { percentileOf } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/helpers.js";

// Tukey's inner fences over visible members: Q1 - k*IQR, Q3 + k*IQR.
// Strict, as in Tukey's definition: only values BEYOND a fence are outliers,
// never a value sitting exactly on it. Since downstream comparisons are
// inclusive (<= low, >= high), the cutoffs are set to the nearest observed
// value strictly beyond each fence. Fences outside the observed range leave
// that side unflagged.
export const tukeyStrategy = ({ sorted }) => {
    const q1 = percentileOf(sorted, 25);
    const q3 = percentileOf(sorted, 75);
    const iqr = q3 - q1;
    if (iqr === 0) return NO_SPLIT; // fences would collapse onto the median
    const k = CONFIG.tukey.k;
    const lowFence = q1 - k * iqr;
    const highFence = q3 + k * iqr;

    let low = -Infinity;
    for (const v of sorted) {
        if (v < lowFence)
            low = v; // largest value strictly below the fence
        else break;
    }
    let high = Infinity;
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
        if (sorted[i] > highFence)
            high = sorted[i]; // smallest strictly above
        else break;
    }
    return { low, high };
};
