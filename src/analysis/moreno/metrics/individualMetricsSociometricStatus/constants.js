// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// ============================================================================
// CONFIG
// ============================================================================
export const CONFIG = {
  // A tail is only "clear" with enough visible members to tell it from noise.
  // Below this, the percentile and Jenks strategies abstain.
  minVisibleForTails: 5,
  // 20/80: percentile only flags the clear tails of the distribution.
  percentile: { low: 20, high: 80 },
  gini: {
    strong: 0.3,
    moderate: 0.2,
    minPtpForModerate: 3,
    // Once Gini says "unequal", tails are cut at the quartiles in ordinary
    // groups and at the outer deciles in large ones. Never at the median:
    // that would flag nearly every member not tied with it.
    innerLow: 25,
    innerHigh: 75,
    outerLow: 10,
    outerHigh: 90,
    minVisibleForOuter: 20,
  },
  jenks: { minGvf: 0.75 }, // goodness of variance fit: 1 - SDCM/SDAM
  tukey: { k: 1.5 }, // fences: Q1 - k*IQR, Q3 + k*IQR (strict: beyond, not at)
  binomial: { alpha: 0.05 }, // two-sided: alpha / 2 in each tail
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

/**
 * Status codes (9 categories).
 */
export const SOCIOMETRIC_STATUS = Object.freeze({
  UNCLASSIFIED: 99,  //  sociometric status not assignable
  ISOLATED: 0,       //  no opinions received, none given
  IGNORED: 1,        //  no opinions received, but gave opinions
  MARGINAL: 2,       //  low impact
  APPRECIATED: 3,    //  average impact, positive balance
  POPULAR: 4,        //  high impact, positive balance
  DISLIKED: 5,       //  average impact, negative balance
  REJECTED: 6,       //  high impact, negative balance
  AMBIVALENT: 7,     //  average impact, neutral balance
  CONTROVERSIAL: 8,  //  high impact, neutral balance
});
