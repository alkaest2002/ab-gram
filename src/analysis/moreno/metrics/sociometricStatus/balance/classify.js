// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// ============================================================================
// BALANCE CLASSIFICATION (dynamic ratio threshold)
// Fewer opinions received -> less certain -> require a stronger ratio.
// threshold(n) = LESS_LENIENT_RATIO + (MORE_LENIENT_RATIO - LESS_LENIENT_RATIO)
//   * clamp((n - MIN_OPINIONS) / (MAX_OPINIONS - MIN_OPINIONS), 0, 1)
// ============================================================================
const LESS_LENIENT_RATIO = 2.0; // threshold at or below MIN_OPINIONS
const MORE_LENIENT_RATIO = 1.5; // threshold at or above MAX_OPINIONS
const MIN_OPINIONS = 3;
const MAX_OPINIONS = 15;

/**
 * Classify each member's balance (positive / negative / neutral) using a
 * dynamic ratio threshold that becomes stricter with fewer opinions received.
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @returns {{
 *   isPositiveBalance: import("numpy-ts").NDArray,
 *   isNegativeBalance: import("numpy-ts").NDArray,
 *   isNeutralBalance: import("numpy-ts").NDArray,
 * }}
 */
export const classifyBalance = (rp, rr, impact) => {
  // Threshold slope and domain width. ratioSpan is negative, so the threshold
  // *decreases* (becomes more lenient) as the number of opinions grows.
  const ratioSpan = MORE_LENIENT_RATIO - LESS_LENIENT_RATIO;
  const opinionSpan = MAX_OPINIONS - MIN_OPINIONS;

  // Position of each member's opinion count within [MIN_OPINIONS, MAX_OPINIONS],
  // clamped to that range so values outside it saturate instead of extrapolating.
  // Equivalent to clamp(n - MIN_OPINIONS, 0, opinionSpan).
  const clampedOffset = impact.subtract(MIN_OPINIONS).clip(0, opinionSpan);

  // Map the clamped offset to the threshold range:
  //   (offset / opinionSpan)  ->  fraction of the way across the domain [0, 1]
  //   * ratioSpan             ->  scale that fraction to the threshold slope
  //   + LESS_LENIENT_RATIO    ->  shift so the threshold runs from 2.0 down to 1.5
  const dynamicThreshold = clampedOffset
    .divide(opinionSpan)
    .multiply(ratioSpan)
    .add(LESS_LENIENT_RATIO);

  // A member is positively balanced when their positive nominations exceed their
  // negative nominations scaled by the threshold (and vice versa for negative).
  const isPositiveBalance = rp.greater(rr.multiply(dynamicThreshold));
  const isNegativeBalance = rr.greater(rp.multiply(dynamicThreshold));
  // Neutral covers everything that is neither clearly positive nor negative.
  const isNeutralBalance = isPositiveBalance.logical_or(isNegativeBalance).logical_not();
  return { isPositiveBalance, isNegativeBalance, isNeutralBalance };
};
