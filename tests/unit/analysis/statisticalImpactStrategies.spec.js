// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { percentileStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/percentileStrategy.js";
import { robustZScoreStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/robustZScoreStrategy.js";

// Direct finite probabilities provide an oracle independent of the log-space CDF.
const visibleSplit = (strategy, values) => strategy({ impactVisibleSorted: np.array(values) });

describe("robust z-score statistical impact strategy", () => {
  it.each([0, 14, 36])("abstains outside eligibility at %i visible members", (size) => {
    expect(
      visibleSplit(
        robustZScoreStrategy,
        Array.from({ length: size }, (_, i) => i),
      ),
    ).toBe(NO_SPLIT);
  });

  it.each([
    ["both tails at the minimum size", [0, 9, ...Array(11).fill(10), 11, 20], { low: 0, high: 20 }],
    ["only the low tail", [0, 9, ...Array(11).fill(10), 11, 12], { low: 0, high: Infinity }],
    ["only the high tail", [8, 9, ...Array(11).fill(10), 11, 20], { low: -Infinity, high: 20 }],
    ["constant positive values", Array(15).fill(5), NO_SPLIT],
    ["all zero values", Array(15).fill(0), NO_SPLIT],
    ["zero MAD with outliers", [0, ...Array(13).fill(5), 10], { low: 0, high: 10 }],
    [
      "positive MAD scaled above the floor",
      [0, ...Array(6).fill(10), 12, ...Array(6).fill(14), 24],
      { low: 0, high: 24 },
    ],
    [
      "even-sized median and MAD",
      [0, ...Array(6).fill(4), 5, 5, ...Array(6).fill(6), 10],
      { low: -Infinity, high: Infinity },
    ],
    [
      "nearest outliers including ties",
      [0, 1, 1, ...Array(9).fill(5), 9, 9, 10],
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
    const values = [lowFence - 1, lowFence, ...Array(11).fill(median), highFence, highFence + 1];
    expect(visibleSplit(robustZScoreStrategy, values)).toEqual({
      low: lowFence - 1,
      high: highFence + 1,
    });
    expect(
      visibleSplit(robustZScoreStrategy, [lowFence, ...Array(13).fill(median), highFence]),
    ).toEqual(NO_SPLIT);
  });

  it("floors a nonzero MAD smaller than 0.5", () => {
    expect(
      visibleSplit(robustZScoreStrategy, [3, ...Array(6).fill(4.75), 5, ...Array(6).fill(5.25), 7]),
    ).toEqual(NO_SPLIT);
  });
});

describe("percentile statistical impact strategy", () => {
  it.each([0, 10, 14, 36])("abstains outside eligibility at %i visible members", (size) => {
    expect(visibleSplit(percentileStrategy, Array(size).fill(5))).toBe(NO_SPLIT);
  });

  it.each([
    [15, 2, 12],
    [20, 2, 17],
    [21, 3, 17],
    [35, 5, 29],
  ])("uses mirrored 15th/85th percentile nearest ranks for %i members", (size, low, high) => {
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
    ["low boundary tie", [0, 0, 0, 0, ...Array(13).fill(5), 8, 9, 10], { low: -Infinity, high: 8 }],
    ["high boundary tie", [0, 1, 2, ...Array(13).fill(5), 9, 9, 9, 9], { low: 2, high: Infinity }],
    ["both boundary ties", [0, 0, 0, 0, ...Array(12).fill(5), 9, 9, 9, 9], NO_SPLIT],
    ["constant values", Array(20).fill(3), NO_SPLIT],
    ["zero values", Array(20).fill(0), NO_SPLIT],
    [
      "ties contained within tails",
      [0, 0, 0, ...Array(14).fill(5), 10, 10, 10],
      { low: 0, high: 10 },
    ],
  ])("handles %s without moving the rank boundary", (_name, values, expected) => {
    expect(visibleSplit(percentileStrategy, values)).toEqual(expected);
  });

  it("uses visible rather than original group size", () => {
    expect(
      percentileStrategy({ impactVisibleSorted: np.arange(20), impact: np.arange(36) }),
    ).toEqual({ low: 2, high: 17 });
  });

  it("uses observed values rather than interpolated percentile cutoffs", () => {
    expect(visibleSplit(percentileStrategy, [0, 2, 4, ...Array(14).fill(10), 16, 20, 30])).toEqual({
      low: 4,
      high: 16,
    });
  });
});
