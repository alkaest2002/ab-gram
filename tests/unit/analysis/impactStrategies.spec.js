// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it, vi } from "vite-plus/test";
import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { headTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/headTailStrategy.js";
import { invertedHeadTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/invertedHeadTailStrategy.js";
import { jenksStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/jenksStrategy.js";
import { largestGapStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/largestGapStrategy.js";
import { majorityBaselineStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/majorityBaselineStrategy.js";
import { classifyImpactByVote } from "@/analysis/moreno/metrics/sociometricStatus/impact/classify.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/percentileStrategy.js";
import { robustZScoreStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/robustZScoreStrategy.js";
import { smallGroupStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/smallGroupStrategy.js";
import { tukeyStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/tukeyStrategy.js";

import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

vi.mock("@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js", { spy: true });

const contextWithSize = (size) => {
  const values = np.arange(size);
  return { impact: values, impactVisibleSorted: values };
};

describe("impact strategy member ranges", () => {
  const cases = [
    ["small group", smallGroupStrategy, 4, 6],
    ["largest gap", largestGapStrategy, 4, 6],
    ["Jenks", jenksStrategy, 7, 35],
    ["head/tail", headTailStrategy, 7, 35],
    ["inverted head/tail", invertedHeadTailStrategy, 7, 35],
    ["percentile", percentileStrategy, 15, 35],
    ["Tukey", tukeyStrategy, 15, 35],
    ["robust z-score", robustZScoreStrategy, 15, 35],
  ];

  it.each(cases)("makes %s abstain outside its supported member range", (_name, run, min, max) => {
    expect(run(contextWithSize(min - 1))).toBe(NO_SPLIT);
    expect(run(contextWithSize(max + 1))).toBe(NO_SPLIT);
  });
});

describe("majority baseline strategy", () => {
  it.each([
    ["three members", [0, 3, 3]],
    ["seven members", [0, 3, 3, 3, 3, 3, 8]],
    ["a plurality of exactly half", [0, 3, 3, 3, 7, 8]],
    ["distinct scores", [0, 2, 4, 6, 8]],
    ["no qualifying tail", [1.001, 3, 3, 3, 4.999]],
  ])("abstains for %s", (_name, values) => {
    expect(majorityBaselineStrategy({ impactVisibleSorted: np.array(values) })).toBe(NO_SPLIT);
  });

  it.each([
    [[1, 1, 3, 3, 3, 3], { low: 1, high: Infinity }],
    [[3, 3, 3, 3, 5, 5], { low: -Infinity, high: 5 }],
    [[0, 2, 2, 2], { low: 0, high: Infinity }],
    [[0, 3, 3, 3, 5], { low: 0, high: 5 }],
    [[3, 3, 3, 3, 5, 9], { low: -Infinity, high: 5 }],
    [[1, 2, 3, 3, 3, 3], { low: 1, high: Infinity }],
  ])("returns inclusive observed cutoffs for %j", (values, expected) => {
    expect(majorityBaselineStrategy({ impactVisibleSorted: np.array(values) })).toEqual(expected);
  });

  it("passes the inclusive tail indices to the shared finalizer", () => {
    const impactVisibleSorted = np.array([1, 4, 4, 4, 6]);
    majorityBaselineStrategy({ impactVisibleSorted });
    expect(finalizeSplit).toHaveBeenLastCalledWith(impactVisibleSorted, 0, 4);
  });

  it("reports both majority-baseline cutoffs in the committee vote", () => {
    const impact = np.array([0, 3, 3, 3, 5]);
    const result = classifyImpactByVote(impact, impact);
    expect(Array.from(result.isLowImpact.astype("int32").data)).toEqual([1, 0, 0, 0, 0]);
    expect(Array.from(result.isHighImpact.astype("int32").data)).toEqual([0, 0, 0, 0, 1]);
    expect(result.impactThresholds).toContainEqual({
      strategy: "majority baseline",
      thresholds: { low: 0, high: 5 },
    });
  });
});

describe("Tukey strategy", () => {
  // These middle values hold the quartiles at 4 and 6 when the endpoints change.
  const center = [4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6];
  it.each([
    ["isolates both tails at 15 members", [0, ...center, 10], { low: 0, high: 10 }],
    ["excludes values on the fences", [2, ...center, 8], { low: -Infinity, high: Infinity }],
    ["isolates only the low tail", [0, ...center, 8], { low: 0, high: Infinity }],
    ["isolates only the high tail", [2, ...center, 10], { low: -Infinity, high: 10 }],
    ["excludes fence values alongside outliers", [0, 2, ...center, 8, 10], { low: 0, high: 10 }],
    ["uses the nearest outlier in each tail", [0, 1, ...center, 9, 10], { low: 1, high: 9 }],
    ["handles an even-sized group", [0, 4, ...center, 10], { low: 0, high: 10 }],
    [
      "remains eligible at 35 members",
      [0, ...Array(16).fill(4), 5, ...Array(16).fill(6), 10],
      { low: 0, high: 10 },
    ],
  ])("%s", (_name, values, expected) => {
    expect(tukeyStrategy({ impactVisibleSorted: np.array(values) })).toEqual(expected);
  });

  it.each([
    ["constant values", Array(15).fill(3)],
    ["nonconstant values", [0, ...Array(13).fill(5), 10]],
  ])("abstains when the interquartile range is zero for %s", (_name, values) => {
    expect(tukeyStrategy({ impactVisibleSorted: np.array(values) })).toBe(NO_SPLIT);
  });
});

describe("inverted head/tail strategy", () => {
  it("isolates a sparse low tail and abstains on the high cutoff", () => {
    const impactVisibleSorted = np.array([1, 8, 9, 9, 10, 10, 11]);

    expect(invertedHeadTailStrategy({ impactVisibleSorted })).toEqual({
      low: 1,
      high: Infinity,
    });
  });

  it("mirrors head/tail classification across a reflected distribution", () => {
    const ascending = np.array([1, 2, 2, 3, 3, 4, 11]);
    const reflected = np.array([-11, -4, -3, -3, -2, -2, -1]);
    const highSplit = headTailStrategy({ impactVisibleSorted: ascending });
    const lowSplit = invertedHeadTailStrategy({ impactVisibleSorted: reflected });

    expect(highSplit).toEqual({ low: -Infinity, high: 11 });
    expect(lowSplit).toEqual({ low: -highSplit.high, high: Infinity });
  });

  it("abstains when all impacts are equal", () => {
    const impactVisibleSorted = np.array([3, 3, 3, 3, 3, 3, 3]);

    expect(invertedHeadTailStrategy({ impactVisibleSorted })).toBe(NO_SPLIT);
  });
});
