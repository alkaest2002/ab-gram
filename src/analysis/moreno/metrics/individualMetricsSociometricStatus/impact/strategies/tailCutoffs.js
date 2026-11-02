// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import {
    percentileOf,
    medianOf,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/helpers.js";

/**
 * Cut a { low, high } pair at the given percentiles, then keep the tails clear
 * of the tied bulk: a side whose cutoff reaches the median is pulled in to the
 * nearest value strictly beyond the median (or dropped if none exists).
 *
 * @param {number[]} sorted - Sorted (ascending) visible impacts.
 * @param {number} lowPercentile - Percentile for the low cutoff.
 * @param {number} highPercentile - Percentile for the high cutoff.
 * @returns {{ low: number, high: number }} Observed cutoffs (either may be infinite).
 */
export const tailCutoffs = (sorted, lowPercentile, highPercentile) => {
    const median = medianOf(sorted);

    let low = percentileOf(sorted, lowPercentile);
    if (!(low < median)) {
        low = -Infinity;
        for (const v of sorted) {
            if (v < median)
                low = v; // ends as the largest value strictly below
            else break;
        }
    }

    let high = percentileOf(sorted, highPercentile);
    if (!(high > median)) {
        high = Infinity;
        for (let i = sorted.length - 1; i >= 0; i -= 1) {
            if (sorted[i] > median)
                high = sorted[i]; // smallest strictly above
            else break;
        }
    }

    return low === -Infinity && high === Infinity ? NO_SPLIT : { low, high };
};
