import * as np from "numpy-ts";
import { toUndirected } from "graphology-operators";
import { simmelianStrength } from "graphology-metrics/edge";
import {
  degree,
  inDegree,
  outDegree,
  closeness,
  betweenness,
  pagerank,
  hits,
} from "graphology-metrics/centrality";

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
 * Compute the network centralization of a graph.
 *
 * Centralization measures how concentrated the nodes' centrality scores are
 * around the single most central node. It ranges from `0` (every node is
 * equally central, e.g. a fully symmetric graph) to `1` (all centrality
 * concentrated in one node, e.g. a star).
 *
 * Formally:
 *
 *   C = Σ (C_max - C_i) / (n - 1)²
 *
 * where `C_max` is the largest centrality score, `C_i` the score of node `i`,
 * `n` the number of nodes, and the sum runs over every node.
 *
 * The centrality used here is the in-degree: the number of members choosing
 * each member. In-degree centralization is normalized by `(n - 1)²` because a
 * star (one node receiving every choice) yields exactly `(n - 1)` differences
 * of size `(n - 1)`, and so reaches the maximum value `1`.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {number} The network centralization, in the range `[0, 1]`.
 */
const computeNetworkCentralization = (graph) => {
  const n = graph.order;
  if (n < 2) return 0;

  // Compute the in-degree of each node
  const centralities = np.array(
    Array.from({ length: n }, (_, i) => graph.inDegree(graph.nodes()[i])),
  );

  // Compute the maximum centrality
  const maxCentrality = np.max(centralities);

  // 1. Subtract maxCentrality (results in negative differences)
  // 2. Flip the sign with .neg() (or .negative()) to make them positive
  // 3. Sum the NDArray into a primitive JS number
  const sumDiffs = centralities.subtract(maxCentrality).negative().sum();

  // 4. Return normalized centralization
  return sumDiffs / Math.pow(n - 1, 2);
};

/**
 * Compute the network transitivity (global clustering coefficient) of a graph.
 *
 * Transitivity measures how likely two neighbors of a node are themselves
 * connected, i.e. the tendency of the network to form closed triangles. It
 * ranges from `0` (no closed triads, e.g. a tree or star) to `1` (every
 * connected triple is closed, e.g. a clique).
 *
 * Formally:
 *
 *   T = 3 × (number of closed triads) / (number of connected triples)
 *
 * A closed triad is a triangle: three nodes whose three pairwise edges all
 * exist. A connected triple is three nodes where at least two edges exist
 * (A-B and B-C, whether or not A-C exists). Each triangle contains three
 * connected triples, hence the factor 3.
 *
 * Because the graph is directed, transitivity is computed on its undirected
 * projection: two nodes are considered connected when an edge exists in either
 * direction.
 *
 * The closed-triad count is derived from the Simmelian strength of each edge
 * (the number of triangles an edge stands in), summed over every edge: the
 * total equals `3 ×` the number of triangles.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {number} The network transitivity, in the range `[0, 1]`.
 */
const computeNetworkTransitivity = (graph) => {
  // Transitivity is a property of the undirected projection: two nodes are
  // connected when an edge exists in either direction, and a mutual pair is a
  // single tie. Casting to undirected merges those mutual pairs into one edge.
  const undirected = toUndirected(graph);

  // Sum the Simmelian strength of every edge. An edge's strength is the number
  // of triangles it stands in. Each edge of a triangle counts for `1`.
  const strengths = simmelianStrength(undirected);
  const closedTriples = Object.values(strengths).reduce(
    (total, strength) => total + strength,
    0,
  );

  // Number of connected triples (2-paths): Σ C(deg, 2) over undirected degrees.
  let connectedTriples = 0;
  undirected.forEachNode((node) => {
    const degree = undirected.degree(node);
    if (degree >= 2) connectedTriples += (degree * (degree - 1)) / 2;
  });

  // Avoid a division by zero on graphs with no connected triples.
  if (connectedTriples === 0) return 0;

  return closedTriples / connectedTriples;
};

/**
 * Compute the network reciprocity of a directed graph.
 *
 * Reciprocity measures the tendency of directed edges to be reciprocated,
 * i.e., the proportion of edges that have a corresponding edge in the
 * opposite direction. It ranges from `0` (no reciprocal edges, e.g., a
 * strictly hierarchical network) to `1` (all edges are reciprocal, e.g., a
 * fully bidirectional network).
 *
 * Formally:
 *
 *   R = (number of reciprocated edges) / (total number of edges)
 *
 * A reciprocated edge A→B is one where the reverse edge B→A also exists.
 * In a mutual pair A↔B, both directed edges are counted as reciprocated,
 * contributing 2 to the numerator.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {number} The network reciprocity, in the range `[0, 1]`.
 */
const computeNetworkReciprocity = (graph) => {
  // Total number of directed edges
  const totalEdges = graph.size;

  // Avoid division by zero on empty graphs
  if (totalEdges === 0) return 0;

  // Count edges that have a reciprocal edge in the opposite direction
  let reciprocatedEdges = 0;
  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    if (graph.hasDirectedEdge(target, source)) {
      reciprocatedEdges++;
    }
  });

  return reciprocatedEdges / totalEdges;
};

/**
 * Compute the network density of a graph.
 *
 * Network density measures the proportion of possible edges that actually
 * exist. It ranges from `0` (no edges) to `1` (complete graph where every
 * node is connected to every other node).
 *
 * Formally:
 *
 *   For undirected: D = 2E / (N × (N - 1))
 *   For directed:   D = E / (N × (N - 1))
 *
 * where E is the number of edges and N is the number of nodes.
 *
 * @param {import("graphology").Graph} graph - The graph to analyse.
 * @returns {number} The network density, in the range `[0, 1]`.
 */
const computeNetworkDensity = (graph) => {
  const n = graph.order;
  const e = graph.size;

  // A graph must have at least 2 nodes to have possible edges
  if (n < 2) return 0;

  // Maximum possible edges depends on whether the graph is directed
  const maxEdges = graph.type === "directed" ? n * (n - 1) : (n * (n - 1)) / 2;

  return e / maxEdges;
};

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
  const numberOfEdges = graph.size;

  // Number of directed edges whose reverse edge also exists. A mutual pair
  // (A↔B) contributes two mutual edges, one in each direction.
  let numberOfMutualEdges = 0;
  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    if (graph.hasDirectedEdge(target, source)) numberOfMutualEdges++;
  });

  return {
    numberOfNodes: graph.order,
    numberOfEdges,
    numberOfMutualEdges,
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
  const hitsResult = hits(graph);

  // Compute individual-level metrics for each node.
  const metricByNode = {
    inDegreeCentrality: inDegree(graph),
    outDegreeCentrality: outDegree(graph),
    degreeCentrality: degree(graph),
    closenessCentrality: closeness(graph),
    betweennessCentrality: betweenness(graph),
    PageRank: pagerank(graph),
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
    values
  };
};
