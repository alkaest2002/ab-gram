// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Helpers shared by the SNA component modules (dyads, cliques and connected
 * components).
 */

/**
 * Minimum number of members a component must have to be reported.
 *
 * Dyads are always pairs (two members); every other component category must
 * have at least `MIN_COMPONENT_SIZE` members.
 */
export const MIN_COMPONENT_SIZE = 3;

/**
 * Keep only the components with at least `MIN_COMPONENT_SIZE` members.
 *
 * Shared by every category (other than dyads) so the size rule lives in one
 * place.
 *
 * @param {string[][]} components - Components as lists of member ids.
 * @returns {string[][]} The components that are large enough to be reported.
 */
export const filterBySize = (components) =>
  components.filter((component) => component.length >= MIN_COMPONENT_SIZE);

/**
 * Visit every reciprocal edge of the graph.
 *
 * A reciprocal edge is a directed edge that `createLikesGraph` flagged with
 * `isMutual`. Self-loops are never visited: a member cannot form a
 * relationship with itself.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
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
 * Sort every component's members and the component list itself.
 *
 * Each component's members are sorted alphabetically, then the component list
 * is ordered by length (smallest first). Components of equal length are ordered
 * lexicographically so the output stays deterministic regardless of the
 * graph's traversal order, which is convenient for reports and tests.
 *
 * @param {string[][]} components - Components as lists of member ids.
 * @returns {string[][]} The same components, deterministically ordered.
 */
export const sortComponents = (components) => {
  const sorted = components.map((component) => [...component].sort());

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
