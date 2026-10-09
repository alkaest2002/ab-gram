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
// SNA INDIVIDUAL-LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/**
 * In-degree centrality of every node (the normalized number of incoming edges).
 *
 * Formula:
 *
 *   $$ C_D^{\text{in}}(i) = \frac{d_{\text{in}}(i)}{n - 1} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> in-degree centrality.
 */
export const computeInDegreeCentrality = (graph) => inDegree(graph);

/**
 * Out-degree centrality of every node (the normalized number of outgoing edges).
 *
 * Formula:
 *
 *   $$ C_D^{\text{out}}(i) = \frac{d_{\text{out}}(i)}{n - 1} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> out-degree centrality.
 */
export const computeOutDegreeCentrality = (graph) => outDegree(graph);

/**
 * Degree centrality of every node (the normalized total number of edges).
 *
 * Formula:
 *
 *   $$ C_D(i) = \frac{d(i)}{n - 1} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> degree centrality.
 */
export const computeDegreeCentrality = (graph) => degree(graph);

/**
 * Closeness centrality of every node.
 *
 * Formula:
 *
 *   $$ C_C(i) = \frac{|R_i|}{\sum_{j \in R_i} d(i,j)} $$
 *
 * where `R_i` are the nodes reachable from `i` and `d(i,j)` is the shortest-path
 * distance.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> closeness centrality.
 */
export const computeClosenessCentrality = (graph) => closeness(graph);

/**
 * Betweenness centrality of every node.
 *
 * Formula:
 *
 *   $$ C_B(i) = \frac{\sum_{s \neq i \neq t} \frac{\sigma_{st}(i)}{\sigma_{st}}}{(n-1)(n-2)} $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> betweenness centrality.
 */
export const computeBetweennessCentrality = (graph) => betweenness(graph);

/**
 * PageRank score of every node.
 *
 * Formula:
 *
 *   $$ PR(i) = \frac{1 - \alpha}{n} + \alpha \sum_{j \in \text{In}(i)} \frac{PR(j)}{d_{\text{out}}(j)},\quad \alpha = 0.85 $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> PageRank score.
 */
export const computePageRank = (graph) => pagerank(graph);

/**
 * Compute HITS scores for every node, falling back to zero scores when the
 * graph has no edges (where HITS's power iteration does not converge).
 *
 * Formula:
 *
 *   $$ a(i) = \sum_{j \in \text{In}(i)} h(j),\qquad h(i) = \sum_{j \in \text{Out}(i)} a(j) $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {{ authorities: Record<string, number>, hubs: Record<string, number> }}
 *   The authority and hub scores keyed by node id.
 */
export const computeHits = (graph) => {
  const nodes = graph.nodes();

  // HITS's power iteration does not converge on a graph without edges, so
  // report zero authority/hub scores there instead of throwing.
  if (graph.size === 0) {
    return {
      authorities: Object.fromEntries(nodes.map((node) => [node, 0])),
      hubs: Object.fromEntries(nodes.map((node) => [node, 0])),
    };
  }

  return hits(graph);
};

/**
 * HITS authority score of every node.
 *
 * Formula:
 *
 *   $$ a(i) = \sum_{j \in \text{In}(i)} h(j) $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> authority score.
 */
export const computeHitsAuthority = (graph) => computeHits(graph).authorities;

/**
 * HITS hub score of every node.
 *
 * Formula:
 *
 *   $$ h(i) = \sum_{j \in \text{Out}(i)} a(j) $$
 *
 * @param {import("graphology").DirectedGraph} graph - The graph to analyse.
 * @returns {Record<string, number>} Node id -> hub score.
 */
export const computeHitsHub = (graph) => computeHits(graph).hubs;
