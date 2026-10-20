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
 * Count the number of directed mutual edges in a preference matrix.
 *
 * `matrix * matrix.T` is non-zero exactly where both directions of a preference
 * exist. Each mutual pair contributes two directed edges (one per direction),
 * so the sum is left un-halved here, unlike `countMutualPairs`.
 *
 * Formula:
 *
 *   $$ E_{\leftrightarrow} = \sum_{i,j} a_{ij}\,a_{ji} $$
 *
 * @param {import("numpy-ts").NDArray} matrix - A square adjacency matrix.
 * @returns {number} The number of directed mutual edges.
 */
const countMutualEdges = (matrix) => matrix.multiply(matrix.T).sum();

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
 * Group cohesion index (type I): mutual like pairs divided by total possible
 * pairs.
 *
 * Formula:
 *
 *   $$ Coh_I = \frac{M_L}{P} = \frac{\sum_{i,j} a_{ij}\,a_{ji}}{n(n-1)} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {number} The type I cohesion index.
 */
export const computeCohesion = (adjLikes) =>
  countMutualPairs(adjLikes) / possiblePairs(adjLikes.shape[0]);

/**
 * Group cohesion index (type II): mutual like edges divided by total like
 * edges.
 *
 * Unlike type I, this normalizes by the number of edges actually expressed
 * rather than the number of possible pairs. It equals the proportion of like
 * edges that are reciprocated.
 *
 * Formula:
 *
 *   $$ Coh_{II} = \frac{\sum_{i,j} a_{ij}\,a_{ji}}{\sum_{i,j} a_{ij}} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {number} The type II cohesion index.
 */
export const computeCohesionTypeII = (adjLikes) => {
  const totalEdges = adjLikes.sum();
  if (totalEdges === 0) return 0;
  return countMutualEdges(adjLikes) / totalEdges;
};

/**
 * Group conflict index (type I): mutual dislike pairs divided by total possible
 * pairs.
 *
 * Formula:
 *
 *   $$ Con_I = \frac{M_D}{P} = \frac{\sum_{i,j} d_{ij}\,d_{ji}}{n(n-1)} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {number} The type I conflict index.
 */
export const computeConflict = (adjDislikes) =>
  countMutualPairs(adjDislikes) / possiblePairs(adjDislikes.shape[0]);

/**
 * Group conflict index (type II): mutual dislike edges divided by total dislike
 * edges.
 *
 * Unlike type I, this normalizes by the number of edges actually expressed
 * rather than the number of possible pairs. It equals the proportion of
 * dislike edges that are reciprocated.
 *
 * Formula:
 *
 *   $$ Con_{II} = \frac{\sum_{i,j} d_{ij}\,d_{ji}}{\sum_{i,j} d_{ij}} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {number} The type II conflict index.
 */
export const computeConflictTypeII = (adjDislikes) => {
  const totalEdges = adjDislikes.sum();
  if (totalEdges === 0) return 0;
  return countMutualEdges(adjDislikes) / totalEdges;
};

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
