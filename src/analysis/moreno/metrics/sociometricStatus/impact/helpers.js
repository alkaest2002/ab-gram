// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { NO_SPLIT } from "@/analysis/moreno/metrics/sociometricStatus/constants.js";

/**
 * Nearest-rank index (0-based): ceil(n * percentile / 100) - 1, clamped to a
 * valid index.
 *
 * @param {number} n - Number of visible members.
 * @param {number} percentile - Percentile between 0 and 100.
 * @returns {number} 0-based index into the sorted values.
 */
export const rankIndex = (n, percentile) =>
  Math.min(n - 1, Math.max(0, Math.ceil((n * percentile) / 100) - 1));

/**
 * Nearest-rank percentile on a sorted array. Upper percentiles are mirrored
 * from the lower ones (p > 50 uses the (100 - p) rank counted from the top),
 * so "bottom p%" and "top p%" always contain the same number of members.
 *
 * @param {import("numpy-ts").NDArray} sorted - Sorted (ascending) values.
 * @param {number} percentile - Percentile between 0 and 100.
 * @returns {number} The observed value at that percentile.
 */
export const percentileOf = (sorted, percentile) => {
  const n = sorted.size;
  return percentile <= 50
    ? sorted.get([rankIndex(n, percentile)])
    : sorted.get([n - 1 - rankIndex(n, 100 - percentile)]);
};

/**
 * @param {import("numpy-ts").NDArray} sorted - Sorted visible impacts.
 * @param {number} start - Inclusive index of the first band member.
 * @param {number} end - Exclusive end index; must be greater than start.
 * @returns {number} Arithmetic mean of the impacts in [start, end).
 */
const bandMean = (sorted, start, end) => sorted.slice(`${start}:${end}`).mean();

/**
 * Compare candidate tails for the same center band. A lower score means
 * merging that tail into the center adds less within-band squared error.
 *
 * @param {number} centerCount - Number of members in the nonempty center band.
 * @param {number} centerMean - Mean impact of the center band.
 * @param {number} tailCount - Number of members in the nonempty candidate tail.
 * @param {number} tailMean - Mean impact of the candidate tail.
 * @returns {number} Ward's increase in within-band squared error divided by centerCount.
 */
const wardMergeScore = (centerCount, centerMean, tailCount, tailMean) =>
  (tailCount / (tailCount + centerCount)) * (centerMean - tailMean) ** 2;

/**
 * Finalize an index-based low / average / high split. The low class is
 * sorted[0..lowEnd], average is sorted[lowEnd+1..highStart-1] and high is
 * sorted[highStart..]. Inputs are inclusive indices; outputs are inclusive
 * impact values. In both cases, an infinite bound denotes an absent tail.
 * Average must outnumber each active tail. If a two-cutoff split fails this
 * check, merge average with one tail, minimizing total within-band squared
 * error among valid merges. Abstain if neither merge wins.
 *
 * Invalid indices or nonfinite or unsorted impacts yield NO_SPLIT.
 * @param {import("numpy-ts").NDArray} sorted - Sorted (ascending) visible impacts.
 * @param {number} lowEnd - Index of the last low value, or -Infinity for no low tail.
 * @param {number} highStart - Index of the first high value, or Infinity for no high tail.
 * @returns {{ low: number, high: number }} Finalized cutoffs, either bound may be infinite.
 */
export const finalizeSplit = (sorted, lowEnd, highStart) => {
  // A tied boundary disables the entire proposed tail. We do not move the
  // boundary to either end of the tie: that would invent a different cutoff.
  let low = -Infinity;
  if (lowEnd !== -Infinity) {
    low = sorted.get([lowEnd]);
    if (lowEnd + 1 < sorted.size && sorted.get([lowEnd + 1]) === low) low = -Infinity;
  }

  let high = Infinity;
  if (highStart !== Infinity) {
    high = sorted.get([highStart]);
    if (highStart - 1 >= 0 && sorted.get([highStart - 1]) === high) high = Infinity;
  }

  // Count members after resolving ties. Average must beat each tail separately,
  // not their combined size. A failed one-tail split has no alternative cutoff.
  const lowCount = low === -Infinity ? 0 : lowEnd + 1;
  const highCount = high === Infinity ? 0 : sorted.size - highStart;
  const averageCount = sorted.size - lowCount - highCount;
  if (!lowCount && !highCount) return NO_SPLIT;
  if (averageCount > Math.max(lowCount, highCount)) return { low, high };

  // Only a two-tail split can still be rescued by merging average
  // with one tail and retaining the other cutoff.
  if (!lowCount || !highCount) return NO_SPLIT;

  // Merging a tail into average removes that cutoff and keeps the opposite
  // tail intact. Rule out merges that would leave average tied or outnumbered.
  const mergeLow = averageCount + lowCount > highCount;
  const mergeHigh = averageCount + highCount > lowCount;
  if (!mergeLow && !mergeHigh) return NO_SPLIT;
  if (!mergeHigh) return { low: -Infinity, high };
  if (!mergeLow) return { low, high: Infinity };

  // Both merges are valid, so all three bands are nonempty.
  const center = bandMean(sorted, lowCount, highStart);
  const lowCost = wardMergeScore(averageCount, center, lowCount, bandMean(sorted, 0, lowCount));
  const highCost = wardMergeScore(
    averageCount,
    center,
    highCount,
    bandMean(sorted, highStart, sorted.size),
  );
  // Rounded means can break a mathematical tie. Scale the tolerance to the
  // costs so rescaling the impacts does not change which tail wins.
  const tolerance = 1e-12 * Math.max(lowCost, highCost);
  if (Math.abs(lowCost - highCost) <= tolerance) return NO_SPLIT;
  return lowCost < highCost ? { low: -Infinity, high } : { low, high: Infinity };
};
