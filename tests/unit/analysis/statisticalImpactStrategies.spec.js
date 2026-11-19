// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { binomialStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/binomialStrategy.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/percentileStrategy.js";
import { robustZScoreStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/robustZScoreStrategy.js";

// Direct finite probabilities provide an oracle independent of the log-space CDF.
const exactBinomialCutoffs = (n, p) => {
  const probabilities = Array.from({ length: n + 1 }, (_, k) => {
    let combinations = 1;
    for (let j = 1; j <= k; j++) combinations = (combinations * (n - j + 1)) / j;
    return combinations * p ** k * (1 - p) ** (n - k);
  });
  let low = -Infinity;
  let high = Infinity;
  for (let k = 0; k <= n; k++) {
    if (probabilities.slice(0, k + 1).reduce((a, b) => a + b, 0) <= 0.025) low = k;
    if (probabilities.slice(k).reduce((a, b) => a + b, 0) <= 0.025) {
      high = Math.min(high, k);
    }
  }
  return { low, high };
};

const binomialAtDensity = (size, p) =>
  binomialStrategy({ impact: np.array(Array(size).fill((size - 1) * p)) });

const visibleSplit = (strategy, values) => strategy({ impactVisibleSorted: np.array(values) });

describe("binomial statistical impact strategy", () => {
  it.each([0, 4, 36])("abstains outside eligibility at %i members", (size) => {
    expect(binomialAtDensity(size, 0.5)).toBe(NO_SPLIT);
  });

  it.each([5, 9, 20, 35])("matches exact two-sided tails at %i members", (size) => {
    for (const p of [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]) {
      expect(binomialAtDensity(size, p)).toEqual(exactBinomialCutoffs(size - 1, p));
    }
  });

  it.each([0, -0.1, 1, 1.1, NaN, Infinity])("abstains for invalid density %s", (p) => {
    expect(binomialAtDensity(9, p)).toBe(NO_SPLIT);
  });

  it("returns no significant tails in a small balanced group", () => {
    expect(binomialAtDensity(5, 0.5)).toEqual(NO_SPLIT);
  });

  it("returns theoretical count cutoffs, not observed values", () => {
    expect(binomialAtDensity(9, 0.5)).toEqual({ low: 0, high: 8 });
  });

  it("depends on the original group size and total rather than the distribution", () => {
    const impact = np.array([0, 0, 0, 0, 4, 8, 8, 8, 8]);
    expect(binomialStrategy({ impact })).toEqual(binomialAtDensity(9, 0.5));
    expect(binomialStrategy({ impact, impactVisibleSorted: np.array([4, 8, 8, 8, 8]) })).toEqual({
      low: 0,
      high: 8,
    });
  });

  it("switches each tail at the 2.5% probability boundary", () => {
    const critical = 0.025 ** (1 / 4);
    expect(binomialAtDensity(5, critical - 1e-8).high).toBe(4);
    expect(binomialAtDensity(5, critical + 1e-8).high).toBe(Infinity);
    expect(binomialAtDensity(5, 1 - critical - 1e-8).low).toBe(-Infinity);
    expect(binomialAtDensity(5, 1 - critical + 1e-8).low).toBe(0);
  });
});

describe("robust z-score statistical impact strategy", () => {
  it.each([0, 6, 36])("abstains outside eligibility at %i visible members", (size) => {
    expect(visibleSplit(robustZScoreStrategy, Array(size).fill(5))).toBe(NO_SPLIT);
  });

  it.each([
    ["both tails at the minimum size", [0, 9, 10, 10, 10, 11, 20], { low: 0, high: 20 }],
    ["only the low tail", [0, 9, 10, 10, 10, 11, 12], { low: 0, high: Infinity }],
    ["only the high tail", [8, 9, 10, 10, 10, 11, 20], { low: -Infinity, high: 20 }],
    ["constant positive values", Array(7).fill(5), NO_SPLIT],
    ["all zero values", Array(7).fill(0), NO_SPLIT],
    ["zero MAD with outliers", [0, 5, 5, 5, 5, 5, 10], { low: 0, high: 10 }],
    ["positive MAD scaled above the floor", [0, 10, 12, 12, 12, 14, 24], { low: 0, high: 24 }],
    ["even-sized median and MAD", [0, 4, 4, 5, 5, 6, 6, 10], { low: -Infinity, high: Infinity }],
    [
      "nearest outliers including ties",
      [0, 1, 1, ...Array(7).fill(5), 9, 9, 10],
      { low: 1, high: 9 },
    ],
    ["maximum eligible size", [0, ...Array(33).fill(5), 10], { low: 0, high: 10 }],
  ])("handles %s", (_name, values, expected) => {
    expect(visibleSplit(robustZScoreStrategy, values)).toEqual(expected);
  });

  it("excludes exact fence values while retaining values strictly beyond them", () => {
    const median = 10;
    const distance = 3.5 * 1.4826 * 0.5;
    const lowFence = median - distance;
    const highFence = median + distance;
    const values = [lowFence - 1, lowFence, ...Array(7).fill(median), highFence, highFence + 1];
    expect(visibleSplit(robustZScoreStrategy, values)).toEqual({
      low: lowFence - 1,
      high: highFence + 1,
    });
    expect(
      visibleSplit(robustZScoreStrategy, [lowFence, ...Array(5).fill(median), highFence]),
    ).toEqual(NO_SPLIT);
  });

  it("floors a nonzero MAD smaller than 0.5", () => {
    expect(visibleSplit(robustZScoreStrategy, [3, 4.75, 5, 5, 5, 5.25, 7])).toEqual(NO_SPLIT);
  });
});

describe("percentile statistical impact strategy", () => {
  it.each([0, 10, 19, 36])("abstains outside eligibility at %i visible members", (size) => {
    expect(visibleSplit(percentileStrategy, Array(size).fill(5))).toBe(NO_SPLIT);
  });

  it.each([
    [20, 1, 18],
    [21, 2, 18],
    [35, 3, 31],
  ])("uses mirrored nearest ranks for %i members", (size, low, high) => {
    expect(
      visibleSplit(
        percentileStrategy,
        Array.from({ length: size }, (_, i) => i),
      ),
    ).toEqual({
      low,
      high,
    });
  });

  it.each([
    ["low boundary tie", [0, 0, 0, ...Array(15).fill(5), 9, 10], { low: -Infinity, high: 9 }],
    ["high boundary tie", [0, 1, ...Array(15).fill(5), 9, 9, 9], { low: 1, high: Infinity }],
    ["both boundary ties", [0, 0, 0, ...Array(14).fill(5), 9, 9, 9], NO_SPLIT],
    ["constant values", Array(20).fill(3), NO_SPLIT],
    ["zero values", Array(20).fill(0), NO_SPLIT],
    ["ties contained within tails", [0, 0, ...Array(16).fill(5), 10, 10], { low: 0, high: 10 }],
  ])("handles %s without moving the rank boundary", (_name, values, expected) => {
    expect(visibleSplit(percentileStrategy, values)).toEqual(expected);
  });

  it("uses visible rather than original group size", () => {
    expect(
      percentileStrategy({ impactVisibleSorted: np.arange(20), impact: np.arange(36) }),
    ).toEqual({ low: 1, high: 18 });
  });

  it("uses observed values rather than interpolated percentile cutoffs", () => {
    expect(visibleSplit(percentileStrategy, [0, 2, 4, ...Array(14).fill(10), 16, 20, 30])).toEqual({
      low: 2,
      high: 20,
    });
  });
});
