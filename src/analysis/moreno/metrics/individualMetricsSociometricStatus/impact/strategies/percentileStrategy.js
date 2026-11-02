// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/helpers.js";

/**
 * Plain-percentile strategy: cuts at the configured low/high percentiles with
 * tie-trimming. Abstains with fewer than its minimum visible members.
 *
 * @param {{ visibleSortedImpacts: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const percentileStrategy = ({ visibleSortedImpacts, groupSize }) => {
    // Cache config.
    const cfg = CONFIG.impact.percentile;

    // Do not split if there are not enough visible members
    if (groupSize < cfg.minVisibleForEnablingAlgorithm) return NO_SPLIT;

    // Compute tail cutoffs.
    const { low, high } = tailCutoffs(visibleSortedImpacts, cfg.low, cfg.high);

    // No split if percentiles are the same.
    if (low === high) return NO_SPLIT;

    return { low, high };
};
