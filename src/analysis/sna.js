import { DirectedGraph } from "graphology";
import { random } from 'graphology-layout';
/**
 * Graph helpers for the sociogram report.
 *
 * The group is represented as two directed graphs, one per preference type.
 * In both, each node is a member (keyed by the member id) and each edge points
 * from the choosing member to the chosen one. The same choices can also be
 * expressed as an adjacency matrix for numeric analysis.
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
 * Build the directed graph of the members' likes.
 *
 * @param {Member[]} members
 * @returns {import("graphology").DirectedGraph} A directed graph whose nodes
 *   are the members and whose edges connect each member to the members they
 *   like.
 */
export const createLikesGraph = (members) => {
  const graph = new DirectedGraph();
  addMemberNodes(graph, members);

  for (const member of members) {
    for (const likedId of member.likes) {
      if (graph.hasDirectedEdge(member.id, likedId)) continue;
      graph.addDirectedEdge(member.id, likedId);
    }
  }

  return random.assign(graph);
};

/**
 * Build the directed graph of the members' dislikes.
 *
 * @param {Member[]} members
 * @returns {import("graphology").DirectedGraph} A directed graph whose nodes
 *   are the members and whose edges connect each member to the members they
 *   dislike.
 */
export const createDislikesGraph = (members) => {
  const graph = new DirectedGraph();
  addMemberNodes(graph, members);

  for (const member of members) {
    for (const dislikedId of member.dislikes) {
      if (graph.hasDirectedEdge(member.id, dislikedId)) continue;
      graph.addDirectedEdge(member.id, dislikedId);
    }
  }

  return random.assign(graph);
};


/**
 * Compute group-level metrics for the graph.
 *
 * @param {import("graphology").DirectedGraph} graph
 * @returns {Record<string, number>} A dictionary of group metrics
 */
export const getGroupLevelMetrics = (graph) => {

};

/**
 * Compute individual metrics for each node in the graph.
 *
 * @param {import("graphology").DirectedGraph} graph
 * @returns {Record<string, number>} A dictionary of node metrics
 */
export const getIndividualLevelMetrics = (graph) => {

};
