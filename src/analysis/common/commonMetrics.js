// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";

/**
 * Rank a single 1-D column.
 *
 * `unique_inverse` returns the column's unique values sorted ascending and,
 * for each element, its 0-based index into that sorted list.
 *
 * @param {import("numpy-ts").NDArrayCore} column - 1-D array whose elements
 *   are ranked.
 * @param {boolean} higherRawScoreIsBetter - When true, higher raw scores
 *   receive better (lower-numbered) ranks; otherwise lower raw scores do.
 * @returns {import("numpy-ts").NDArray} 1-based dense ranks for `column`.
 */
const rankColumn = (column, higherRawScoreIsBetter) => {
  // `apply_along_axis` hands this callback a strided view into the matrix.
  // `unique_inverse` walks the underlying buffer contiguously and ignores
  // strides, so copy first to make the column contiguous.
  const contiguous = column.copy();

  // Compute unique values and inverse indices for the column.
  const { values, inverse_indices } = np.unique_inverse(contiguous);

  // Convert inverse indices to a NumPy array for easier manipulation.
  const npValues = np.array(inverse_indices, "int32");

  // With higher-is-better, the largest value maps to rank 1; otherwise the
  // smallest value does. Either way, ties share a rank.
  return higherRawScoreIsBetter ? npValues.negative().add(values.size) : npValues.add(1);
};

/**
 * Compute dense ranks for every column of a matrix.
 *
 * Each column is ranked independently against its sorted unique values: ties
 * share the same rank, and the next distinct value continues at the following
 * rank. When `higherRawScoreIsBetter` is true the largest value gets rank 1
 * (for example `[30, 10, 20, 10]` becomes `[1, 3, 2, 3]`); otherwise the
 * smallest value gets rank 1 (the same input becomes `[3, 1, 2, 1]`).
 *
 * A 1-D array is treated as a single column and returned as a 1-D array.
 *
 * @param {import("numpy-ts").NDArray} scores - A 1-D or 2-D array whose columns are ranked.
 * @param {boolean} [higherRawScoreIsBetter=true] - When true, higher raw scores
 *   receive better (lower-numbered) ranks; when false, lower raw scores do.
 * @returns {import("numpy-ts").NDArray} Same shape as `scores`, with each column
 *   replaced by its 1-based dense ranks.
 * @throws {Error} When `scores` has more than 2 dimensions.
 */
export const computeRankedScores = (scores, higherRawScoreIsBetter = true) => {
  // Throw if array with more than 2 dimensions.
  if (scores.ndim > 2) {
    throw new Error(
      `computeRankedScores expects a 1-D or 2-D array, received a ${scores.ndim}-D array.`,
    );
  }

  // Nothing to rank: preserve the input's shape and return an empty array.
  if (scores.size === 0) {
    return np.empty(scores.shape, "int32");
  }

  // `apply_along_axis` ranks each column along axis 0. For a 1-D array that
  // means the whole array is ranked as a single column, which is exactly what
  // we want, so no reshape is required.
  return np.apply_along_axis(rankColumn, 0, scores, higherRawScoreIsBetter);
};
