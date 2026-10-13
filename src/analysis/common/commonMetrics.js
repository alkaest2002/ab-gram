import * as np from "numpy-ts";

/**
 * Compute dense ranks for every column of a matrix.
 *
 * Each column is ranked independently against its sorted unique values: the
 * smallest value gets rank 1, ties share the same rank, and the next distinct
 * value continues at the following rank. For example `[30, 10, 20, 10]` becomes
 * `[3, 1, 2, 1]`.
 *
 * A 1-D array is treated as a single column and returned as a 1-D array.
 *
 * @param {import("numpy-ts").NDArray} scores - A 1-D or 2-D array whose columns are ranked.
 * @returns {import("numpy-ts").NDArray} Same shape as `scores`, with each column
 *   replaced by its 1-based ascending dense ranks.
 * @throws {Error} When `scores` has more than 2 dimensions.
 */
export const computeRankedScores = (scores) => {
  // Throw if array with more than 2 dimensions.
  if (scores.ndim > 2) {
    throw new Error(
      `getRankedScores expects a 1-D or 2-D array, received a ${scores.ndim}-D array.`,
    );
  }

  // Flag for 1 dimensional array.
  const is1D = scores.ndim === 1;

  // Normalize 1-D input to a single-column 2-D matrix.
  const matrix = is1D ? scores.reshape(scores.shape[0], 1) : scores;

  // Get matrix shape
  const [rows, cols] = matrix.shape;

  // If no rows return empty results.
  if (rows === 0) {
    return is1D ? np.empty([0], "int32") : np.empty([0, cols], "int32");
  }

  // Initialize results
  const rankedColumns = [];

  // Iterate over columns
  for (let col = 0; col < cols; col += 1) {
    // Copy the column so `unique_inverse` reads a contiguous 1-D array.
    const column = matrix.slice(":", col).copy();

    // `unique_inverse` returns the column's unique values sorted ascending and,
    // for each element, its 0-based index into that sorted list.
    const { inverse_indices: inverse } = np.unique_inverse(column);
    rankedColumns.push(np.add(inverse, 1));
  }

  // Keep the input's dimensionality: 1-D in -> 1-D out, 2-D in -> 2-D out.
  return is1D ? rankedColumns[0] : np.column_stack(rankedColumns);
};

/**
 * Compute the Gini coefficient of a 1-D array of values.
 *
 * The Gini coefficient measures how unequally a distribution is spread, from 0
 * (perfect equality, all values identical) up to 1 (maximum inequality). Values
 * are sorted ascending and weighted by their rank (`2 * i - n + 1`), then the
 * weighted sum is normalized by the element count and total sum.
 *
 * Formula:
 *
 *   $$ G = \frac{\sum_{i=0}^{n-1} (2i - n + 1)\,x_i}{n \sum_{i=0}^{n-1} x_i} $$
 *
 * @param {import("numpy-ts").NDArray} data - A 1-D array of non-negative values.
 * @returns {number} The Gini coefficient in the range `[0, 1]`.
 * @throws {Error} When `data` contains negative values.
 */
export const computeGiniCoefficient = (data) => {
  // Handle edge cases: falsy input or fewer than two values is perfectly equal.
  if (!data || data.size <= 1) return 0;

  // Sort the array
  const sortedData = np.sort(data);
  const n = sortedData.size;

  // Check for negative values
  if (sortedData.min() < 0) {
    throw new Error("Gini coefficient calculation requires non-negative values.");
  }

  // Calculate total sum
  const totalSum = sortedData.sum();

  // Handle zero case
  if (totalSum === 0) return 0;

  // Create index array [0, 1, 2, ..., n-1]
  const indices = np.arange(n);

  // Calculate weights: 2*i - n + 1
  const weights = indices.multiply(2).subtract(n).add(1);

  // Calculate weighted sum: Σ(value * weight)
  const sumOfDifferences = sortedData.multiply(weights).sum();

  // Return Gini coefficient
  return sumOfDifferences / (n * totalSum);
}
