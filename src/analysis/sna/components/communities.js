// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import * as np from 'numpy-ts';

/**
 * Directed community significance test.
 *
 * Preserves in each null graph:
 *   - The same nodes
 *   - Every node's in-degree and out-degree
 *   - The same number of mutual pairs
 *   - The same number of one-way edges
 *
 * Changes from the previous version:
 *   - Edges are keyed with integers (a * n + b) instead of JSON strings.
 *     Node IDs are mapped to indices 0..n-1 once, up front.
 *   - Validation of each null graph is optional (`validate`, off by default).
 *   - Each null graph keeps swapping until a target number of swaps has been
 *     ACCEPTED (not just attempted), so every null is well mixed.
 *     If a null cannot reach half of that target within the attempt cap, the
 *     test cannot claim significance (`significant` is false).
 */

/**
 * Integer key of the directed edge `a -> b`, for node indices in `0..n-1`.
 *
 * @param {number} a - Source node index.
 * @param {number} b - Target node index.
 * @param {number} n - Number of nodes.
 * @returns {number} The edge key `a * n + b`.
 */
const key = (a, b, n) => a * n + b;

/**
 * Count the number of unordered pairs connected in both directions. Runs in
 * O(E) time.
 *
 * @param {Set<number>} set - Edge keys of the graph.
 * @param {number[][]} edges - Edges as `[source, target]` index pairs.
 * @param {number} n - Number of nodes.
 * @returns {number} The number of mutual pairs.
 */
function countMutualPairs(set, edges, n) {
  let count = 0;
  for (const [a, b] of edges) {
    if (a < b && set.has(key(b, a, n))) count++;
  }
  return count;
}

/**
 * Deterministic PRNG (mulberry32), with the same contract as Math.random.
 *
 * @param {number} seed - The seed.
 * @returns {() => number} A function returning a float in `[0, 1)`.
 */
