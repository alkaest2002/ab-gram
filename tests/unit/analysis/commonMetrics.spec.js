import { describe, it, expect } from "vitest";
import * as np from "numpy-ts";

import { computeRankedScores, computeGiniCoefficient } from "@/analysis/common/commonMetrics.js";

describe("computeRankedScores", () => {
  it("ranks a 1-D array ascending with 1-based dense ranks", () => {
    const result = computeRankedScores(np.array([30, 10, 20, 10]));

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
      [2, 1, 2, 1],
      [1, 2, 1, 2],
    ]);
  });

  it("assigns the same rank to tied values", () => {
    const result = computeRankedScores(np.array([10, 10, 20]));

    expect(result.tolist()).toEqual([1, 1, 2]);
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

describe("computeGiniCoefficient", () => {
  it("returns 0 for empty or single-element distributions", () => {
    expect(computeGiniCoefficient(np.array([]))).toBe(0);
    expect(computeGiniCoefficient(np.array([7]))).toBe(0);
  });

  it("returns 0 for a perfectly equal distribution", () => {
    expect(computeGiniCoefficient(np.array([5, 5, 5, 5]))).toBe(0);
  });

  it("returns 0 for an all-zero distribution", () => {
    expect(computeGiniCoefficient(np.array([0, 0, 0]))).toBe(0);
  });

  it("computes the expected Gini coefficient for a known distribution", () => {
    // Gini([1, 2, 3]) = 2 / 9.
    expect(computeGiniCoefficient(np.array([1, 2, 3]))).toBeCloseTo(2 / 9, 10);
  });

  it("computes the expected Gini coefficient for a skewed distribution", () => {
    // Gini([0, 0, 100]) = 2 / 3.
    expect(computeGiniCoefficient(np.array([0, 0, 100]))).toBeCloseTo(2 / 3, 10);
  });

  it("throws when the distribution contains negative values", () => {
    expect(() => computeGiniCoefficient(np.array([1, -2, 3]))).toThrow(
      "Gini coefficient calculation requires non-negative values.",
    );
  });
});
