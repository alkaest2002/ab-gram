import * as np from "numpy-ts";

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
 * Member ids in the order they occupy the rows/columns of an adjacency matrix.
 *
 * Row `i` belongs to the member whose id sits at position `i` in this array.
 *
 * @param {Member[]} members
 * @returns {string[]} Member ids aligned with the matrix row order.
 */
export const getMemberIndices = (members) => members.map((member) => member.id);


/**
 * Classify every directed preference edge into one of seven types.
 *
 * An edge runs from the choosing member `A` (row `i`) to the chosen member `B`
 * (column `j`). Each edge is returned as a `[aId, bId]` pair of member ids,
 * where `aId` is the id of the choosing member and `bId` the id of the chosen
 * one.
 *
 * @param {number[][]} adjLikes - Likes adjacency matrix (`adjLikes[i][j] === 1`
 *   means member `i` likes member `j`).
 * @param {number[][]} adjDislikes - Dislikes adjacency matrix
 *   (`adjDislikes[i][j] === 1` means member `i` dislikes member `j`).
 * @param {string[]} memberIndices - Member ids aligned with the matrix row/column
 *   order (see `getMemberIndices`).
 * @returns {{ typeI: string[][], typeII: string[][], typeIII: string[][],
 *   typeIV: string[][], typeV: string[][], typeVI: string[][], typeVII: string[][] }}
 *   Seven edge lists, each holding `[aId, bId]` member-id pairs. An edge may
 *   appear in more than one list (e.g. when `B` both likes and dislikes `A`),
 *   but never twice within the same list.
 */
export const getEdgesTypes = (adjLikes, adjDislikes, memberIndices) => {
  const likes = np.array(adjLikes);
  const dislikes = np.array(adjDislikes);

  const and = np.logical_and;
  const not = np.logical_not;

  // Forward (A -> B) preference, expressed as three mutually exclusive states.
  const likesOnly = and(likes, not(dislikes));    // A likes B, does not dislike B
  const dislikesOnly = and(dislikes, not(likes)); // A dislikes B, does not like B
  const both = and(likes, dislikes);              // A likes and dislikes B

  // Reverse (B -> A) preference, read through the transpose. A "both" reverse
  // feeling (B likes AND dislikes A) counts as both a like and a dislike, so the
  // same edge may land in two different types (e.g. II and V) — but never twice
  // within one type.
  const likesBack = likes.T;                  // B likes A
  const dislikesBack = dislikes.T;            // B dislikes A
  const noneBack = and(not(likes.T), not(dislikes.T)); // B neither likes nor dislikes A

  // NON PROBLEMATIC EDGES
  const typeI = and(likesOnly, noneBack);      // one-sided like
  const typeII = and(likesOnly, likesBack);    // mutual like

  // PROBLEMATIC EDGES
  const typeIII = and(dislikesOnly, noneBack); // one-sided dislike
  const typeIV = and(dislikesOnly, dislikesBack); // mutual dislike
  const typeV = and(likesOnly, dislikesBack);  // A likes B, B dislikes A
  const typeVI = and(dislikesOnly, likesBack); // A dislikes B, B likes A

  // EDGES THAT NEED INQUIRY
  const typeVII = both;                        // A likes and dislikes B

  // Translate matrix coordinates [i, j] into the matching member-id pair.
  const toEdges = (mask) =>
    np.argwhere(mask).tolist().map(([i, j]) => [memberIndices[i], memberIndices[j]]);

  // Sort edges to ensure consistent ordering across types (e.g. [a, b] should
  // always come before [b, a]).
  const sortEdges = (edges) =>
    edges.sort(([a1, b1], [a2, b2]) => {
      const pair1 = [a1, b1].sort().join('|');
      const pair2 = [a2, b2].sort().join('|');
      return pair1.localeCompare(pair2);
    });

  return {
    typeI: sortEdges(toEdges(typeI)),
    typeII: sortEdges(toEdges(typeII)),
    typeIII: sortEdges(toEdges(typeIII)),
    typeIV: sortEdges(toEdges(typeIV)),
    typeV: sortEdges(toEdges(typeV)),
    typeVI: sortEdges(toEdges(typeVI)),
    typeVII: sortEdges(toEdges(typeVII)),
  };
};