function mulberry32(seed) {
  let a = seed >>> 0;

  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Run Louvain several times and keep the best result, with its communities.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph.
 * @param {number} [runs=5] - Number of Louvain restarts.
 * @param {() => number} [rng=Math.random] - Random number generator.
 * @returns {{ q: number, communities: string[][] }} The best modularity `q` and
 *   its communities.
 */
function bestLouvain(graph, runs = 5, rng = Math.random) {
  let best = null;

  for (let i = 0; i < runs; i++) {
    const result = louvain.detailed(graph, { rng });

    if (best === null || result.modularity > best.modularity) {
      best = {
        modularity: result.modularity,
        assignments: { ...result.communities }
      };
    }
  }

  const groups = new Map();

  for (const node of graph.nodes()) {
    let id = best.assignments[node];
    if (id === undefined || id === null) id = node; // singleton fallback
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(node);
  }

  return {
    q: best.modularity,
    communities: Array.from(groups.values())
  };
}

/**
 * Compute the Louvain communities without the significance test.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph.
 * @param {{ runs?: number, seed?: number }} [options] - Louvain options.
 * @returns {{ communities: string[][], q: number }} The partition and its
 *   modularity `q`.
 */
export function getLouvainCommunities(graph, { runs = 5, seed } = {}) {
  if (graph.size === 0) {
    return {
      communities: graph.nodes().map((node) => [node]),
      q: 0
    };
  }

  const rng = seed === undefined ? Math.random : mulberry32(seed);
  const { q, communities } = bestLouvain(graph, runs, rng);

  return { communities, q };
}

/**
 * Check that a null graph kept node/edge counts, every node's in/out degree
 * and the number of mutual pairs. Only runs when validation is enabled.
 *
 * @param {import("graphology").DirectedGraph} original - The observed graph.
 * @param {import("graphology").DirectedGraph} randomized - The null graph.
 * @param {Map<string, number>} index - Node id -> integer index.
 * @param {number} n - Number of nodes.
 * @returns {void}
 */
function validateNullGraph(original, randomized, index, n) {
  if (original.order !== randomized.order ||
      original.size !== randomized.size) {
    throw new Error('Null graph changed the node or edge count.');
  }

  for (const node of original.nodes()) {
    if (!randomized.hasNode(node)) {
      throw new Error(`Null graph is missing node ${node}.`);
    }

    if (
      original.inDegree(node) !== randomized.inDegree(node) ||
      original.outDegree(node) !== randomized.outDegree(node)
    ) {
      throw new Error(`Degree mismatch for node ${node}.`);
    }
  }

  const toEdges = (g) =>
    g.edges().map(e => [index.get(g.source(e)), index.get(g.target(e))]);

  const oe = toEdges(original);
  const re = toEdges(randomized);
  const os = new Set(oe.map(([a, b]) => key(a, b, n)));
  const rs = new Set(re.map(([a, b]) => key(a, b, n)));

  if (countMutualPairs(os, oe, n) !== countMutualPairs(rs, re, n)) {
    throw new Error('Null graph changed the number of mutual pairs.');
  }
}

/**
 * Degree-preserving directed edge swaps on integer edges, rejecting any swap
 * that changes the number of mutual pairs.
 *
 * Keeps swapping until `target` swaps are accepted or `cap` attempts are used.
 *
 * @param {number[][]} edgesIn - Edges as `[source, target]` index pairs.
 * @param {number} n - Number of nodes.
 * @param {number} target - Target number of accepted swaps.
 * @param {number} cap - Maximum number of attempts.
 * @param {() => number} rng - Random number generator.
 * @returns {{ edges: number[][], accepted: number }} The shuffled edges and the
 *   number of accepted swaps.
 */
function nullEdges(edgesIn, n, target, cap, rng) {
  const edges = edgesIn.map(e => e.slice());
  const set = new Set(edges.map(([a, b]) => key(a, b, n)));
  let accepted = 0;

  if (edges.length < 2) return { edges, accepted };

  for (let t = 0; t < cap && accepted < target; t++) {
    const i = Math.floor(rng() * edges.length);
    let j = Math.floor(rng() * (edges.length - 1));
    if (j >= i) j++;

    const [a, b] = edges[i];
    const [c, d] = edges[j];

    // Avoid self-loops and overlapping endpoints.
    if (a === d || c === b || a === c || b === d) continue;

    const e1 = key(a, d, n);
    const e2 = key(c, b, n);

    // Reject duplicate edges. (The removed edges a->b and c->d cannot equal
    // e1 or e2, because the endpoints are all distinct.)
    if (set.has(e1) || set.has(e2)) continue;

    // Exact change in mutual pairs for (a->b, c->d) -> (a->d, c->b):
    // a pair is lost if the reverse of a removed edge exists, and gained if
    // the reverse of a new edge exists. O(1).
    const delta =
      (set.has(key(b, a, n)) ? -1 : 0) +
      (set.has(key(d, c, n)) ? -1 : 0) +
      (set.has(key(d, a, n)) ? 1 : 0) +
      (set.has(key(b, c, n)) ? 1 : 0);

    if (delta !== 0) continue;

    // Commit.
    set.delete(key(a, b, n));
    set.delete(key(c, d, n));
    set.add(e1);
    set.add(e2);
    edges[i] = [a, d];
    edges[j] = [c, b];
    accepted++;
  }

  return { edges, accepted };
}

/**
 * Run the directed community significance test.
 *
 * @param {import("graphology").DirectedGraph} graph - The observed graph.
 * @param {object} [options] - Test configuration.
 * @param {number} [options.nulls=500] - Number of null graphs.
 * @param {number} [options.runs=5] - Louvain restarts per graph.
 * @param {number} [options.swaps=10] - Target accepted swaps per edge.
 * @param {number} [options.alpha=0.05] - Significance level.
 * @param {number} [options.seed] - Seed for reproducible results.
 * @param {boolean} [options.validate=false] - Validate every null graph.
 * @returns {object} The significance result, including `q`, `threshold`, `p`,
 *   `significant`, and `communities`.
 */
export function gate(
  graph,
  {
    nulls = 500,
    runs = 5,
    swaps = 10,      // target accepted swaps per edge in each null graph
    alpha = 0.05,
    seed,
    validate = false // check every null graph (slow; for testing)
  } = {}
) {
  if (graph.type !== 'directed') {
    throw new Error('Expected a directed graph.');
  }

  if (graph.multi) {
    throw new Error('Multigraphs are not supported.');
  }

  if (graph.someNode(node => graph.hasEdge(node, node))) {
    throw new Error('Self-loops are not supported.');
  }

  if (
    !Number.isInteger(nulls) || nulls < 1 ||
    !Number.isInteger(runs) || runs < 1 ||
    !Number.isInteger(swaps) || swaps < 1 ||
    !(alpha > 0 && alpha < 1)
  ) {
    throw new Error('Invalid nulls, runs, swaps, or alpha.');
  }

  const rng = seed === undefined ? Math.random : mulberry32(seed);

  // Map node IDs to integers 0..n-1 once.
  const nodes = graph.nodes();
  const n = nodes.length;
  const index = new Map(nodes.map((node, i) => [node, i]));

  const edges = graph.edges().map(e => [
    index.get(graph.source(e)),
    index.get(graph.target(e))
  ]);

  const originalSet = new Set(edges.map(([a, b]) => key(a, b, n)));
  const mutualPairs = countMutualPairs(originalSet, edges, n);
  const oneWayEdges = edges.length - 2 * mutualPairs;

  // Mixing target: accepted swaps per null graph, and an attempt cap.
  const target = edges.length * swaps;
  const cap = target * 100;

  // 1. Observed Q and communities.
  const observed = bestLouvain(graph, runs, rng);

  // 2. Null distribution.
  const nullQs = [];
  let totalAccepted = 0;
  let minAccepted = Infinity;

  for (let i = 0; i < nulls; i++) {
    const { edges: ne, accepted } = nullEdges(edges, n, target, cap, rng);
    totalAccepted += accepted;
    if (accepted < minAccepted) minAccepted = accepted;

    const randomized = new Graph({ type: 'directed' });
    for (const node of nodes) randomized.addNode(node);
    for (const [a, b] of ne) randomized.addEdge(nodes[a], nodes[b]);

    if (validate) validateNullGraph(graph, randomized, index, n);

    nullQs.push(bestLouvain(randomized, runs, rng).q);
  }

  // 3. (1 - alpha) quantile of the null modularities.
  const threshold = Number(
    np.percentile(np.array(nullQs), 100 * (1 - alpha))
  );

  // 4. One-sided empirical p-value.
  const exceed = nullQs.filter(value => value >= observed.q).length;
  const p = (exceed + 1) / (nulls + 1);

  // 5. A null graph that could not reach half the swap target is not a fair
  //    reference, so significance cannot be claimed.
  const mixed = minAccepted >= target / 2;

  return {
    q: observed.q,
    threshold,
    p,
    significant: p <= alpha && mixed,

    communities: observed.communities,
    communityCount: observed.communities.length,

    nodes: n,
    edges: edges.length,
    mutualPairs,
    oneWayEdges,

    // Null-model diagnostics.
    mixed,
    minAcceptedSwaps: minAccepted,
    avgAcceptedSwaps: totalAccepted / nulls,
    targetSwaps: target,

    nulls,
    runs,
    swaps,
    alpha,
    seed,
    validate
  };
}
