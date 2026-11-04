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

/**
 * Finalize an index-based low / average / high split. The low class is
 * sorted[0..lowEnd], average is sorted[lowEnd+1..highStart-1] and high is
 * sorted[highStart..]. A tail whose boundary values are equal (i.e. not
 * separated by at least one vote) is switched off (infinite bound).
 *
 * @param {number[]} sorted - Sorted (ascending) visible impacts.
 * @param {number} lowEnd - Index of the last low value, or -1 for no low tail.
 * @param {number} highStart - Index of the first high value, or sorted.length for no high tail.
 * @returns {{ low: number, high: number }} Finalized cutoffs, either bound may be infinite.
 */
export const finalizeSplit = (sorted, lowEnd, highStart) => {
  let low = -Infinity;
  if (lowEnd >= 0) {
    low = sorted[lowEnd];
    if (lowEnd + 1 < sorted.length && sorted[lowEnd + 1] === low) low = -Infinity;
  }

  let high = Infinity;
  if (highStart < sorted.length) {
    high = sorted[highStart];
    if (highStart - 1 >= 0 && sorted[highStart - 1] === high) high = Infinity;
  }

  return { low, high };
};

/**
 * Cut a { low, high } pair at the given percentiles, then apply the separation
 * check so a tail whose boundary values are equal is switched off.
 *
 * @param {number[]} sorted - Sorted (ascending) visible impacts.
 * @param {number} lowPercentile - Percentile for the low cutoff.
 * @param {number} highPercentile - Percentile for the high cutoff.
 * @returns {{ low: number, high: number }} Finalized cutoffs (either may be infinite).
 */
export const tailCutoffs = (sorted, lowPercentile, highPercentile) => {
  const n = sorted.length;
  const lowEnd = rankIndex(n, lowPercentile);
  const highStart = n - 1 - rankIndex(n, 100 - highPercentile);
  return finalizeSplit(sorted, lowEnd, highStart);
};
