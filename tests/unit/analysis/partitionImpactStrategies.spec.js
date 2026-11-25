// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import * as np from "numpy-ts";

import { classifyImpactByVote } from "@/analysis/moreno/metrics/sociometricStatus/impact/classify.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";
import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { jenksStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/jenksStrategy.js";
import { largestGapStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/largestGapStrategy.js";
import { smallGroupStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/smallGroupStrategy.js";

const split = (strategy, values) => strategy({ impactVisibleSorted: np.array(values) });

// Enumerate partitions and sum centered residuals, independently of the DP's
// prefix-sum SSE. Accept all equal-cost optima: floating-point arithmetic
// can resolve mathematically equal costs differently from centered residuals.
const exhaustiveJenks = (values) => {
  const sse = (group) => {
    const mean = group.reduce((sum, value) => sum + value, 0) / group.length;
    return group.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  };
  const distinctCount = new Set(values).size;
  if (distinctCount < 3) return [NO_SPLIT];
  const k = distinctCount >= 5 ? 5 : 3;
  let best = Infinity;
  let breaks = [];
  const visit = (starts, start, cost) => {
    const remaining = k - starts.length - 1;
    if (remaining > 0) {
      for (let end = start + 1; end <= values.length - remaining; end++) {
        if (values[end - 1] === values[end]) continue;
        visit([...starts, end], end, cost + sse(values.slice(start, end)));
      }
      return;
    }
    const total = cost + sse(values.slice(start));
    const outer = [starts[0], start];
    if (total < best - 1e-10) {
      best = total;
      breaks = [outer];
    } else if (Math.abs(total - best) < 1e-10) {
      breaks.push(outer);
    }
  };
  visit([], 0, 0);
  if (1 - best / sse(values) < 0.75) return [NO_SPLIT];
  return breaks.map(([middle, high]) => {
    const centerSize = high - middle;
    const low = values[middle - 1];
    const upper = values[high];
    if (centerSize > Math.max(middle, values.length - high)) return { low, high: upper };

    // Score the resulting two bands directly, excluding non-majority centers.
    const score = (cut) => sse(values.slice(0, cut)) + sse(values.slice(cut));
    const absorbLow = high > values.length - high ? score(high) : Infinity;
    const absorbHigh = values.length - middle > middle ? score(middle) : Infinity;
    if (absorbLow < absorbHigh - 1e-10) return { low: -Infinity, high: upper };
    if (absorbHigh < absorbLow - 1e-10) return { low, high: Infinity };
    return NO_SPLIT;
  });
};

describe("partition center dominance", () => {
  it.each([
    [[], -Infinity, Infinity],
    [[3], 0, Infinity],
    [[2, 2, 2, 2], 0, 3],
    [[0, 0, 0, 9, 9, 9], 1, 4],
    [[0, 1, 2, 3], 1, Infinity],
    [[0, 1, 2, 3], -Infinity, 2],
    [[0.1, 0.2, 0.3], 0, 2],
  ])("returns the shared sentinel when no cutoff wins: %j", (values, lowEnd, highStart) => {
    expect(finalizeSplit(np.array(values), lowEnd, highStart)).toBe(NO_SPLIT);
  });

  it.each([
    [[0, 0, 0, 4, 9, 9], { low: -Infinity, high: 9 }],
    [[0, 0, 4, 9, 9, 9], { low: 0, high: Infinity }],
    [[0, 0, 4, 4, 9, 9], { low: -Infinity, high: 9 }],
    [[0, 0, 0, 9, 9, 9], NO_SPLIT],
  ])("counts members after removing tied boundaries: %j", (values, expected) => {
    expect(finalizeSplit(np.array(values), 1, 4)).toEqual(expected);
  });

  it.each([
    ["dominant center keeps both tails", [0, 2, 3, 8], 0, 3, { low: 0, high: 8 }],
    ["cheaper high merge", [0, 0, 6, 6, 9, 9], 1, 4, { low: 0, high: Infinity }],
    [
      "Ward weights outweigh mean distance",
      [0, 0, 0, 4, 4, 8.25, 8.25],
      2,
      5,
      { low: 0, high: Infinity },
    ],
    ["only low merge is valid", [0, 0, 8, 9], 1, 3, { low: -Infinity, high: 9 }],
    ["only high merge is valid", [0, 1, 9, 9], 0, 2, { low: 0, high: Infinity }],
    ["equal Ward costs abstain", [0, 0, 4, 4, 8, 8], 1, 4, NO_SPLIT],
    ["neither merge has a majority", [0, 0, 8, 8], 1, 2, NO_SPLIT],
  ])("%s", (_name, values, lowEnd, highStart, expected) => {
    expect(finalizeSplit(np.array(values), lowEnd, highStart)).toEqual(expected);
  });
});

describe("impact strategy eligibility", () => {
  it.each([
    ["Jenks", jenksStrategy, 7, 35],
    ["largest gap", largestGapStrategy, 4, 6],
    ["small group", smallGroupStrategy, 4, 6],
  ])("makes %s abstain outside the visible-member range", (_name, strategy, min, max) => {
    for (const size of [0, 1, min - 1, max + 1]) {
      const impactVisibleSorted = np.arange(size);
      expect(strategy({ impactVisibleSorted, impact: np.arange(4) })).toBe(NO_SPLIT);
    }
  });

  it.each([
    ["Jenks minimum", jenksStrategy, [0, 0, 5, 5, 5, 10, 10], { low: 0, high: 10 }],
    [
      "Jenks maximum",
      jenksStrategy,
      [...Array(11).fill(0), ...Array(13).fill(5), ...Array(11).fill(10)],
      { low: 0, high: 10 },
    ],
    ["largest gap minimum", largestGapStrategy, [0, 5, 5, 10], { low: 0, high: 10 }],
    ["largest gap maximum", largestGapStrategy, [0, 0, 5, 5, 5, 10], { low: 0, high: 10 }],
    ["small group minimum", smallGroupStrategy, [0, 5, 5, 5], { low: 0, high: Infinity }],
    ["small group maximum", smallGroupStrategy, [0, 0, 5, 5, 5, 5], { low: 0, high: Infinity }],
  ])("accepts %s using visible rather than original size", (_name, strategy, values, expected) => {
    expect(strategy({ impactVisibleSorted: np.array(values), impact: np.arange(36) })).toEqual(
      expected,
    );
  });
});

describe("Jenks partition strategy", () => {
  it.each([
    ["all zeros", Array(7).fill(0)],
    ["constant positives", Array(7).fill(5)],
    ["two distinct values", [0, 0, 0, 8, 8, 8, 8]],
    ["two distinct values at maximum size", [...Array(17).fill(0), ...Array(18).fill(8)]],
  ])("abstains for %s", (_name, values) => {
    expect(split(jenksStrategy, values)).toBe(NO_SPLIT);
  });

  it.each([
    ["fallback with three distinct values", [0, 0, 3, 3, 3, 8, 8], { low: 0, high: 8 }],
    ["fallback with four distinct values", [0, 0, 3, 3, 4, 8, 8], { low: 0, high: 8 }],
    ["merge the middle three clusters", [0, 0, 2, 4, 6, 8, 8], { low: 0, high: 8 }],
    ["equal-cost optima keep earlier splits", [0, 1, 2, 3, 4, 5, 6], { low: 0, high: 5 }],
    ["broader high wins a conflict with broader low", [0, 1, 2, 2, 3, 4, 5], { low: 0, high: 4 }],
    [
      "variance optimum differs from the two largest gaps",
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      { low: 0, high: 7 },
    ],
  ])("handles %s", (_name, values, expected) => {
    expect(split(jenksStrategy, values)).toEqual(expected);
  });

  it("prefers the broader high class on a numerical tie, making both 9s high in the vote", () => {
    const values = [2, 3, 5, 5, 5, 6, 7, 8, 9, 9, 10];
    expect(split(jenksStrategy, values)).toEqual({ low: 3, high: 9 });
    const impact = np.array(values);
    const { isHighImpact } = classifyImpactByVote(impact, impact);
    expect(Array.from(isHighImpact.tolist(), Boolean).slice(8, 10)).toEqual([true, true]);
  });

  it("keeps a singleton high class when it fits better", () => {
    expect(split(jenksStrategy, [2, 3, 5, 5, 5, 6, 7, 8, 9, 9, 20]).high).toBe(20);
  });

  it("matches exhaustive partitions across small sorted integer distributions", () => {
    const visit = (values, size, minimum) => {
      if (values.length === size) {
        expect(exhaustiveJenks(values), JSON.stringify(values)).toContainEqual(
          split(jenksStrategy, values),
        );
        return;
      }
      for (let value = minimum; value <= 5; value++) visit([...values, value], size, value);
    };
    for (const size of [7, 8, 9]) visit([], size, 0);
  });
});

describe("largest-gap partition strategy", () => {
  it.each([
    ["all zeros", [0, 0, 0, 0], NO_SPLIT],
    ["constant positives", [3, 3, 3, 3], NO_SPLIT],
    ["widest gap occurs after the second widest", [0, 3, 4, 10], { low: 0, high: 10 }],
    ["widest gap occurs before the second widest", [0, 6, 7, 10], { low: 0, high: 10 }],
    ["adjacent selected gaps require absorbing low", [0, 1, 6, 10], { low: -Infinity, high: 10 }],
    ["equal gaps leave the two boundaries ambiguous", [0, 2, 4, 6, 8, 10], NO_SPLIT],
    ["a runner-up tie with equally sized sides abstains", [0, 2, 7, 9], NO_SPLIT],
    ["a zero runner-up isolates the high member", [0, 0, 0, 5], { low: -Infinity, high: 5 }],
    ["a zero runner-up isolates the low member", [0, 5, 5, 5], { low: 0, high: Infinity }],
    ["a tied runner-up leaves two low members", [0, 1, 6, 7, 8], { low: 1, high: Infinity }],
    ["a tied runner-up leaves two high members", [0, 1, 2, 7, 8], { low: -Infinity, high: 7 }],
    ["a unique pair of equally largest gaps is allowed", [0, 4, 5, 9], { low: 0, high: 9 }],
    ["tied smaller unselected gaps are allowed", [0, 1, 5, 5, 6, 11], { low: 1, high: 11 }],
    [
      "a just larger earlier runner-up is unambiguous",
      [0, 2.0001, 2.0001, 2.0001, 7, 9],
      { low: 0, high: 7 },
    ],
    [
      "a just larger later runner-up is unambiguous",
      [0, 2, 7, 7, 7, 9.0001],
      { low: 2, high: 9.0001 },
    ],
    ["equal band sizes favor the cheaper merge", [0, 0, 4, 4, 9, 9], { low: -Infinity, high: 9 }],
    [
      "equal positive fractional gaps leave the boundaries ambiguous",
      [0, 0.25, 0.5, 0.75],
      NO_SPLIT,
    ],
  ])("handles %s", (_name, values, expected) => {
    expect(split(largestGapStrategy, values)).toEqual(expected);
  });
});

describe("small-group partition strategy", () => {
  it.each([
    ["all zeros", [0, 0, 0, 0], NO_SPLIT],
    ["constant positives", [4, 4, 4, 4], NO_SPLIT],
    ["five-member low minority", [0, 4, 4, 5, 6], { low: 0, high: Infinity }],
    ["five-member high minority", [0, 1, 2, 6, 6], { low: -Infinity, high: 6 }],
    ["six-member low minority", [0, 0, 4, 4, 5, 6], { low: 0, high: Infinity }],
    ["six-member high minority", [0, 1, 2, 2, 6, 6], { low: -Infinity, high: 6 }],
    ["six-member equal sides", [0, 0, 1, 5, 6, 6], NO_SPLIT],
    ["only the smaller low side", [0, 4, 5, 6], { low: 0, high: Infinity }],
    ["only the smaller high side", [0, 1, 2, 6], { low: -Infinity, high: 6 }],
    ["equal-size sides leave no center", [0, 1, 5, 6], NO_SPLIT],
    ["minimum gap exactly two", [0, 2, 2, 2], { low: 0, high: Infinity }],
    ["minimum gap just below two", [0, 1.999, 1.999, 1.999], NO_SPLIT],
    [
      "runner-up factor exactly 1.5 without spread dominance",
      [0, 3, 5, 7],
      { low: 0, high: Infinity },
    ],
    [
      "runner-up factor just below 1.5 without spread dominance",
      [0, 2.999, 4.999, 6.999],
      NO_SPLIT,
    ],
    [
      "spread factor exactly 0.5 without runner-up dominance",
      [0, 3, 6, 6],
      { low: 0, high: Infinity },
    ],
    ["spread factor just below 0.5 without runner-up dominance", [0, 3, 6, 6.001], NO_SPLIT],
    ["neither dominance condition", [0, 2, 4, 6], NO_SPLIT],
    ["first maximum wins a tie", [0, 2, 2, 4], { low: 0, high: Infinity }],
    ["first maximum at center leaves no average members", [0, 0, 2, 4], NO_SPLIT],
    ["equal values remain on their selected side", [0, 0, 4, 4], NO_SPLIT],
  ])("handles %s", (_name, values, expected) => {
    expect(split(smallGroupStrategy, values)).toEqual(expected);
  });
});
