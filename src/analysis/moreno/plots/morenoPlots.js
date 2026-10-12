import { singleSource } from "graphology-shortest-path";

//////////////////////////////////////////////////////////////////////////////////
// MORENO PLOTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * List every node reachable from each node, grouped by how many directed hops
 * it takes to get there.
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
 *   An object keyed by source node id. Each value lists the target node ids
 *   reachable from that source, split by the number of hops required.
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

    result[source] = categories;
  });

  return result;
};
