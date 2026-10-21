import * as np from "numpy-ts";

/** Edge types where `A -> B` and `B -> A` describe the same relationship. */
const SYMMETRIC_TYPES = new Set(["typeI", "typeIV"]);

/**
 * Compute, for every member, the share of their edges that belong to each type.
 *
 * A directed edge is attributed to its choosing member (`A`); a symmetric edge
 * (mutual like / mutual dislike) is attributed to both members. Symmetric
 * unordered pairs are counted once, even if both `[A, B]` and `[B, A]` are
 * present.
 *
 * @param {string[]} memberIds
 * @param {Record<string, string[][]>} edgeTypes - Edge lists keyed by type name.
 * @returns {Record<string, Record<string, number>>} `result[memberId][edgeType]`,
 *   a value in `[0, 1]` equal to the share of the member's total edges of that
 *   type. Shares sum to 1, or are all 0 for a member with no edges.
 */
const computeMemberInEdges = (memberIds, edgeTypes) => {
  const typeNames = Object.keys(edgeTypes);

  // Initialize result with zero counts for each member and edge type
  const result = Object.fromEntries(
    memberIds.map((memberId) => [
      memberId,
      Object.fromEntries(typeNames.map((type) => [type, 0])),
    ]),
  );

  // Count edges for each type, updating the result object
  for (const [edgeType, edges] of Object.entries(edgeTypes)) {
    const isSymmetric = SYMMETRIC_TYPES.has(edgeType);
    const seenPairs = new Set();

    for (const [fromId, toId] of edges) {
      if (isSymmetric) {
        // Canonical key for an unordered pair, so [A, B] and [B, A] collapse
        // into a single relationship. "\u0000" keeps the ids from running
        // together into an ambiguous key.
        const pairKey = fromId < toId ? `${fromId}\u0000${toId}` : `${toId}\u0000${fromId}`;
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);
      }

      // The choosing member (`fromId`) always owns the edge. Only symmetric
      // types also credit the chosen member (`toId`), because those
      // relationships are mutual (the unordered pair is already deduped above).
      if (Object.hasOwn(result, fromId)) result[fromId][edgeType] += 1;
      if (isSymmetric && Object.hasOwn(result, toId)) result[toId][edgeType] += 1;
    }
  }

  // Convert counts into the share of the member's total edges, keeping every
  // value in [0, 1]. A member with no edges keeps 0 rather than dividing by 0.
  for (const counts of Object.values(result)) {
    const total = typeNames.reduce((sum, type) => sum + counts[type], 0);
    for (const type of typeNames) {
      counts[type] = {
        cnt: total === 0 ? 0 : counts[type],
        pct: total === 0 ? 0 : counts[type] / total
    };
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
 *   `memberInEdges`: for every member id, the share (in `[0, 1]`) of that
 *   member's total edges that are of each type
 *   (`memberInEdges[memberId].typeI`, ...). Directed edges are attributed to
 *   their choosing member (`A`); mutual types (`typeI` and `typeIV`) count each
 *   unordered pair once and attribute it to both members.
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
