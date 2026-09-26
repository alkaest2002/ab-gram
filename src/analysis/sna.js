
import * as np from "numpy-ts";
import { DirectedGraph } from "graphology";
import { random } from 'graphology-layout';
import { toUndirected } from "graphology-operators";
import { simmelianStrength } from "graphology-metrics/edge";


//////////////////////////////////////////////////////////////////////////////////
// BASE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Graph helpers for the sociogram report.
 *
 * The group is represented as two directed graphs, one per preference type.
 * In both, each node is a member (keyed by the member id) and each edge points
 * from the choosing member to the chosen one.
 */

/**
 * @typedef {object} Member
 * @property {string} id - Unique member id (the node key).
 * @property {string} name - Display name.
 * @property {string[]} likes - Ids of the members this member prefers.
 * @property {string[]} dislikes - Ids of the members this member rejects.
 * @property {boolean} noLikes - Whether the member declared no likes.
 * @property {boolean} noDislikes - Whether the member declared no dislikes.
 */

/**
 * Add every member as a node (keyed by id, labelled with their name).
 *
 * @param {import("graphology").DirectedGraph} graph
 * @param {Member[]} members
 */
function addMemberNodes(graph, members) {
  for (const member of members) {
    graph.addNode(member.id, { name: member.name });
  }
}

/**
 * Build the directed graph of the members' type of preference.
 *
 * @param {Member[]} members - Members to include in the graph.
 * @param {string} typeOfPreference - The type of relationship to build (e.g. "likes", "dislikes").
 * @returns {import("graphology").DirectedGraph} A directed graph whose nodes
 *   are the members and whose edges connect each member to the members they link to
 */
const createLikesGraph = (members, typeOfPreference) => {
  // Create directed graph.
  const graph = new DirectedGraph();

  // Add nodes to graph.
  addMemberNodes(graph, members);

  // Add edges to graph.
  members.forEach(member => {
    member[typeOfPreference].forEach(typedId => {
      graph.mergeDirectedEdge(member.id, typedId);
    });
  });

  // Mark edges as mutual if it's the case.
  graph.forEachDirectedEdge((edge, source, target) => {
    const isMutual = graph.hasDirectedEdge(target, source);
    graph.setEdgeAttribute(edge, "isMutual", isMutual);
  });

  // Assign random layout to graph and return it.
  return random.assign(graph);
};

//////////////////////////////////////////////////////////////////////////////////
// GROUP LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

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
     Array.from({ length: n }, (_, i) => graph.inDegree(graph.nodes()[i]))
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
  // of triangles it stands in, so the total equals 3 × the number of triangles
  // (each triangle's 3 edges contribute 1 to the count, totaling 3×the triangle count).
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


//////////////////////////////////////////////////////////////////////////////////
// INDIVIDUAL LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute group-level metrics for the graph.
 *
 * @param {import("graphology").DirectedGraph} graph
 * @returns {Record<string, number>} A dictionary of group metrics
 */
export const getGroupLevelMetrics = (members) => {
  return members
};

/**
 * Compute individual metrics for each node in the graph.
 *
 * @param {import("graphology").DirectedGraph} graph
 * @returns {Record<string, number>} A dictionary of node metrics
 */
export const getIndividualLevelMetrics = (members) => {
  return members
};
