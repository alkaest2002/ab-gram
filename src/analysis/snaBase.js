import { DirectedGraph } from "graphology";
import { random } from "graphology-layout";

//////////////////////////////////////////////////////////////////////////////////
// BASE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Graph helpers shared by the SNA modules (metrics, components, plots).
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
export const createLikesGraph = (members, typeOfPreference) => {
  // Create directed graph.
  const graph = new DirectedGraph();

  // Tag the graph with its preference type so consumers (metrics, components,
  // plots) can report which of "likes"/"dislikes" it represents.
  graph.setAttribute("typeOfPreference", typeOfPreference);

  // Add nodes to graph.
  addMemberNodes(graph, members);

  // Add edges to graph.
  members.forEach((member) => {
    member[typeOfPreference].forEach((typedId) => {
      graph.mergeDirectedEdge(member.id, typedId);
    });
  });

  // Mark edges as mutual if it's the case.
  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    const isMutual = graph.hasDirectedEdge(target, source);
    graph.setEdgeAttribute(edge, "isMutual", isMutual);
  });

  // Assign random layout to the graph.
  random.assign(graph);

  return graph;
};
