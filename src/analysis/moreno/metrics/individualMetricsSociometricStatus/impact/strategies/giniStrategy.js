// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeGiniCoefficient } from "@/analysis/common/commonMetrics.js";
import { NO_SPLIT } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/sociometricStatusHelpers.js";

// Strategy parameters.
const MIN_VISIBLE_MEMBERS = 5;
const STRONG_GINI = 0.3;
const MODERATE_GINI = 0.2;
const MIN_PTP_FOR_MODERATE = 3;
const LOW_PERCENTILE = 5;
const HIGH_PERCENTILE = 95;

/**
 * Gini strategy: decides whether the distribution is unequal (sample-corrected
 * Gini and range), then cuts at the configured percentiles when it is.
 *
 * @param {{ visibleSortedImpacts: number[], visibleGroupSize: number }} context - Sorted visible impacts and their count.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const giniStrategy = ({ visibleSortedImpacts, visibleGroupSize }) => {
    // No split if there are not enough visible members.
    if (visibleGroupSize < MIN_VISIBLE_MEMBERS) return NO_SPLIT;

    // Compute the range of the data
    const ptp = visibleSortedImpacts[visibleSortedImpacts.length - 1] - visibleSortedImpacts[0];

    // Compute Bias-corrected sample Gini (* N/(N-1)): the population formula
    // underestimates inequality in the small groups typical of sociometry.
    const gini =
        computeGiniCoefficient(np.array(visibleSortedImpacts)) * (visibleGroupSize / (visibleGroupSize - 1));

    // Is the Gini coefficient strong enough to suggest inequality?
    const unequal =
        gini >= STRONG_GINI || (gini >= MODERATE_GINI && ptp >= MIN_PTP_FOR_MODERATE);

    // No split if Gini is not strong enough to suggest inequality
    if (!unequal) return NO_SPLIT;

    return tailCutoffs(visibleSortedImpacts, LOW_PERCENTILE, HIGH_PERCENTILE);
};
