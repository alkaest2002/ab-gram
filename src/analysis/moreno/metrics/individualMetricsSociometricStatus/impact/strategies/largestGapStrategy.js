// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MAX_MEMBERS = 4;

/**
 * Largest-gap strategy: split the sorted visible impacts at the two widest
 * gaps into low / average / high tails. A side whose gap is empty (equal
 * values) collapses to the corresponding infinite bound.
 *
 * @param {{ visibleSortedImpacts: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const largestGapStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // ========================================================================
    // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
    // ========================================================================
    if (visibleGroupSize > MAX_MEMBERS) return NO_SPLIT;

    const s = np.sort(np.array(visibleSortedImpacts)).toArray();
    const gaps = np.diff(np.array(s));
    const gapOrder = np.argsort(gaps).toArray(); // ascending by gap size

    const n = s.length;
    const [c1, c2] = [gapOrder[n - 2], gapOrder[n - 3]].sort((a, b) => a - b);

    // ========================================================================
    // SEPARATION CHECK — c1 is the low/average boundary, c2 the average/high.
    // ========================================================================
    return finalizeSplit(s, c1, c2 + 1);
};
