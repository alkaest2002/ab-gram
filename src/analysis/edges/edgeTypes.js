import * as np from "numpy-ts";

/** Edge types where `A -> B` and `B -> A` describe the same relationship. */
const SYMMETRIC_TYPES = new Set(["typeI", "typeIV"]);

/**
 * Count how many edges of each type every member takes part in.
 *
 * For symmetric types (mutual like / mutual dislike) an unordered pair is
 * counted once, even if both `[A, B]` and `[B, A]` are present.
 *
 * @param {string[]} memberIds
 * @param {Record<string, string[][]>} edgeTypes - Edge lists keyed by type name.
 * @returns {Record<string, Record<string, number>>} `result[memberId][edgeType]`
 */
const computeMemberInEdges = (memberIds, edgeTypes) => {
  const result = Object.fromEntries(
    memberIds.map((id) => [
      id,
      Object.fromEntries(Object.keys(edgeTypes).map((t) => [t, 0])),
    ]),
  );

  for (const [edgeType, edges] of Object.entries(edgeTypes)) {
    const isSymmetric = SYMMETRIC_TYPES.has(edgeType);
    const seenPairs = new Set();

    for (const edge of edges) {
      if (isSymmetric) {
        const pairKey = JSON.stringify([...edge].sort());
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);
      }

      // Set: a member is counted at most once per edge.
      for (const id of new Set(edge)) {
        // hasOwn ignores inherited keys such as "constructor" or "toString".
        if (Object.hasOwn(result, id)) result[id][edgeType]++;
      }
    }
  }
  return result;
};

/**
 * Classify every directed preference edge into one of seven types.
 *
 * An edge runs from the choosing member `A` (row `i`) to the chosen member `B`
 * (column `j`). Each edge is returned as a `[aId, bId]` pair of member ids,
 * where `aId` is the id of the choosing member and `bId` the id of the chosen
 * one. Self-edges (`i === j`) are ignored.
 *
 * Let `a_ij = 1` when member `i` likes member `j`, and `d_ij = 1` when member
 * `i` dislikes member `j`. Each directed edge `i -> j` combines the forward
 * feelings of `i` with the reverse feelings of `j`:
 *
 *   $$ \text{forward } (i \to j) = (a_{ij},\, d_{ij}) \qquad \text{reverse } (j \to i) = (a_{ji},\, d_{ji}) $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix
 *   (`adjLikes[i][j] === 1` means member `i` likes member `j`).
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix
 *   (`adjDislikes[i][j] === 1` means member `i` dislikes member `j`).
 * @param {string[]} memberIds - Member ids aligned with the matrix row/column
 *   order (see `getMemberIndices`).
 * @returns {{
 *   typeI: string[][], typeII: string[][], typeIII: string[][],
 *   typeIV: string[][], typeV: string[][], typeVI: string[][], typeVII: string[][],
 *   memberInEdges: Record<string, Record<string, number>>
 * }}
 *   Seven edge lists, each holding `[aId, bId]` member-id pairs, plus
 *   `memberInEdges`: for every member id, the number of edges of each type
 *   (`memberInEdges[memberId].typeI`, ...) the member takes part in, as either
 *   `A` or `B`. Mutual types (`typeI` and `typeIV`) count each unordered pair
 *   once, so a mutual relationship adds 1 to each of its two members, not 2.
 *
 *   The seven types are:
 *   - `typeI`   mutual like
 *   - `typeII`  one-sided like
 *   - `typeIII` one-sided dislike
 *   - `typeIV`  mutual dislike
 *   - `typeV`   `A` likes `B`, `B` dislikes `A`
 *   - `typeVI`  `A` dislikes `B`, `B` likes `A`
 *   - `typeVII` `A` both likes and dislikes `B`
 *
 *   An edge may appear in more than one list (e.g. when `B` both likes and
 *   dislikes `A`), but never twice within the same list.
 */
export const getEdgeTypes = (adjLikes, adjDislikes, memberIds) => {
  const and = np.logical_and;
  const not = np.logical_not;

  // Forward (A -> B) preference, expressed as three mutually exclusive states.
  const likesOnly = and(adjLikes, not(adjDislikes)); // A likes B, does not dislike B
  const dislikesOnly = and(adjDislikes, not(adjLikes)); // A dislikes B, does not like B
  const both = and(adjLikes, adjDislikes); // A likes and dislikes B

  // Reverse (B -> A) preference, read through the transpose. A "both" reverse
  // feeling (B likes AND dislikes A) counts as both a like and a dislike, so the
  // same edge may land in two different types (e.g. II and V) — but never twice
  // within one type.
  const likesBack = adjLikes.T; // B likes A
  const dislikesBack = adjDislikes.T; // B dislikes A
  const noneBack = and(not(likesBack), not(dislikesBack)); // B neither likes nor dislikes A

  // HEALTHY EDGES
  const typeI = and(likesOnly, likesBack); // mutual like
  const typeII = and(likesOnly, noneBack); // one-sided like

  // POTENTIALLY PROBLEMATIC EDGES
  const typeIII = and(dislikesOnly, noneBack); // one-sided dislike

  // PROBLEMATIC EDGES
  const typeIV = and(dislikesOnly, dislikesBack); // mutual dislike
  const typeV = and(likesOnly, dislikesBack); // A likes B, B dislikes A
  const typeVI = and(dislikesOnly, likesBack); // A dislikes B, B likes A
  const typeVII = both; // A likes and dislikes B

  // Translate matrix coordinates [i, j] into the matching member-id pair.
  // Self-loops (i === j) are dropped here. This is equivalent to zeroing the
  // diagonal first, because entry (i, j) of every mask depends only on
  // (i, j) and (j, i), so off-diagonal entries are unaffected.
  const toEdges = (mask) =>
    np
      .argwhere(mask)
      .tolist()
      .filter(([i, j]) => i !== j)
      .map(([i, j]) => [memberIds[i], memberIds[j]]);

  // Sort edges to ensure consistent ordering across types
  const sortEdges = (edges) => edges.sort((e1, e2) => e1[0].localeCompare(e2[0]))

  const edgeTypes = {
    typeI: sortEdges(toEdges(typeI)),
    typeII: sortEdges(toEdges(typeII)),
    typeIII: sortEdges(toEdges(typeIII)),
    typeIV: sortEdges(toEdges(typeIV)),
    typeV: sortEdges(toEdges(typeV)),
    typeVI: sortEdges(toEdges(typeVI)),
    typeVII: sortEdges(toEdges(typeVII)),
  };

  return {
    ...edgeTypes,
    memberInEdges: computeMemberInEdges(memberIds, edgeTypes),
  };
};
