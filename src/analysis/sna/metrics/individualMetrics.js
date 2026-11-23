// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { reverse } from "graphology-operators";
import { coreNumber } from "graphology-cores";
import {
  degree,
  inDegree,
  outDegree,
  closeness,
  betweenness,
  pagerank,
  hits,
} from "graphology-metrics/centrality";

//////////////////////////////////////////////////////////////////////////////////////////
// SNA INDIVIDUAL-LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * In-degree centrality of every node (the normalized number of incoming edges).
 *
 * Formula:
 *
 *   $$ C_D^{\text{in}}(i) = \frac{d_{\text{in}}(i)}{n - 1} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> in-degree centrality.
 */
export const computeInDegreeCentrality = (graph) => inDegree(graph);

/**
 * Out-degree centrality of every node (the normalized number of outgoing edges).
 *
 * Formula:
 *
 *   $$ C_D^{\text{out}}(i) = \frac{d_{\text{out}}(i)}{n - 1} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> out-degree centrality.
 */
export const computeOutDegreeCentrality = (graph) => outDegree(graph);

/**
 * Degree centrality of every node (the normalized total number of edges).
 *
 * Formula:
 *
 *   $$ C_D(i) = \frac{d(i)}{n - 1} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> degree centrality.
 */
export const computeDegreeCentrality = (graph) => degree(graph);

/**
 * Closeness centrality of every node.
 *
 * Formula:
 *
 *   $$ C_C(i) = \frac{|R_i|}{n-1} \cdot \frac{|R_i|}{\sum_{j \in R_i} d(j,i)} $$
 *
 * where `R_i` contains the other nodes that can reach `i` and `d(j,i)` is
 * the shortest distance from `j` to `i`. The Wasserman–Faust factor is the
 * fraction of other nodes that can reach `i`. An empty `R_i` yields zero.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> closeness centrality.
 */
export const computeClosenessCentrality = (graph) => closeness(graph, { wassermanFaust: true });

/**
 * Outbound (broadcast) closeness: how readily each node can reach others.
 * Incoming paths in the reversed graph are outgoing paths in the original,
 * so the same Wasserman–Faust correction applies without changing the input.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> outbound closeness centrality.
 */
export const computeBroadcastClosenessCentrality = (graph) =>
  computeClosenessCentrality(reverse(graph));

/**
 * Betweenness centrality of every node.
 *
 * Formula:
 *
 *   $$ C_B(i) = \frac{\sum_{s,t \ne i,\;s \ne t,\;\sigma_{st}>0} \frac{\sigma_{st}(i)}{\sigma_{st}}}{(n-1)(n-2)} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> normalized directed betweenness (zero for n < 3).
 */
export const computeBetweennessCentrality = (graph) => betweenness(graph);

/**
 * PageRank score of every node.
 *
 * Formula:
 *
 *   $$ PR(i) = \frac{1 - \alpha}{n} + \alpha \sum_{j \in \text{In}(i)} \frac{PR(j)}{d_{\text{out}}(j)} + \frac{\alpha}{n}\sum_{j:\,d_{\text{out}}(j)=0} PR(j),\quad \alpha = 0.85 $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> PageRank score.
 */
export const computePageRank = (graph) => pagerank(graph);

/**
 * Compute HITS scores for every node, falling back to sentinel scores when the
 * power iteration cannot produce a result.
 *
 * Formula:
 *
 *   $$ a(i) \propto \sum_{j \in \text{In}(i)} h(j),\qquad h(i) \propto \sum_{j \in \text{Out}(i)} a(j) $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {{ authorities: Record<string, number>, hubs: Record<string, number> }}
 *   Authority and hub scores each sum to one on convergence. For an edgeless
 *   graph every score is `0`; on non-convergence every score is `NaN`.
 */
export const computeHits = (graph) => {
  const nodes = graph.nodes();

  // HITS's power iteration does not converge on a graph without edges, so
  // report zero authority/hub scores there instead of throwing.
  if (graph.size === 0) {
    return {
      authorities: Object.fromEntries(nodes.map((node) => [node, 0])),
      hubs: Object.fromEntries(nodes.map((node) => [node, 0])),
    };
  }

  try {
    return hits(graph);
  } catch (error) {
    if (error.message !== "graphology-metrics/centrality/hits: failed to converge.") throw error;
    console.error(error);
    return {
      authorities: Object.fromEntries(nodes.map((node) => [node, NaN])),
      hubs: Object.fromEntries(nodes.map((node) => [node, NaN])),
    };
  }
};

/**
 * Highest k for which each node belongs to a subgraph with minimum total
 * degree k. Both directions of a reciprocal nomination count.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Core number by node.
 */
export const computeCoreNumber = (graph) => coreNumber(graph);
