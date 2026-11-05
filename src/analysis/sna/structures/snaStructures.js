// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computeDyads } from "./dyads.js";
import { computeCliques } from "./cliques.js";
import {
  computeStrongComponentsWithReciprocalEdges,
  computeStrongComponents,
  computeWeakComponents,
} from "./connectedComponents.js";
import { getLouvainCommunities } from "./louvain.js";
import { sortStructures } from "./base.js";

/**
 * Compute the SNA structures of a directed preference graph.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @param {{ runs?: number, seed?: number }} [options] - Louvain options
 *   (`runs` restarts, `seed` for reproducible results).
 * @returns {{
 *   dyads: string[][],
 *   cliques: string[][],
 *   strongComponentsWithReciprocalEdges: string[][],
 *   strongComponents: string[][],
 *   weakComponents: string[][],
 *   louvainCommunities: { communities: string[][], q: number },
 * }} The structures keyed by category, each value a list of member-id lists,
 *   plus the Louvain communities and their modularity `q`.
 */
export const getSnaStructures = (graph, options = {}) => {
  const { communities, q } = getLouvainCommunities(graph, options);

  return {
    dyads: sortStructures(computeDyads(graph)),
    cliques: sortStructures(computeCliques(graph)),
    strongComponentsWithReciprocalEdges: sortStructures(
      computeStrongComponentsWithReciprocalEdges(graph),
    ),
    strongComponents: sortStructures(computeStrongComponents(graph)),
    weakComponents: sortStructures(computeWeakComponents(graph)),
    louvainCommunities: {
      communities: sortStructures(communities),
      q,
    },
  };
};
