import { DirectedGraph } from "graphology";
import { random } from 'graphology-layout';

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


///////////// EXPORTS

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
