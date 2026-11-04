// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import { computeRankedScores } from "@/analysis/common/commonMetrics.js";

describe("computeRankedScores", () => {
  it("ranks a 1-D array descending (higher is better) with 1-based dense ranks by default", () => {
    const result = computeRankedScores(np.array([30, 10, 20, 10]));

    expect(result.tolist()).toEqual([1, 3, 2, 3]);
  });

  it("ranks a 1-D array ascending when higherRawScoreIsBetter is false", () => {
    const result = computeRankedScores(np.array([30, 10, 20, 10]), false);

    expect(result.tolist()).toEqual([3, 1, 2, 1]);
  });

  it("ranks each column of a 2-D array independently", () => {
    const result = computeRankedScores(
      np.array([
        [30, 10, 20, 10],
        [5, 15, 5, 25],
      ]),
    );

    expect(result.tolist()).toEqual([
      [1, 2, 1, 2],
      [2, 1, 2, 1],
    ]);
  });

  it("assigns the same rank to tied values", () => {
    const result = computeRankedScores(np.array([10, 10, 20]));

    expect(result.tolist()).toEqual([2, 2, 1]);
  });

  it("returns an empty array for an empty 1-D input", () => {
    const result = computeRankedScores(np.array([]));

    expect(result.tolist()).toEqual([]);
  });

  it("returns an empty array for an empty 2-D input", () => {
    const result = computeRankedScores(np.empty([0, 2]));

    expect(result.tolist()).toEqual([]);
  });

  it("throws for inputs with more than two dimensions", () => {
    const threeDimensional = np.array([[[1, 2], [3, 4]]]);

    expect(() => computeRankedScores(threeDimensional)).toThrow(
      "computeRankedScores expects a 1-D or 2-D array",
    );
  });
});
