// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { jenksStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/jenksStrategy.js";
import { headTailStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/headTailStrategy.js";
import { giniStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/giniStrategy.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/percentileStrategy.js";
import { tukeyStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/tukeyStrategy.js";
import { binomialStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/binomialStrategy.js";
import { smallGroupStrategy } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/impact/strategies/smallGroupStrategy.js";

// A strategy that proposes no effective split abstains from the vote; the
// remaining strategies vote with equal weight, so the order here is only for
// readability and does not affect the outcome.
// Jenks carves the widest natural gaps; head/tail isolates the heavy-tailed
// high extreme; Gini recognises distributional shape and cuts at deciles;
// percentile reads relative standing; Tukey flags strict outliers beyond the
// inner fences; binomial (GB) flags only the extreme cases under the chance
// model. Small-group finds the dominant gap in tiny (sub-5) groups.
export const IMPACT_STRATEGIES = [
  { name: "jenks", run: jenksStrategy },
  { name: "head/tail", run: headTailStrategy },
  { name: "gini", run: giniStrategy },
  { name: "percentile", run: percentileStrategy },
  { name: "tukey", run: tukeyStrategy },
  { name: "binomial (GB)", run: binomialStrategy },
  { name: "small group", run: smallGroupStrategy },
];
