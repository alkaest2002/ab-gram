// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const LOW_PERCENTILE = 10;
const HIGH_PERCENTILE = 90;

/**
 * Plain-percentile strategy: cuts at the configured low/high percentiles with
 * tie-trimming. Abstains with fewer than its minimum visible members.
 *
 * @param {{ visibleSortedImpacts: number[], visibleGroupSize: number }} context - Sorted visible impacts and their count.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const percentileStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // ========================================================================
    // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
    // ========================================================================
    if (visibleGroupSize < MIN_MEMBERS) return NO_SPLIT;

    // ========================================================================
    // CLASSIFY + SEPARATION CHECK — tail cutoffs at the configured percentiles.
    // ========================================================================
    return tailCutoffs(visibleSortedImpacts, LOW_PERCENTILE, HIGH_PERCENTILE);
};
