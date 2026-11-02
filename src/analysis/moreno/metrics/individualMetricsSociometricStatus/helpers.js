// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// ============================================================================
// HELPERS (shared by the strategy and classification steps)
// ============================================================================

export const toSortedVisible = (impact) =>
  impact
    .flatten()
    .toArray()
    .filter((v) => v > 0)
    .sort((a, b) => a - b); // numeric sort

// Nearest-rank index (0-based): ceil(n*p/100) - 1, clamped to a valid index.
export const rankIndex = (n, percentile) =>
  Math.min(n - 1, Math.max(0, Math.ceil((n * percentile) / 100) - 1));

// Nearest-rank percentile on a sorted array. Upper percentiles are mirrored
// from the lower ones (p > 50 uses the (100 - p) rank counted from the top),
// so "bottom p%" and "top p%" always contain the same number of members.
// Plain nearest-rank is asymmetric when n*p/100 is an integer.
export const percentileOf = (sorted, percentile) => {
  const n = sorted.length;
  return percentile <= 50
    ? sorted[rankIndex(n, percentile)]
    : sorted[n - 1 - rankIndex(n, 100 - percentile)];
};

// True median (mean of the two middle values for even n). percentileOf(50)
// would return the lower/upper middle value instead.
export const medianOf = (sorted) => {
  const n = sorted.length;
  const mid = n >> 1;
  return n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
