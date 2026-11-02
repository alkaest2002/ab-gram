// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeGiniCoefficient } from "@/analysis/common/commonMetrics.js";
import {
  CONFIG,
  NO_SPLIT,
} from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants.js";
import { tailCutoffs } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/tailCutoffs.js";

// Inequality-driven: Gini decides WHETHER to split (shape recognition:
// bimodal / long-tail), the percentiles decide WHERE.
export const giniStrategy = ({ sorted }) => {
  const c = CONFIG.gini;
  if (sorted.length < Math.max(2, CONFIG.minVisibleForTails)) return NO_SPLIT;
  const ptp = sorted[sorted.length - 1] - sorted[0];
  // Bias-corrected sample Gini (* N/(N-1)): the population formula
  // underestimates inequality in the small groups typical of sociometry.
  const gini =
    computeGiniCoefficient(np.array(sorted)) *
    (sorted.length / (sorted.length - 1));

  const unequal =
    gini >= c.strong || (gini >= c.moderate && ptp >= c.minPtpForModerate);
  if (!unequal) return NO_SPLIT;

  const large = sorted.length >= c.minVisibleForOuter;
  return tailCutoffs(
    sorted,
    large ? c.outerLow : c.innerLow,
    large ? c.outerHigh : c.innerHigh,
  );
};
