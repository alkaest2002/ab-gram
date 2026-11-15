// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

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
