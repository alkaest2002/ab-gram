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
 * Formula:
 *
 *   $$ M = \frac{1}{2}\sum_{i,j} a_{ij}\,a_{ji} $$
 *
 * @param {import("numpy-ts").NDArray} matrix - A square adjacency matrix.
 * @returns {number} The number of mutual pairs.
 */
const countMutualPairs = (matrix) => matrix.multiply(matrix.T).sum() / 2;

/**
 * Number of unordered member pairs, floored at 1 so groups smaller than two
 * members avoid a division by zero.
 *
 * Formula:
 *
 *   $$ P = \binom{n}{2} = \frac{n(n-1)}{2} $$
 *
 * @param {number} size - The number of members.
 * @returns {number} The number of possible pairs.
 */
const possiblePairs = (size) => Math.max((size * (size - 1)) / 2, 1);

/**
 * Group cohesion index: mutual like pairs divided by total possible pairs.
 *
 * Formula:
 *
 *   $$ Coh = \frac{M_L}{P} = \frac{\sum_{i,j} a_{ij}\,a_{ji}}{n(n-1)} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {number} The cohesion index.
 */
export const computeCohesion = (adjLikes) =>
  countMutualPairs(adjLikes) / possiblePairs(adjLikes.shape[0]);

/**
 * Group conflict index: mutual dislike pairs divided by total possible pairs.
 *
 * Formula:
 *
 *   $$ Con = \frac{M_D}{P} = \frac{\sum_{i,j} d_{ij}\,d_{ji}}{n(n-1)} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {number} The conflict index.
 */
export const computeConflict = (adjDislikes) =>
  countMutualPairs(adjDislikes) / possiblePairs(adjDislikes.shape[0]);

/**
 * Positive reciprocity index: mutual like pairs divided by total likes.
 *
 * Formula:
 *
 *   $$ R^{+} = \frac{\frac{1}{2}\sum_{i,j} a_{ij}\,a_{ji}}{\sum_{i,j} a_{ij}} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {number} The positive reciprocity index.
 */
export const computePositiveReciprocity = (adjLikes) =>
  countMutualPairs(adjLikes) / adjLikes.sum();

/**
 * Negative reciprocity index: mutual dislike pairs divided by total dislikes.
 *
 * Formula:
 *
 *   $$ R^{-} = \frac{\frac{1}{2}\sum_{i,j} d_{ij}\,d_{ji}}{\sum_{i,j} d_{ij}} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {number} The negative reciprocity index.
 */
export const computeNegativeReciprocity = (adjDislikes) =>
  countMutualPairs(adjDislikes) / adjDislikes.sum();
