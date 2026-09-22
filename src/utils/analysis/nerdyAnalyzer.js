import { DirectedGraph } from "graphology";

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

  return graph;
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

  return graph;
};

/**
 * Build a square adjacency matrix for a preference type.
 *
 * Rows and columns follow the order of `members`, so `matrix[i][j]` is `1`
 * when `members[i]` chose `members[j]` for the given preference and `0`
 * otherwise.
 *
 * @param {Member[]} members
 * @param {"likes" | "dislikes"} preference
 * @returns {number[][]} A `members.length` x `members.length` adjacency matrix.
 */
export const createAdjacencyMatrix = (members, preference) => {
  if (preference !== "likes" && preference !== "dislikes") {
    throw new Error(`Unknown preference "${preference}". Expected "likes" or "dislikes".`);
  }

  const indexById = new Map(members.map((member, index) => [member.id, index]));
  const size = members.length;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(0));

  members.forEach((member, i) => {
    for (const chosenId of member[preference]) {
      const j = indexById.get(chosenId);
      if (j !== undefined) matrix[i][j] = 1;
    }
  });

  return matrix;
};
