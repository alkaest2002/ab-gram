// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { filterBySize } from "./base.js";

/**
 * Build the undirected adjacency of a graph: for every node, the set of nodes
 * it is connected to through an edge in either direction. Self-loops are
 * ignored.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {Map<string, Set<string>>} Node id -> set of adjacent node ids.
 */
const buildUndirectedAdjacency = (graph) => {
  const adjacency = new Map();

  graph.forEachNode((node) => {
    // `neighbors` merges in- and out-neighbours; a self-loop lists the node
    // itself, so it is removed.
    const neighbors = new Set(graph.neighbors(node));
    neighbors.delete(node);
    adjacency.set(node, neighbors);
  });

  return adjacency;
};

/**
 * Pick the Bron–Kerbosch pivot: the node of `P ∪ X` with the most neighbours
 * in `P`. Pivoting prunes the recursion and avoids reporting duplicate cliques.
 *
 * @param {string[]} p - Candidate nodes.
 * @param {string[]} x - Excluded nodes.
 * @param {Map<string, Set<string>>} adjacency - Undirected adjacency.
 * @returns {string} The pivot node.
 */
const pickCliquePivot = (p, x, adjacency) => {
  let best = null;
  let bestCount = -1;

  for (const node of [...p, ...x]) {
    const neighbors = adjacency.get(node);
    let count = 0;
    for (const candidate of p) {
      if (neighbors.has(candidate)) count += 1;
    }
    if (count > bestCount) {
      best = node;
      bestCount = count;
    }
  }

  return best;
};

/**
 * Enumerate the maximal cliques of an undirected graph using the Bron–Kerbosch
 * algorithm with pivoting.
 *
 * @param {Map<string, Set<string>>} adjacency - Undirected adjacency.
 * @returns {string[][]} The maximal cliques, each as a list of node ids.
 */
const findMaximalCliques = (adjacency) => {
  const cliques = [];

  const recurse = (r, p, x) => {
    if (p.length === 0 && x.length === 0) {
      cliques.push([...r]);
      return;
    }

    const pivot = pickCliquePivot(p, x, adjacency);
    const pivotNeighbors = adjacency.get(pivot);

    // Iterate over P \ N(pivot). The set is captured up front, then P and X are
    // updated after each recursive call as required by the algorithm.
    const vertices = p.filter((node) => !pivotNeighbors.has(node));

    for (const v of vertices) {
      const vNeighbors = adjacency.get(v);
      recurse(
        [...r, v],
        p.filter((node) => vNeighbors.has(node)),
        x.filter((node) => vNeighbors.has(node)),
      );
      p = p.filter((node) => node !== v);
      x = [...x, v];
    }
  };

  recurse([], [...adjacency.keys()], []);

  return cliques;
};

/**
 * Compute the cliques: maximal groups in which every node is directly adjacent
 * to every other node, ignoring the direction of connections.
 *
 * A clique is therefore a maximal complete subgraph of the graph's undirected
 * projection. Only cliques of at least `MIN_COMPONENT_SIZE` members are
 * returned, so triads and larger groups are reported while pairs are left to
 * `dyads`.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {string[][]} The cliques, each as a list of member ids.
 */
export const computeCliques = (graph) =>
  filterBySize(findMaximalCliques(buildUndirectedAdjacency(graph)));
