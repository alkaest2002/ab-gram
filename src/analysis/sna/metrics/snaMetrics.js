// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeRankedScores } from "@/analysis/common/commonMetrics";
import {
  computeNumberOfNodes,
  computeNumberOfEdges,
  computeNumberOfMutualEdges,
  computeMinOutDegree,
  computeMaxOutDegree,
  computeMedianOutDegree,
  computeIQROutDegree,
  computeMinInDegree,
  computeMaxInDegree,
  computeMedianInDegree,
  computeIQRInDegree,
  computeNetworkDensity,
  computeNetworkCentralization,
  computeNetworkReciprocity,
  computeNetworkTransitivity,
} from "./groupMetrics.js";
import {
  computeInDegreeCentrality,
  computeOutDegreeCentrality,
  computeDegreeCentrality,
  computeClosenessCentrality,
  computeBetweennessCentrality,
  computePageRank,
  computeHits,
} from "./individualMetrics.js";

//////////////////////////////////////////////////////////////////////////////////
// GROUP LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/*
SNA GROUP LEVEL METRICS
- "numberOfNodes":         Number of members in the group.
- "numberOfEdges":         Number of directed preference edges.
- "numberOfMutualEdges":   Number of directed edges whose reverse edge exists.
- "minOutDegree":          Minimum out-degree across members.
- "maxOutDegree":          Maximum out-degree across members.
- "medianOutDegree":       Median out-degree across members.
- "IQROutDegree":          Interquartile range of out-degrees.
- "minInDegree":           Minimum in-degree across members.
- "maxInDegree":           Maximum in-degree across members.
- "medianInDegree":        Median in-degree across members.
- "IQRInDegree":           Interquartile range of in-degrees.
- "networkDensity":        Proportion of possible edges that exist.
- "networkCentralization": Concentration of in-degree around the top node.
- "networkReciprocity":    Proportion of edges that are reciprocated.
- "networkTransitivity":   Global clustering coefficient.
 */
const GROUP_LEVEL_METRIC_KEYS = [
  "numberOfNodes",
  "numberOfEdges",
  "numberOfMutualEdges",
  "minOutDegree",
  "maxOutDegree",
  "medianOutDegree",
  "IQROutDegree",
  "minInDegree",
  "maxInDegree",
  "medianInDegree",
  "IQRInDegree",
  "networkDensity",
  "networkCentralization",
  "networkReciprocity",
  "networkTransitivity",
];

/**
 * Compute the group-level metrics for a single preference graph.
 *
 * Aggregates the node/edge counts and the density, centralization, reciprocity
 * and transitivity of one graph — either the "likes" or the "dislikes" graph.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @returns {import("numpy-ts").NDArray}
 *   A `1` x `GROUP_LEVEL_METRIC_KEYS.length` matrix holding, in column order, the
 *   group-level metrics.
 */
const computeGroupLevelMetrics = (graph) => {
  return np.array([
    [
      computeNumberOfNodes(graph),
      computeNumberOfEdges(graph),
      computeNumberOfMutualEdges(graph),
      computeMinOutDegree(graph),
      computeMaxOutDegree(graph),
      computeMedianOutDegree(graph),
      computeIQROutDegree(graph),
      computeMinInDegree(graph),
      computeMaxInDegree(graph),
      computeMedianInDegree(graph),
      computeIQRInDegree(graph),
      computeNetworkDensity(graph),
      computeNetworkCentralization(graph),
      computeNetworkReciprocity(graph),
      computeNetworkTransitivity(graph),
    ],
  ]);
};

//////////////////////////////////////////////////////////////////////////////////
// INDIVIDUAL LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

const INDIVIDUAL_LEVEL_METRIC_KEYS = [
  "inDegreeCentrality",
  "outDegreeCentrality",
  "degreeCentrality",
  "closenessCentrality",
  "betweennessCentrality",
  "PageRank",
  "hitsAuthority",
  "hitsHub",
];

/**
 * Compute individual-level SNA metrics for every node in a preference graph.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @returns {import("numpy-ts").NDArray}
 *   A `size` x `INDIVIDUAL_LEVEL_METRIC_KEYS.length` matrix. Rows are nodes
 *   (aligned with `graph.nodes()` order) and columns are the metrics in
 *   `INDIVIDUAL_LEVEL_METRIC_KEYS` order.
 */
