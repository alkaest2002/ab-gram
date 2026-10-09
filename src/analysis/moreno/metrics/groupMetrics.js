//////////////////////////////////////////////////////////////////////////////////
// MORENO GROUP-LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Count the number of mutual (reciprocal) pairs in a preference matrix.
 *
 * `matrix * matrix.T` is non-zero exactly where both directions of a preference
 * exist, so its sum counts each mutual pair twice (once per direction). Halving
 * that sum yields the number of distinct unordered pairs.
 *
 * @param {import("numpy-ts").NDArray} matrix - A square adjacency matrix.
 * @returns {number} The number of mutual pairs.
 */
const countMutualPairs = (matrix) => matrix.multiply(matrix.T).sum() / 2;

/**
 * Number of unordered member pairs, floored at 1 so groups smaller than two
 * members avoid a division by zero.
 *
 * @param {number} size - The number of members.
 * @returns {number} The number of possible pairs.
 */
const possiblePairs = (size) => Math.max((size * (size - 1)) / 2, 1);

/**
 * Group cohesion index: mutual like pairs divided by total possible pairs.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {number} The cohesion index.
 */
export const computeCohesion = (adjLikes) =>
  countMutualPairs(adjLikes) / possiblePairs(adjLikes.shape[0]);

/**
 * Group conflict index: mutual dislike pairs divided by total possible pairs.
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {number} The conflict index.
 */
export const computeConflict = (adjDislikes) =>
  countMutualPairs(adjDislikes) / possiblePairs(adjDislikes.shape[0]);

/**
 * Positive reciprocity index: mutual like pairs divided by total likes.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {number} The positive reciprocity index.
 */
export const computePositiveReciprocity = (adjLikes) =>
  countMutualPairs(adjLikes) / adjLikes.sum();

/**
 * Negative reciprocity index: mutual dislike pairs divided by total dislikes.
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {number} The negative reciprocity index.
 */
export const computeNegativeReciprocity = (adjDislikes) =>
  countMutualPairs(adjDislikes) / adjDislikes.sum();
