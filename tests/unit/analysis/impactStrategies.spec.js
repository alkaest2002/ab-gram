// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { binomialStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/binomialStrategy.js";
import { headTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/headTailStrategy.js";
import { invertedHeadTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/invertedHeadTailStrategy.js";
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
    ["inverted head/tail", invertedHeadTailStrategy, 4, 35],
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

describe("Tukey strategy", () => {
  it.each([
    ["isolates both tails", [0, 4, 5, 5, 5, 6, 10], { low: 0, high: 10 }],
    ["excludes values on the fences", [2, 4, 5, 5, 5, 6, 8], { low: -Infinity, high: Infinity }],
    ["isolates only the low tail", [0, 4, 5, 5, 5, 6, 8], { low: 0, high: Infinity }],
    ["isolates only the high tail", [2, 4, 5, 5, 5, 6, 10], { low: -Infinity, high: 10 }],
    [
      "excludes fence values alongside outliers",
      [0, 2, 4, 4, 5, 5, 5, 6, 6, 8, 10],
      { low: 0, high: 10 },
    ],
    [
      "uses the nearest outlier in each tail",
      [0, 1, 4, 4, 5, 5, 5, 6, 6, 9, 10],
      { low: 1, high: 9 },
    ],
    ["handles an even-sized group", [0, 4, 5, 5, 5, 5, 6, 10], { low: 0, high: 10 }],
    [
      "remains eligible at 35 members",
      [0, ...Array(16).fill(4), 5, ...Array(16).fill(6), 10],
      { low: 0, high: 10 },
    ],
  ])("%s", (_name, values, expected) => {
    expect(tukeyStrategy({ impactVisibleSorted: np.array(values) })).toEqual(expected);
  });

  it.each([
    ["constant values", [3, 3, 3, 3, 3, 3, 3]],
    ["nonconstant values", [0, 5, 5, 5, 5, 5, 10]],
  ])("abstains when the interquartile range is zero for %s", (_name, values) => {
    expect(tukeyStrategy({ impactVisibleSorted: np.array(values) })).toBe(NO_SPLIT);
  });
});

describe("inverted head/tail strategy", () => {
  it("isolates a sparse low tail and abstains on the high cutoff", () => {
    const impactVisibleSorted = np.array([1, 8, 9, 10, 11]);

    expect(invertedHeadTailStrategy({ impactVisibleSorted })).toEqual({
      low: 1,
      high: Infinity,
    });
  });

  it("mirrors head/tail classification across a reflected distribution", () => {
    const ascending = np.array([1, 2, 3, 4, 11]);
    const reflected = np.array([-11, -4, -3, -2, -1]);
    const highSplit = headTailStrategy({ impactVisibleSorted: ascending });
    const lowSplit = invertedHeadTailStrategy({ impactVisibleSorted: reflected });

    expect(lowSplit).toEqual({ low: -highSplit.high, high: Infinity });
  });

  it("abstains when all impacts are equal", () => {
    const impactVisibleSorted = np.array([3, 3, 3, 3]);

    expect(invertedHeadTailStrategy({ impactVisibleSorted })).toBe(NO_SPLIT);
  });
});
