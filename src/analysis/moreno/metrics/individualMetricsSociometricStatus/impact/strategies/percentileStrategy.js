// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import {
    CONFIG,
    NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/tailCutoffs.js";

// Plain percentiles, tie-aware. Abstains for fewer than
// minVisibleForTails visible members: with so few, "bottom 20%" is one or two
// people and says nothing about clear tails. Because tails never include the
// tied median bulk, this strategy now also abstains on flat distributions
// instead of always voting.
export const percentileStrategy = ({ sorted }) => {
    // Do not split if there are not enough visible members
    if (sorted.length < CONFIG.minVisibleForTails) return NO_SPLIT;

    // Compute tail cutoffs
    const { low, high } = tailCutoffs(sorted, CONFIG.percentile.low, CONFIG.percentile.high);

    // No split if percentiles are the same
    if (low === high) return NO_SPLIT;

    return { low, high };
};
