// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vite-plus/test";
import * as np from "numpy-ts";

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { headTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/headTailStrategy.js";
import { invertedHeadTailStrategy } from "@/analysis/moreno/metrics/sociometricStatus/impact/strategies/invertedHeadTailStrategy.js";

// Reflect around 100 to exercise the mirrored strategy with nonnegative impacts.
const reflect = (values) => values.toReversed().map((value) => 100 - value);

for (const inverted of [false, true]) {
  const strategy = inverted ? invertedHeadTailStrategy : headTailStrategy;
  const run = (values) =>
    strategy({ impactVisibleSorted: np.array(inverted ? reflect(values) : values) });

  describe(inverted ? "inverted head/tail breaks" : "head/tail breaks", () => {
    it.each([0, 3, 36])("abstains at ineligible size %i", (size) => {
      expect(run(Array(size).fill(5))).toBe(NO_SPLIT);
    });

    it.each([0, 5])("abstains for constant values of %i", (value) => {
      expect(run(Array(4).fill(value))).toBe(NO_SPLIT);
    });

    it.each([
      ["minimum eligible size", [0, 1, 2, 9], 9],
      ["maximum eligible size", [...Array(34).fill(1), 20], 20],
      ["stops at exactly 40 percent", [0, 0, 0, 4, 6], 4],
      ["stops above 40 percent", [0, 1, 3, 4], 3],
      ["recurses below 40 percent", [0, 0, 0, 0, 0, 0, 0, 4, 6], 6],
      ["recurses through multiple levels", [...Array(12).fill(0), 10, 10, 10, 20, 100], 100],
      ["excludes values equal to the mean", [0, 2, 2, 4], 4],
      ["keeps a repeated extreme together", [0, 0, 0, 0, 8, 8], 8],
      ["returns an observed cutoff rather than the mean", [0, 1, 2, 10], 10],
    ])("%s", (_name, values, cutoff) => {
      expect(run(values)).toEqual(
        inverted ? { low: 100 - cutoff, high: Infinity } : { low: -Infinity, high: cutoff },
      );
    });

    it("uses visible size rather than original group size", () => {
      const values = [0, 1, 2, 9];
      expect(
        strategy({
          impactVisibleSorted: np.array(inverted ? reflect(values) : values),
          impact: np.arange(36),
        }),
      ).toEqual(inverted ? { low: 91, high: Infinity } : { low: -Infinity, high: 9 });
    });
  });
}
