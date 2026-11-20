// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import leiden from "@alessandro-afloarei/graphology-communities-leiden";
import { toUndirected } from "graphology-operators";

import { mulberry32 } from "../../common/statsHelpers.js";
import { filterBySize, sortStructures } from "./base.js";

/**
 * Run Leiden several times and keep the best result, with its communities.
 *
 * The Leiden implementation used here only supports undirected graphs, so the
 * directed preference graph is first reduced to its undirected projection: a
 * single edge joins two members whenever at least one of them chooses the
 * other. Direction and reciprocity are therefore not part of the Leiden
 * modularity score (unlike the directed Louvain score reported alongside it).
 *
 * @param {import("graphology").DirectedGraph} graph - The graph.
 * @param {number} [runs=5] - Number of Leiden restarts.
 * @param {() => number} [rng=Math.random] - Random number generator.
 * @param {number} [maxIterations=0] - Hard cap on outer Leiden iterations
 *   (`0` runs until convergence).
 * @returns {{ q: number, communities: string[][] }} The best modularity `q` and
 *   its communities.
 */
function bestLeiden(graph, runs = 5, rng = Math.random, maxIterations = 0) {
  const undirected = toUndirected(graph);
  let best = null;

  for (let i = 0; i < runs; i++) {
    const result = leiden.detailed(undirected, { rng, maxIterations });

    if (best === null || result.modularity > best.modularity) {
      best = {
        modularity: result.modularity,
        assignments: {
          ...result.communities,
        },
      };
    }
  }

  const groups = new Map();

  for (const node of undirected.nodes()) {
    let id = best.assignments[node];
    if (id === undefined || id === null) id = node; // singleton fallback
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(node);
  }

  // Restrict to communities of at least MIN_STRUCTURE_SIZE members.
  return {
    q: best.modularity,
    communities: filterBySize(Array.from(groups.values())),
  };
}

/**
 * Compute the Leiden communities of the graph.
 *
 * Like the other structure modules this returns a `structures` list, but it
 * also reports the partition's modularity in an additional `modularity` key.
 * Because the underlying Leiden implementation is undirected, communities are
 * computed on the graph's undirected projection (see `bestLeiden`).
 *
 * @param {import("graphology").DirectedGraph} graph - The graph.
 * @param {{ runs?: number, seed?: number, maxIterations?: number }} [options] -
 *   Leiden options (`runs` restarts, `seed` for reproducible results,
 *   `maxIterations` to bound runtime).
 * @returns {{ structures: string[][], modularity: number }} The communities and
 *   their modularity.
 */
export const computeLeidenCommunities = (graph, { runs = 5, seed, maxIterations = 0 } = {}) => {
  if (graph.size === 0) {
    return {
      structures: sortStructures(graph.nodes().map((node) => [node])),
      modularity: 0,
    };
  }

  const rng = seed === undefined ? Math.random : mulberry32(seed);
  const { q, communities } = bestLeiden(graph, runs, rng, maxIterations);

  return {
    structures: sortStructures(communities),
    modularity: q,
  };
};
