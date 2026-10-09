import {
  computeNumberOfNodes,
  computeNumberOfEdges,
  computeNumberOfMutualEdges,
  computeNetworkDensity,
  computeNetworkCentralization,
  computeNetworkReciprocity,
  computeNetworkTransitivity,
} from "./metrics/sna/groupMetrics.js";
import {
  computeInDegreeCentrality,
  computeOutDegreeCentrality,
  computeDegreeCentrality,
  computeClosenessCentrality,
  computeBetweennessCentrality,
  computePageRank,
  computeHits,
} from "./metrics/sna/individualMetrics.js";

//////////////////////////////////////////////////////////////////////////////////
// GROUP LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/*
SNA GROUP LEVEL METRICS
- "numberOfNodes":         Number of members in the group.
- "numberOfEdges":         Number of directed preference edges.
- "numberOfMutualEdges":   Number of directed edges whose reverse edge exists.
- "networkDensity":        Proportion of possible edges that exist.
- "networkCentralization": Concentration of in-degree around the top node.
- "networkReciprocity":    Proportion of edges that are reciprocated.
- "networkTransitivity":   Global clustering coefficient.
 */
const GROUP_LEVEL_METRIC_KEYS = [
  "numberOfNodes",
  "numberOfEdges",
  "numberOfMutualEdges",
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
 * @returns {Record<string, number>} The group metrics keyed by
 *   `GROUP_LEVEL_METRIC_KEYS`.
 */
const computeGroupLevelMetrics = (graph) => {
  return {
    numberOfNodes: computeNumberOfNodes(graph),
    numberOfEdges: computeNumberOfEdges(graph),
    numberOfMutualEdges: computeNumberOfMutualEdges(graph),
    networkDensity: computeNetworkDensity(graph),
    networkCentralization: computeNetworkCentralization(graph),
    networkReciprocity: computeNetworkReciprocity(graph),
    networkTransitivity: computeNetworkTransitivity(graph),
  };
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
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is `["likes"]` or `["dislikes"]`, `columnIndex` is the metric
 *   name per column (in `GROUP_LEVEL_METRIC_KEYS` order), and `values[0][j]` is
 *   the score for metric `columnIndex[j]`.
 */
export const getGroupLevelMetrics = (graph) => {
  const metrics = computeGroupLevelMetrics(graph);

  return {
    rowIndex: [graph.getAttribute("typeOfPreference")],
    columnIndex: [...GROUP_LEVEL_METRIC_KEYS],
    values: [GROUP_LEVEL_METRIC_KEYS.map((key) => metrics[key])],
  };
};

/**
 * Compute individual-level SNA metrics for every node in a preference graph
 * and return them as a plain object mirroring a pandas DataFrame.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is the member id per row (in `graph.nodes()` order),
 *   `columnIndex` is the metric name per column (in
 *   `INDIVIDUAL_LEVEL_METRIC_KEYS` order), and `values[i][j]` is the score of
 *   member `rowIndex[i]` for metric `columnIndex[j]`.
 */
export const getIndividualLevelMetrics = (graph) => {
  const nodes = graph.nodes();
  const columnIndex = [...INDIVIDUAL_LEVEL_METRIC_KEYS];

  // graphology-metrics' centrality routines assume at least two nodes: degree
  // centrality divides by `order - 1`, and pagerank/hits fail to converge on a
  // single-node (or empty) graph. Degenerate groups have no structural
  // centralities, so report a zero row per node (or no rows at all) instead.
  if (nodes.length < 2) {
    const values = nodes.map(() => columnIndex.map(() => 0));
    return { rowIndex: nodes, columnIndex, values };
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

  // Explictly copy `nodes` to `memberIndices` to
  // signifiy that node names equal member indices.
  const memberIndices = [...nodes];

  // Compute metric values for each node and column.
  const values = nodes.map((node) =>
    columnIndex.map((key) => metricByNode[key][node]),
  );

  return {
    rowIndex: memberIndices,
    columnIndex,
    values,
  };
};
