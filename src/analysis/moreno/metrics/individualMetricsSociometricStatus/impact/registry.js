// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { jenksStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/jenksStrategy.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/percentileStrategy.js";
import { tukeyStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/tukeyStrategy.js";
import { binomialStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/binomialStrategy.js";

// A strategy that proposes no effective split abstains from the vote; the
// remaining strategies vote with equal weight, so the order here is only for
// readability and does not affect the outcome.
// Jenks carves the widest natural gaps; percentile reads
// relative standing; Tukey flags strict outliers beyond the inner fences;
// binomial (GB) flags only the extreme cases under the chance model.
export const IMPACT_STRATEGIES = [
  { name: "jenks", run: jenksStrategy },
  { name: "percentile", run: percentileStrategy },
  { name: "tukey", run: tukeyStrategy },
  { name: "binomial (GB)", run: binomialStrategy },
];
