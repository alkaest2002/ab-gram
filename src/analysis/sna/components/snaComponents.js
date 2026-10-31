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
import { sortComponents } from "./base.js";

/**
 * Compute the SNA components of a directed preference graph.
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
 * }} The components keyed by category, each value a list of member-id lists,
 *   plus the Louvain communities and their modularity `q`.
 */
export const getSnaComponents = (graph, options = {}) => {
  const { communities, q } = getLouvainCommunities(graph, options);

  return {
    dyads: sortComponents(computeDyads(graph)),
    cliques: sortComponents(computeCliques(graph)),
    strongComponentsWithReciprocalEdges: sortComponents(
      computeStrongComponentsWithReciprocalEdges(graph),
    ),
    strongComponents: sortComponents(computeStrongComponents(graph)),
    weakComponents: sortComponents(computeWeakComponents(graph)),
    louvainCommunities: {
      communities: sortComponents(communities),
      q,
    },
  };
};
