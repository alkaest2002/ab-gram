// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Visible impacts, sorted ascending: the non-zero impact values flattened
 * from the NDArray into a plain number array.
 *
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @returns {number[]} Non-zero impacts in ascending order.
 */
export const toSortedVisible = (impact) =>
  impact
    .flatten()
    .toArray()
    .filter((v) => v > 0)
    .sort((a, b) => a - b); // numeric sort

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
 * @param {number[]} sorted - Sorted (ascending) values.
 * @param {number} percentile - Percentile between 0 and 100.
 * @returns {number} The observed value at that percentile.
 */
export const percentileOf = (sorted, percentile) => {
  const n = sorted.length;
  return percentile <= 50
    ? sorted[rankIndex(n, percentile)]
    : sorted[n - 1 - rankIndex(n, 100 - percentile)];
};

/**
 * True median: the middle value for odd n, or the mean of the two middle
 * values for even n. percentileOf(50) would return only one of them.
 *
 * @param {number[]} sorted - Sorted (ascending) values.
 * @returns {number} The median.
 */
export const medianOf = (sorted) => {
  const n = sorted.length;
  const mid = n >> 1;
  return n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
