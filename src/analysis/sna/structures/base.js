// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Helpers shared by the SNA structure modules (dyads, cliques and connected
 * components).
 */

/**
 * Minimum number of members a structure must have to be reported.
 *
 * Dyads are always pairs (two members); every other structure category must
 * have at least `MIN_STRUCTURE_SIZE` members.
 */
export const MIN_STRUCTURE_SIZE = 3;

/**
 * Keep only the structures with at least `MIN_STRUCTURE_SIZE` members.
 *
 * Shared by every category (other than dyads) so the size rule lives in one
 * place.
 *
 * @param {string[][]} structures - Structures as lists of member ids.
 * @returns {string[][]} The structures that are large enough to be reported.
 */
export const filterBySize = (structures) =>
  structures.filter((structure) => structure.length >= MIN_STRUCTURE_SIZE);

/**
 * Visit every reciprocal edge of the graph.
 *
 * A reciprocal edge is a directed edge that `createSnaNetwork` flagged with
 * `isMutual`. Self-loops are never visited: a member cannot form a
 * relationship with itself.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createSnaNetwork`.
 * @param {(source: string, target: string) => void} callback - Called once per
 *   reciprocal, non-loop edge.
 */
export const forEachMutualEdge = (graph, callback) => {
  graph.forEachDirectedEdge((_edge, attributes, source, target) => {
    if (source !== target && attributes.isMutual) {
      callback(source, target);
    }
  });
};

/**
 * Sort every structure's members and the structure list itself.
 *
 * Each structure's members are sorted alphabetically, then the structure list
 * is ordered by length (smallest first). Structures of equal length are ordered
 * lexicographically so the output stays deterministic regardless of the
 * graph's traversal order, which is convenient for reports and tests.
 *
 * @param {string[][]} structures - Structures as lists of member ids.
 * @returns {string[][]} The same structures, deterministically ordered.
 */
export const sortStructures = (structures) => {
  const sorted = structures.map((structure) => [...structure].sort());

  sorted.sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;

    for (let i = 0; i < a.length; i += 1) {
      if (a[i] < b[i]) return -1;
      if (a[i] > b[i]) return 1;
    }
    return 0;
  });

  return sorted;
};
