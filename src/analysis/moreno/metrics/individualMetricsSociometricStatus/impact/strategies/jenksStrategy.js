// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { medianOf } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/helpers.js";

/**
 * Fisher-Jenks optimal 1-D clustering (exact DP, O(k * n^2)).
 *
 * @param {number[]} sorted - Sorted (ascending) values.
 * @param {number} k - Number of classes.
 * @returns {{ starts: number[], sdcm: number }} Start index of every class except the first, and the total within-class sum of squares (SDCM).
 */
const jenksBreaks = (sorted, k) => {
    const n = sorted.length;

    // Prefix sums give the SSE of any slice in O(1).
    const s1 = [0];
    const s2 = [0];
    for (const v of sorted) {
        s1.push(s1[s1.length - 1] + v);
        s2.push(s2[s2.length - 1] + v * v);
    }
    // SSE of sorted[i..j], inclusive.
    const sse = (i, j) => {
        const sum = s1[j + 1] - s1[i];
        return s2[j + 1] - s2[i] - (sum * sum) / (j - i + 1);
    };

    // cost[c][j]: min SSE of splitting sorted[0..j] into c classes.
    // back[c][j]: start index of the last class in that optimum.
    const cost = Array.from({ length: k + 1 }, () =>
        new Array(n).fill(Infinity),
    );
    const back = Array.from({ length: k + 1 }, () => new Array(n).fill(0));
    for (let j = 0; j < n; j++) cost[1][j] = sse(0, j);

    for (let c = 2; c <= k; c++) {
        for (let j = c - 1; j < n; j++) {
            for (let i = c - 1; i <= j; i++) {
                const total = cost[c - 1][i - 1] + sse(i, j);
                if (total < cost[c][j]) {
                    cost[c][j] = total;
                    back[c][j] = i;
                }
            }
        }
    }

    const starts = [];
    let j = n - 1;
    for (let c = k; c >= 2; c--) {
        const i = back[c][j];
        starts.unshift(i);
        j = i - 1;
    }
    return { starts, sdcm: cost[k][n - 1] };
};

/**
 * Jenks natural breaks (k = 3): cutoffs fall in the widest gaps, gated by the
 * goodness of variance fit (GVF = 1 - SDCM/SDAM) so structureless data abstains.
 *
 * @param {{ visibleSortedImpacts: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const jenksStrategy = ({ visibleSortedImpacts }) => {
    const n = visibleSortedImpacts.length;
    const distinct = new Set(visibleSortedImpacts).size;
    const k = 3;

    // No split if there are not enough visible members
    if (n < CONFIG.impact.jenks.minVisibleForEnablingAlgorithm) return NO_SPLIT;

    // No split if there are not enough distinct values
    if (distinct < k) return NO_SPLIT;

    const mean = visibleSortedImpacts.reduce((s, v) => s + v, 0) / n;
    const sdam = visibleSortedImpacts.reduce((s, v) => s + (v - mean) ** 2, 0);

    // No split if SDAM is zero (all values are the same)
    if (sdam === 0) return NO_SPLIT;

    const { starts, sdcm } = jenksBreaks(visibleSortedImpacts, k);

    // No split if the goodness of variance fit is below the threshold
    if (1 - sdcm / sdam < CONFIG.impact.jenks.minGvf) return NO_SPLIT;

    const median = medianOf(visibleSortedImpacts);
    let low = visibleSortedImpacts[starts[0] - 1]; // max of the first class
    let high = visibleSortedImpacts[starts[starts.length - 1]]; // min of the last class

    // Same guard as tailCutoffs: a tail must stay strictly beyond the median.
    if (!(low < median)) low = -Infinity;
    if (!(high > median)) high = Infinity;

    return low === -Infinity && high === Infinity ? NO_SPLIT : { low, high };
};
