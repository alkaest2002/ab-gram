// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const MIN_GVF = 0.75;

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
 * @param {{ visibleSortedImpacts: number[], visibleGroupSize: number }} context - Sorted visible impacts and their count.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const jenksStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // ========================================================================
    // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
    // ========================================================================
    if (visibleGroupSize < MIN_MEMBERS) return NO_SPLIT;

    const distinctImpactValues = new Set(visibleSortedImpacts).size;
    if (distinctImpactValues < 3) return NO_SPLIT;

    // Convert to NumPy array for efficient gap calculations.
    const npValues = np.array(visibleSortedImpacts);

    const mean = npValues.mean();
    const sdam = npValues.subtract(mean).power(2).sum();
    if (sdam === 0) return NO_SPLIT;

    const { starts, sdcm } = jenksBreaks(visibleSortedImpacts, 3);
    if (1 - sdcm / sdam < MIN_GVF) return NO_SPLIT;

    // ========================================================================
    // CLASSIFY + SEPARATION CHECK — class 1 is low, class 3 is high.
    // ========================================================================
    return finalizeSplit(visibleSortedImpacts, starts[0] - 1, starts[1]);
};
