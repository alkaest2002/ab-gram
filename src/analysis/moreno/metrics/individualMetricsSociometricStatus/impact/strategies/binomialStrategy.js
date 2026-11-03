// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";

/**
 * Cumulative distribution function of Binomial(n, p), computed in log space to
 * avoid underflow for large n.
 *
 * @param {number} n - Number of trials.
 * @param {number} p - Success probability.
 * @returns {number[]} cdf[k] = P(X <= k) for k = 0..n.
 */
const binomialCdf = (n, p) => {
    // Recurrence kept in log space: (1-p)^n underflows to 0 for large n, which
    // would zero the entire CDF if carried multiplicatively.
    const logOdds = Math.log(p) - Math.log1p(-p);
    let logPmf = n * Math.log1p(-p); // log P(X = 0)
    let cumulative = 0;
    const cdf = [];
    for (let k = 0; k <= n; k++) {
        cumulative += Math.exp(logPmf);
        cdf.push(Math.min(1, cumulative));
        logPmf += Math.log((n - k) / (k + 1)) + logOdds; // log P(X = k+1)
    }
    return cdf;
};

/**
 * Binomial (GB) strategy: exact two-sided binomial test under the chance
 * model. Limits are the counts whose tail probability is <= alpha/2.
 *
 * @param {{ allImpacts: number[], originalGroupSize: number }} context - All impacts and the original group size.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const binomialStrategy = ({ allImpacts, originalGroupSize }) => {
    const n = originalGroupSize - 1; // possible givers for any one member
    if (n < 1) return NO_SPLIT;
    const total = allImpacts.reduce((s, v) => s + v, 0);
    const p = total / (originalGroupSize * n);

    // The p < 1 guard also covers degenerate density: a giver nominating the
    // same member in both likes and dislikes can push p past the model's range.
    if (!(p > 0 && p < 1)) return NO_SPLIT;

    const tail = CONFIG.impact.binomial.alpha / 2;
    const cdf = binomialCdf(n, p);

    // Largest k with P(X <= k) <= tail.
    let low = -Infinity;
    for (let k = 0; k <= n && cdf[k] <= tail; k++) low = k;

    // Smallest k with P(X >= k) = 1 - P(X <= k-1) <= tail.
    let high = Infinity;
    for (let k = n; k >= 1 && 1 - cdf[k - 1] <= tail; k--) high = k;

    return { low, high };
};