const computeIndividualLevelMetrics = (graph) => {
  const nodes = graph.nodes();
  const size = nodes.length;

  // graphology-metrics' centrality routines assume at least two nodes: degree
  // centrality divides by `order - 1`, and pagerank/hits fail to converge on a
  // single-node (or empty) graph. Degenerate groups have no structural
  // centralities, so report a zero row per node (or no rows at all) instead.
  if (size < 2) {
    return np.full([size, INDIVIDUAL_LEVEL_METRIC_KEYS.length], 0);
  }

  // HITS is computed once and split into its two scores (authority and hub).
  const hitsResult = computeHits(graph);

  // Compute individual-level metrics for each node.
  const metricByNode = {
    inDegreeCentrality: computeInDegreeCentrality(graph),
    outDegreeCentrality: computeOutDegreeCentrality(graph),
    degreeCentrality: computeDegreeCentrality(graph),
    closenessCentrality: computeClosenessCentrality(graph),
    betweennessCentrality: computeBetweennessCentrality(graph),
    PageRank: computePageRank(graph),
    hitsAuthority: hitsResult.authorities,
    hitsHub: hitsResult.hubs,
  };

  // Stack every metric as a column, keeping the numpy array until export.
  const columns = INDIVIDUAL_LEVEL_METRIC_KEYS.map((key) =>
    np.array(nodes.map((node) => metricByNode[key][node])),
  );

  return np.column_stack(columns);
};

//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the SNA group-level metrics for a single preference graph and return
 * them as a plain object mirroring a pandas DataFrame.
 *
 * The group is represented by one directed graph, so the result has exactly
 * one row (labelled by the graph's preference type) and one column per metric.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph` (tagged with its `typeOfPreference`).
 * @returns {{
 *   ids: string[],
 *   metrics: string[],
 *   rawValuesById: number[][],
 *   rawValuesByMetric: number[][],
 *   rankedValuesById: number[][],
 *   rankedValuesByMetric: number[][],
 * }}
 *   `ids` is the single preference-type label (the graph's `typeOfPreference`
 *   attribute) and `metrics` is the metric name per column (in
 *   `GROUP_LEVEL_METRIC_KEYS` order). `rawValuesById` and `rankedValuesById`
 *   hold the raw and ranked scores with rows indexed by `ids` and columns by
 *   `metrics`; `rawValuesByMetric` and `rankedValuesByMetric` hold the same data
 *   transposed (rows indexed by `metrics`, columns by `ids`).
 */
export const getGroupLevelMetrics = (graph) => {
  const rawValues = computeGroupLevelMetrics(graph);
  const rankedValues = computeRankedScores(rawValues);

  return {
    ids: [graph.getAttribute("typeOfPreference")],
    metrics: [...GROUP_LEVEL_METRIC_KEYS],
    rawValuesById: rawValues.tolist(),
    rawValuesByMetric: rawValues.T.tolist(),
    rankedValuesById: rankedValues.tolist(),
    rankedValuesByMetric: rankedValues.T.tolist(),
  };
};

/**
 * Compute individual-level SNA metrics for every node in a preference graph
 * and return them as a plain object mirroring a pandas DataFrame.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @returns {{
 *   ids: string[],
 *   metrics: string[],
 *   rawValuesById: number[][],
 *   rawValuesByMetric: number[][],
 *   rankedValuesById: number[][],
 *   rankedValuesByMetric: number[][],
 * }}
 *   `ids` is the member id per row (in `graph.nodes()` order) and `metrics` is
 *   the metric name per column (in `INDIVIDUAL_LEVEL_METRIC_KEYS` order).
 *   `rawValuesById[i][j]` and `rankedValuesById[i][j]` hold the raw and ranked
 *   score of member `ids[i]` for metric `metrics[j]`. `rawValuesByMetric` and
 *   `rankedValuesByMetric` hold the same data transposed (rows indexed by
 *   `metrics`, columns by `ids`).
 */
export const getIndividualLevelMetrics = (graph) => {
  const nodes = graph.nodes();
  const rawValues = computeIndividualLevelMetrics(graph);
  const rankedValues = computeRankedScores(rawValues);

  return {
    ids: nodes,
    metrics: [...INDIVIDUAL_LEVEL_METRIC_KEYS],
    rawValuesById: rawValues.tolist(),
    rawValuesByMetric: rawValues.T.tolist(),
    rankedValuesById: rankedValues.tolist(),
    rankedValuesByMetric: rankedValues.T.tolist(),
  };
};
