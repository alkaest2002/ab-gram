// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";
import { finalizeSplit } from "@/analysis/moreno/metrics/sociometricStatus/impact/helpers.js";

const MIN_MEMBERS = 7;
const MAX_MEMBERS = 35;
const MIN_GVF = 0.75;
const PREFERRED_K = 5;
const FALLBACK_K = 3;

/**
 * Partition sorted values into k nonempty, contiguous classes by minimizing
 * the sum of squared deviations from each class mean (O(k * n^2) time).
 * At each prefix, keep the earlier start of its last class when costs tie
 * within roundoff tolerance. For the full input this favors a broader high
 * class; there is no separate preference for a broader low class.
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

  // For c classes covering indices 0..j, cost[c][j] stores the selected fit's
  // SSE and back[c][j] records the start index of its last class.
  const cost = Array.from({ length: k + 1 }, () => Array.from({ length: n }, () => Infinity));
  const back = Array.from({ length: k + 1 }, () => Array.from({ length: n }, () => 0));

  // With one class there is no split: the whole prefix shares one mean.
  for (let j = 0; j < n; j++) cost[1][j] = sse(0, j);

  for (let c = 2; c <= k; c++) {
    for (let j = c - 1; j < n; j++) {
      // SSE subtracts quantities that can be much larger than the residual error.
      // Scale machine epsilon by the prefix sum of squares, not by the residual:
      // mathematically equal fits can differ by roundoff at that larger scale.
      const tolerance = Number.EPSILON * s2[j + 1];
      // Try each start i for the last class. The preceding i values must
      // supply at least one member to each of the other c - 1 classes.
      for (let i = c - 1; i <= j; i++) {
        const total = cost[c - 1][i - 1] + sse(i, j);
        const best = cost[c][j];
        // Replace the current split only for an improvement beyond roundoff.
        // Since i increases, a tie keeps the earlier split (more members in i..j).
        if (total < best - tolerance) {
          cost[c][j] = total;
          back[c][j] = i;
        }
      }
    }
  }

  // Trace the selected splits from right to left; callers need ascending indices.
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
 * Fit five Jenks classes for 7–35 visible members, then merge classes 2–4.
 * With only three or four distinct impacts, fit three classes instead.
 * Goodness of variance fit (GVF = 1 - SDCM/SDAM) is checked before merging.
 *
 * @param {{ impactVisibleSorted: import("numpy-ts").NDArray }} context - Sorted visible impacts.
 * @returns {{ low: number, high: number }} Proposed cutoffs, or NO_SPLIT.
 */
export const jenksStrategy = ({ impactVisibleSorted }) => {
  // ========================================================================
  // VOTE ELIGIBILITY — abstain when the strategy requirements are not met.
  // ========================================================================
  if (impactVisibleSorted.size < MIN_MEMBERS || impactVisibleSorted.size > MAX_MEMBERS) {
    return NO_SPLIT;
  }

  const distinctCount = impactVisibleSorted.diff().not_equal(0).sum() + 1;
  if (distinctCount < FALLBACK_K) return NO_SPLIT;
  const k = distinctCount >= PREFERRED_K ? PREFERRED_K : FALLBACK_K;

  const mean = impactVisibleSorted.mean();
  const sdam = impactVisibleSorted.subtract(mean).power(2).sum();
  if (sdam === 0) return NO_SPLIT;

  // GVF measures the fraction of total variation explained by the original
  // k classes, not by the three impact groups reported after merging.
  const { starts, sdcm } = jenksBreaks(impactVisibleSorted, k);
  if (1 - sdcm / sdam < MIN_GVF) return NO_SPLIT;

  // Cutoffs are inclusive: low ends just before the second class starts;
  // high begins at the start of the last class. All intervening classes merge.
  return finalizeSplit(impactVisibleSorted, starts[0] - 1, starts[k - 2]);
};
