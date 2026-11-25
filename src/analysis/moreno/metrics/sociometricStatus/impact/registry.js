// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { jenksStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/jenksStrategy.js";
import { largestGapStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/largestGapStrategy.js";
import { headTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/headTailStrategy.js";
import { invertedHeadTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/invertedHeadTailStrategy.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/percentileStrategy.js";
import { tukeyStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/tukeyStrategy.js";
import { robustZScoreStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/robustZScoreStrategy.js";
import { smallGroupStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/smallGroupStrategy.js";

export const IMPACT_STRATEGIES = [
  { name: "jenks", run: jenksStrategy },
  { name: "largest gap", run: largestGapStrategy },
  { name: "head/tail", run: headTailStrategy },
  { name: "inverted head/tail", run: invertedHeadTailStrategy },
  { name: "percentile", run: percentileStrategy },
  { name: "tukey", run: tukeyStrategy },
  { name: "robust z-score", run: robustZScoreStrategy },
  { name: "small group", run: smallGroupStrategy },
];
