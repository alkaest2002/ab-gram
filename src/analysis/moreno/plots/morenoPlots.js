import { singleSource } from "graphology-shortest-path";

//////////////////////////////////////////////////////////////////////////////////
// MORENO PLOTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the directed paths of every node in the graph.
 *
 * For each source node `A`, every other node `B` is reached following the
 * direction of the edges (so `A -> B` only counts when an edge actually points
 * from `A` to `B`). `B` is then filed under the bucket that matches the
 * shortest path from `A` to `B`:
 *
 * - `directed`:     a single edge — `A -> B`
 * - `oneHop`:       two edges — `A -> C -> B`
 * - `multipleHops`: three or more edges — `A -> C -> D -> B`
 * - `unreachable`:  no directed path exists from `A` to `B`
 *
 * Distances come from `graphology-shortest-path`, so every ordered pair is
 * classified by its shortest directed path length and appears in exactly one
 * bucket.
 *
 * @param {import("graphology").DirectedGraph} graph - The directed network.
 * @returns {Record<string, {directed: string[], oneHop: string[], multipleHops: string[], unreachable: string[]}>}
 *   An object keyed by each node's `nodeId` attribute. Each value lists the
 *   target node ids reachable from that source, split by the number of hops
 *   required.
 */
export const getDirectedPaths = (graph) => {
  const result = {};

  graph.forEachNode((source) => {
    // Shortest directed paths from `source` to every reachable node.
    // `paths[target]` is a node-id array (source first) or absent when
    // `target` cannot be reached.
    const paths = singleSource(graph, source);

    const categories = {
      directed: [],
      oneHop: [],
      multipleHops: [],
      unreachable: [],
    };

    graph.forEachNode((target) => {
      if (target === source) return;

      const path = paths[target];

      if (path === undefined) {
        categories.unreachable.push(target);
      } else if (path.length === 2) {
        // A -> B
        categories.directed.push(target);
      } else if (path.length === 3) {
        // A -> C -> B
        categories.oneHop.push(target);
      } else {
        // A -> ... -> B (two or more intermediate nodes)
        categories.multipleHops.push(target);
      }
    });

    // Key by the node's `nodeId` attribute so callers can retrieve a specific
    // node without walking the graph again.
    result[graph.getNodeAttribute(source, "nodeId")] = categories;
  });

  return result;
};

/**
 * Get the directed paths of a specific node from the precomputed map.
 *
 * This is a plain lookup into the result of {@link getDirectedPaths}, so it
 * runs in constant time and never re-runs the shortest-path computation.
 *
 * @param {Record<string, {directed: string[], oneHop: string[], multipleHops: string[], unreachable: string[]}>} directedPaths -
 *   The map returned by {@link getDirectedPaths}.
 * @param {string} nodeId - The `nodeId` of the node whose paths are requested.
 * @returns {{directed: string[], oneHop: string[], multipleHops: string[], unreachable: string[]} | undefined}
 *   The target node ids reachable from `nodeId`, split by the number of hops
 *   required, or `undefined` when the node is not present in the map.
 */
export const getNodeDirectedPaths = (directedPaths, nodeId) =>
  directedPaths[nodeId];
