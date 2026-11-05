// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computeDyads } from "./dyads.js";
import { computeCliques } from "./cliques.js";
import {
  computeStrongComponentsWithReciprocalEdges,
  computeStrongComponents,
  computeWeakComponents,
} from "./connectedComponents.js";
import { computeLouvainCommunities } from "./louvain.js";

/**
 * Compute the SNA structures of a directed preference graph.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @param {{ runs?: number, seed?: number }} [options] - Louvain options
 *   (`runs` restarts, `seed` for reproducible results).
 * @returns {{
 *   dyads: { structures: string[][] },
 *   cliques: { structures: string[][] },
 *   strongComponentsWithReciprocalEdges: { structures: string[][] },
 *   strongComponents: { structures: string[][] },
 *   weakComponents: { structures: string[][] },
 *   louvainCommunities: { structures: string[][], modularity: number },
 * }} The structures keyed by category. Every value exposes a `structures` list;
 *   the Louvain value additionally exposes its `modularity`.
 */
export const getSnaStructures = (graph, options = {}) => ({
  dyads: computeDyads(graph),
  cliques: computeCliques(graph),
  strongComponentsWithReciprocalEdges: computeStrongComponentsWithReciprocalEdges(graph),
  strongComponents: computeStrongComponents(graph),
  weakComponents: computeWeakComponents(graph),
  louvainCommunities: computeLouvainCommunities(graph, options),
});
