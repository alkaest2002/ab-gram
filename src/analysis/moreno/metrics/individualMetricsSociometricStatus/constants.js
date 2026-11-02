// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// ============================================================================
// CONFIG
// ============================================================================
export const CONFIG = {
    impact: {
        // Each algorithm has its own minimum number of visible members required to
        // activate it: below that value the algorithm abstains. The small-group
        // strategy is the complement, so it activates only *below* its threshold.
        percentile: {
            minVisibleForEnablingAlgorithm: 8,
            low: 10,
            high: 90,
        },
        gini: {
            minVisibleForEnablingAlgorithm: 8,
            strong: 0.4,
            moderate: 0.3,
            minPtpForModerate: 3,
            // Once Gini says "unequal", tails are cut these percentiles.
            percentile: {
                low: 5,
                high: 95,
            },
        },
        jenks: {
            minVisibleForEnablingAlgorithm: 8,
            minGvf: 0.75, // goodness of variance fit: 1 - SDCM/SDAM
        },
        headTail: {
            minVisibleForEnablingAlgorithm: 8,
            maxHeadShare: 0.4, // keep splitting while the head is < 40% of the data
        },
        tukey: {
            minVisibleForEnablingAlgorithm: 8,
            k: 1.5 // mild outlier detection
        },
        binomial: {
            alpha: 0.01 // two-sided: alpha / 2 in each tail
        },
        smallGroup: {
            minVisibleForEnablingAlgorithm: 5,
            minGap: 2, // minimum jump in received opinions to count as a split
        },
    },
    balance: {
        lessLenientRatio: 2.0, // threshold at or below minOpinions
        moreLenientRatio: 1.5, // threshold at or above maxOpinions
        minOpinions: 3,
        maxOpinions: 15,
    },
};

// Thresholds convention: low-impact <=> value <= low, high-impact <=> value >= high.
// An infinite bound means "that side is never flagged".
export const NO_SPLIT = Object.freeze({ low: -Infinity, high: Infinity });

// ============================================================================
// SOCIOMETRIC STATUS CODES
// ============================================================================
export const SOCIOMETRIC_STATUS = Object.freeze({
    UNCLASSIFIED: 99, //  sociometric status not assignable
    ISOLATED: 0, //  no opinions received, none given
    IGNORED: 1, //  no opinions received, but gave opinions
    MARGINAL: 2, //  low impact
    APPRECIATED: 3, //  average impact, positive balance
    POPULAR: 4, //  high impact, positive balance
    DISLIKED: 5, //  average impact, negative balance
    REJECTED: 6, //  high impact, negative balance
    AMBIVALENT: 7, //  average impact, neutral balance
    CONTROVERSIAL: 8, //  high impact, neutral balance
});
