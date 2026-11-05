// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { DirectedGraph } from "graphology";
import { connectedComponents, stronglyConnectedComponents } from "graphology-components";

import { filterBySize, forEachMutualEdge, sortStructures } from "./base.js";

/**
 * Compute the strongly connected groups that only use reciprocal edges.
 *
 * The graph is reduced to its reciprocal edges — the ones `createLikesGraph`
 * flagged with `isMutual` — then its strongly connected components are computed.
 * Only components of at least `MIN_STRUCTURE_SIZE` members are returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @returns {{ structures: string[][] }} The components, each as a list of member ids.
 */
export const computeStrongComponentsWithReciprocalEdges = (graph) => {
  const reciprocal = new DirectedGraph();

  graph.forEachNode((node) => reciprocal.addNode(node));

  forEachMutualEdge(graph, (source, target) => {
    reciprocal.mergeDirectedEdge(source, target);
  });

  return {
    structures: sortStructures(filterBySize(stronglyConnectedComponents(reciprocal))),
  };
};

/**
 * Compute the strongly connected components of the graph, following the
 * direction of every edge. Only components of at least `MIN_STRUCTURE_SIZE`
 * members are returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {{ structures: string[][] }} The components, each as a list of member ids.
 */
export const computeStrongComponents = (graph) => ({
  structures: sortStructures(filterBySize(stronglyConnectedComponents(graph))),
});

/**
 * Compute the weakly connected components of the graph, ignoring the direction
 * of every edge. Only components of at least `MIN_STRUCTURE_SIZE` members are
 * returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {{ structures: string[][] }} The components, each as a list of member ids.
 */
export const computeWeakComponents = (graph) => {
  const allComponents = connectedComponents(graph);
  const filteredComponents = filterBySize(allComponents);
  const structures = sortStructures(filteredComponents);
  return {
    structures,
  };
};
