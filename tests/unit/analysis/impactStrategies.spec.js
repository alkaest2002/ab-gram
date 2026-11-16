// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { binomialStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/binomialStrategy.js";
import { headTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/headTailStrategy.js";
import { jenksStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/jenksStrategy.js";
import { largestGapStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/largestGapStrategy.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/percentileStrategy.js";
import { robustZScoreStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/robustZScoreStrategy.js";
import { smallGroupStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/smallGroupStrategy.js";
import { tukeyStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/tukeyStrategy.js";

const contextWithSize = (size) => {
  const values = np.arange(size);
  return { impact: values, impactVisibleSorted: values };
};

describe("impact strategy member ranges", () => {
  const cases = [
    ["small group", smallGroupStrategy, 4, 4],
    ["largest gap", largestGapStrategy, 4, 6],
    ["Jenks", jenksStrategy, 4, 35],
    ["head/tail", headTailStrategy, 4, 35],
    ["percentile", percentileStrategy, 10, 35],
    ["Tukey", tukeyStrategy, 7, 35],
    ["robust z-score", robustZScoreStrategy, 7, 35],
    ["binomial", binomialStrategy, 5, 35],
  ];

  it.each(cases)("makes %s abstain outside %i..%i members", (_name, run, min, max) => {
    expect(run(contextWithSize(min - 1))).toBe(NO_SPLIT);
    expect(run(contextWithSize(max + 1))).toBe(NO_SPLIT);
  });
});
