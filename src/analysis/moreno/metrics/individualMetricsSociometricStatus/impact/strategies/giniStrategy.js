// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeGiniCoefficient } from "@/analysis/common/commonMetrics.js";
import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/tailCutoffs.js";

/**
 * Gini strategy: decides whether the distribution is unequal (sample-corrected
 * Gini and range), then cuts at the configured percentiles when it is.
 *
 * @param {{ sorted: number[] }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const giniStrategy = ({ sorted }) => {
    const c = CONFIG.gini;

    // No split if there are not enough visible members
    if (sorted.length < Math.max(2, CONFIG.minVisibleForTails)) return NO_SPLIT;

    // Compute the range of the data
    const ptp = sorted[sorted.length - 1] - sorted[0];

    // Compute Bias-corrected sample Gini (* N/(N-1)): the population formula
    // underestimates inequality in the small groups typical of sociometry.
    const gini =
        computeGiniCoefficient(np.array(sorted)) *
        (sorted.length / (sorted.length - 1));

    // Is the Gini coefficient strong enough to suggest inequality?
    const unequal =
        gini >= c.strong || (gini >= c.moderate && ptp >= c.minPtpForModerate);

    // No split if Gini is not strong enough to suggest inequality
    if (!unequal) return NO_SPLIT;

    return tailCutoffs(sorted, c.percentile.low, c.percentile.high);
};
