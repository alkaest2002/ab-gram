/**
 * Build a square adjacency matrix for a preference type [either likes or dislikes].
 *
 * Rows and columns follow the order of `members`, so `matrix[i][j]` is `1`
 * when `members[i]` chose `members[j]` for the given preference and `0`
 * otherwise.
 *
 * @param {Member[]} members
 * @param {"likes" | "dislikes"} preference
 * @returns {number[][]} A `members.length` x `members.length` adjacency matrix.
 */
export const createAdjacencyMatrix = (members, preference) => {
  if (preference !== "likes" && preference !== "dislikes") {
    throw new Error(`Unknown preference "${preference}". Expected "likes" or "dislikes".`);
  }

  const indexById = new Map(members.map((member, index) => [member.id, index]));
  const size = members.length;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(0));

  members.forEach((member, i) => {
    for (const chosenId of member[preference]) {
      const j = indexById.get(chosenId);
      if (j !== undefined) matrix[i][j] = 1;
    }
  });

  return matrix;
};

/**
 * Build both adjacency matrices (likes and dislikes) for a set of members.
 *
 * `adjLikes` captures who likes whom, while `adjDislikes` captures who dislikes whom.
 *
 * @param {Member[]} members
 * @returns {{ adjLikes: number[][], adjDislikes: number[][] }} The likes matrix as `adjLikes`
 *   and the dislikes matrix as `adjB`.
 */
export const createAdjacencyMatrices = (members) => {
  const adjLikes = createAdjacencyMatrix(members, "likes");
  const adjDislikes = createAdjacencyMatrix(members, "dislikes");
  return {
    adjLikes,
    adjDislikes
  }
}

/**
 * Member ids in the order they occupy the rows of an adjacency matrix.
 *
 * Row `i` belongs to the member whose id sits at position `i` in this array.
 *
 * @param {Member[]} members
 * @returns {string[]} Member ids aligned with the matrix row order.
 */
export const getRowIndices = (members) => members.map((member) => member.id);

/**
 * Member ids in the order they occupy the columns of an adjacency matrix.
 *
 * Column `j` belongs to the member whose id sits at position `j` in this array.
 *
 * @param {Member[]} members
 * @returns {string[]} Member ids aligned with the matrix column order.
 */
export const getColIndices = (members) => members.map((member) => member.id);
