// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { CONFIG } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";

// ============================================================================
// BALANCE CLASSIFICATION (dynamic ratio threshold)
// Fewer opinions received -> less certain -> require a stronger ratio.
// threshold(n) = LESS + (MORE - LESS) * clamp((n - minN) / (maxN - minN), 0, 1)
// ============================================================================
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
  const b = CONFIG.balance;
  const ratioSpan = b.moreLenientRatio - b.lessLenientRatio;
  const opinionSpan = b.maxOpinions - b.minOpinions;

  const clampedOffset = np.minimum(
    np.maximum(impact.subtract(b.minOpinions), 0),
    opinionSpan,
  );
  const dynamicThreshold = clampedOffset
    .divide(opinionSpan)
    .multiply(ratioSpan)
    .add(b.lessLenientRatio);

  const isPositiveBalance = rp.greater(rr.multiply(dynamicThreshold));
  const isNegativeBalance = rr.greater(rp.multiply(dynamicThreshold));
  const isNeutralBalance = isPositiveBalance
    .logical_or(isNegativeBalance)
    .logical_not();
  return { isPositiveBalance, isNegativeBalance, isNeutralBalance };
};
