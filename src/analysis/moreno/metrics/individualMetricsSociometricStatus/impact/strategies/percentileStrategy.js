// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MIN_VISIBLE_MEMBERS = 5;
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
    // Do not split if there are not enough visible members.
    if (visibleGroupSize < MIN_VISIBLE_MEMBERS) return NO_SPLIT;

    // Compute tail cutoffs.
    const { low, high } = tailCutoffs(visibleSortedImpacts, LOW_PERCENTILE, HIGH_PERCENTILE);

    // No split if percentiles are the same.
    if (low === high) return NO_SPLIT;

    return { low, high };
};
