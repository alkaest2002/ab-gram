// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

// Strategy parameters.
const MIN_MEMBERS = 5;
const MIN_GVF = 0.75;

/**
 * Fisher-Jenks optimal 1-D clustering (exact DP, O(k * n^2)).
 *
 * @param {import("numpy-ts").NDArray} sorted - Sorted (ascending) values.
 * @param {number} k - Number of classes.
 * @returns {{ starts: number[], sdcm: number }} Start index of every class except the first, and the total within-class sum of squares (SDCM).
 */
const jenksBreaks = (sorted, k) => {
  const n = sorted.size;

  // Prefix sums give the SSE of any slice in O(1).
  const s1 = [0];
  const s2 = [0];
  for (let i = 0; i < n; i += 1) {
    const value = sorted.get([i]);
    s1.push(s1[s1.length - 1] + value);
    s2.push(s2[s2.length - 1] + value * value);
  }
  // SSE of sorted[i..j], inclusive.
  const sse = (i, j) => {
    const sum = s1[j + 1] - s1[i];
    return s2[j + 1] - s2[i] - (sum * sum) / (j - i + 1);
  };

  // cost[c][j]: min SSE of splitting sorted[0..j] into c classes.
  // back[c][j]: start index of the last class in that optimum.
  const cost = Array.from({ length: k + 1 }, () => Array.from({ length: n }, () => Infinity));
  const back = Array.from({ length: k + 1 }, () => Array.from({ length: n }, () => 0));
  for (let j = 0; j < n; j++) cost[1][j] = sse(0, j);

  for (let c = 2; c <= k; c++) {
    for (let j = c - 1; j < n; j++) {
      for (let i = c - 1; i <= j; i++) {
        const total = cost[c - 1][i - 1] + sse(i, j);
        if (total < cost[c][j]) {
          cost[c][j] = total;
          back[c][j] = i;
        }
      }
    }
  }

  /** @type {number[]} */
  const starts = [];
  let j = n - 1;
  for (let c = k; c >= 2; c--) {
    const i = back[c][j];
    starts.unshift(i);
    j = i - 1;
  }
  return { starts, sdcm: cost[k][n - 1] };
};

/**
 * Jenks natural breaks (k = 3): cutoffs fall in the widest gaps, gated by the
 * goodness of variance fit (GVF = 1 - SDCM/SDAM) so structureless data abstains.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const jenksStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain vote under this/these condition(s).
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS) return NO_SPLIT;

  // If there are less than 3 distinct impact values, abstain.
  if (impactVisibleSorted.diff().not_equal(0).sum() < 2) return NO_SPLIT;

  const mean = impactVisibleSorted.mean();
  const sdam = impactVisibleSorted.subtract(mean).power(2).sum();
  if (sdam === 0) return NO_SPLIT;

  const { starts, sdcm } = jenksBreaks(impactVisibleSorted, 3);
  if (1 - sdcm / sdam < MIN_GVF) return NO_SPLIT;

  // ========================================================================
  // CLASSIFY + SEPARATION CHECK — class 1 is low, class 3 is high.
  // ========================================================================
  return finalizeSplit(impactVisibleSorted, starts[0] - 1, starts[1]);
};
