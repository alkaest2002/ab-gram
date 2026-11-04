// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { medianOf, finalizeSplit } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const Z_CUTOFF = 3.5; // robust z-score beyond which a value is an outlier
const MAD_FLOOR = 0.5; // floor on the median absolute deviation
const MAD_SCALE = 1.4826; // MAD -> normal-distribution standard-deviation scale

/**
 * Robust z-score strategy: flags values whose scaled distance from the median
 * (median absolute deviation) exceeds Z_CUTOFF. More resistant to outliers
 * than Tukey's IQR fences.
 *
 * @param {{ visibleSortedImpacts: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const robustZScoreStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // ========================================================================
    // VVOTE ELIGIBILITY — abstain vote under this/these condition(s).
    // ========================================================================
    if (visibleGroupSize < MIN_MEMBERS) return NO_SPLIT;

    const med = medianOf(visibleSortedImpacts);
    const deviations = visibleSortedImpacts.map((v) => Math.abs(v - med)).sort((a, b) => a - b);
    const mad = Math.max(medianOf(deviations), MAD_FLOOR);

    const lowFence = med - Z_CUTOFF * MAD_SCALE * mad;
    const highFence = med + Z_CUTOFF * MAD_SCALE * mad;

    let lowEnd = -1;
    for (let i = 0; i < visibleSortedImpacts.length; i += 1) {
        if (visibleSortedImpacts[i] < lowFence) lowEnd = i;
        else break;
    }

    let highStart = visibleSortedImpacts.length;
    for (let i = visibleSortedImpacts.length - 1; i >= 0; i -= 1) {
        if (visibleSortedImpacts[i] > highFence) highStart = i;
        else break;
    }

    // ========================================================================
    // SEPARATION CHECK — switch off a tail that is not separated by one vote.
    // ========================================================================
    return finalizeSplit(visibleSortedImpacts, lowEnd, highStart);
};
