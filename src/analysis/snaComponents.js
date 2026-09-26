import { DirectedGraph } from "graphology";
import {
  connectedComponents,
  stronglyConnectedComponents,
} from "graphology-components";
import { createLikesGraph } from "./snaBase.js";


//////////////////////////////////////////////////////////////////////////////////
// BASE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Component categories produced by `computeSnaComponents`.
 *
 * Every value is a list of components, where a component is the list of member
 * ids that form it (e.g. `[["a", "b"], ["c", "d", "e"]]`).
 */
const COMPONENTS_KEYS = [
  "diads",
  "cliques",
  "strongComponentsWithReciprocalEdges",
  "strongComponents",
  "weakComponents",
];

/**
 * Minimum number of members a component must have to be reported.
 *
 * Only the categories listed here enforce a minimum size. `diads` are always
 * pairs, `cliques` start at triads, and `strongComponents` keep every strongly
 * connected component returned by graphology-components (including singletons).
 */
const MIN_CLIQUE_SIZE = 3;
const MIN_STRONG_RECIPROCAL_SIZE = 4;
const MIN_WEAK_SIZE = 4;


//////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the diads: pairs of members with a bidirectional relationship.
 *
 * A diad is an unordered pair `[a, b]` such that both `a → b` and `b → a`
 * exist. `createLikesGraph` flags every reciprocal edge with `isMutual`, so a
 * directed edge contributes a diad when `isMutual` is set. Keeping only the
 * edge whose source sorts before its target guarantees each pair is emitted
 * exactly once, with a deterministic member order.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @returns {string[][]} One `[a, b]` pair per reciprocal relationship.
 */
const computeDiads = (graph) => {
  const diads = [];

  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    if (source < target && attributes.isMutual) {
      diads.push([source, target]);
    }
  });

  return diads;
};

/**
 * Build the undirected adjacency of a graph: for every node, the set of nodes
 * it is connected to through an edge in either direction.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {Map<string, Set<string>>} Node id -> set of adjacent node ids.
 */
const buildUndirectedAdjacency = (graph) => {
  const adjacency = new Map();

  graph.forEachNode((node) => adjacency.set(node, new Set()));

  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    if (source === target) return;
    adjacency.get(source).add(target);
    adjacency.get(target).add(source);
  });

  return adjacency;
};

/**
 * Pick the Bron–Kerbosch pivot: the node of `P ∪ X` with the most neighbours
 * in `P`. Pivoting prunes the recursion and avoids reporting duplicate cliques.
 *
 * @param {string[]} p - Candidate nodes.
 * @param {string[]} x - Excluded nodes.
 * @param {Map<string, Set<string>>} adjacency - Undirected adjacency.
 * @returns {string} The pivot node.
 */
const pickCliquePivot = (p, x, adjacency) => {
  let best = null;
  let bestCount = -1;

  for (const node of [...p, ...x]) {
    const neighbors = adjacency.get(node);
    let count = 0;
    for (const candidate of p) {
      if (neighbors.has(candidate)) count += 1;
    }
    if (count > bestCount) {
      best = node;
      bestCount = count;
    }
  }

  return best;
};

/**
 * Enumerate the maximal cliques of an undirected graph using the Bron–Kerbosch
 * algorithm with pivoting.
 *
 * @param {Map<string, Set<string>>} adjacency - Undirected adjacency.
 * @returns {string[][]} The maximal cliques, each as a list of node ids.
 */
const findMaximalCliques = (adjacency) => {
  const cliques = [];

  const recurse = (r, p, x) => {
    if (p.length === 0 && x.length === 0) {
      cliques.push([...r]);
      return;
    }

    const pivot = pickCliquePivot(p, x, adjacency);
    const pivotNeighbors = adjacency.get(pivot);

    // Iterate over P \ N(pivot). The set is captured up front, then P and X are
    // updated after each recursive call as required by the algorithm.
    const vertices = p.filter((node) => !pivotNeighbors.has(node));

    for (const v of vertices) {
      const vNeighbors = adjacency.get(v);
      recurse(
        [...r, v],
        p.filter((node) => vNeighbors.has(node)),
        x.filter((node) => vNeighbors.has(node)),
      );
      p = p.filter((node) => node !== v);
      x = [...x, v];
    }
  };

  recurse([], [...adjacency.keys()], []);

  return cliques;
};

/**
 * Compute the cliques: maximal groups in which every node is directly adjacent
 * to every other node, ignoring the direction of connections.
 *
 * A clique is therefore a maximal complete subgraph of the graph's undirected
 * projection. Only cliques of at least `MIN_CLIQUE_SIZE` members are returned,
 * so triads and larger groups are reported while pairs are left to `diads`.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {string[][]} The cliques, each as a list of member ids.
 */
const computeCliques = (graph) => {
  const adjacency = buildUndirectedAdjacency(graph);

  return findMaximalCliques(adjacency).filter(
    (clique) => clique.length >= MIN_CLIQUE_SIZE,
  );
};

/**
 * Compute the strongly connected groups that only use reciprocal edges.
 *
 * The graph is reduced to its reciprocal edges — the ones `createLikesGraph`
 * flagged with `isMutual` — then its strongly connected components are computed.
 * Only components of at least `MIN_STRONG_RECIPROCAL_SIZE` members are returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @returns {string[][]} The components, each as a list of member ids.
 */
const computeStrongComponentsWithReciprocalEdges = (graph) => {
  const reciprocal = new DirectedGraph();

  graph.forEachNode((node) => reciprocal.addNode(node));

  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    if (attributes.isMutual) {
      reciprocal.mergeDirectedEdge(source, target);
    }
  });

  return stronglyConnectedComponents(reciprocal).filter(
    (component) => component.length >= MIN_STRONG_RECIPROCAL_SIZE,
  );
};

/**
 * Sort every component's members and the component list itself.
 *
 * This makes the output deterministic regardless of the graph's traversal
 * order, which is convenient for reports and tests.
 *
 * @param {string[][]} components - Components as lists of member ids.
 * @returns {string[][]} The same components, deterministically ordered.
 */
const sortComponents = (components) => {
  const sorted = components.map((component) => [...component].sort());

  sorted.sort((a, b) => {
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i += 1) {
      if (a[i] < b[i]) return -1;
      if (a[i] > b[i]) return 1;
    }
    return a.length - b.length;
  });

  return sorted;
};

//////////////////////////////////////////////////////////////////////////////////
// COMPUTE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the SNA components of a directed preference graph.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {Record<typeof COMPONENTS_KEYS[number], string[][]>} The components
 *   keyed by category, each value a list of member-id lists.
 */
const computeSnaComponents = (graph) => {
  const strongComponents = stronglyConnectedComponents(graph);
  const weakComponents = connectedComponents(graph).filter(
    (component) => component.length >= MIN_WEAK_SIZE,
  );

  return {
    diads: sortComponents(computeDiads(graph)),
    cliques: sortComponents(computeCliques(graph)),
    strongComponentsWithReciprocalEdges: sortComponents(
      computeStrongComponentsWithReciprocalEdges(graph),
    ),
    strongComponents: sortComponents(strongComponents),
    weakComponents: sortComponents(weakComponents),
  };
};


//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the SNA components for the likes and dislikes graphs and return them
 * as a plain object mirroring a pandas DataFrame.
 *
 * The group is represented by two directed graphs (one per preference type),
 * so the result has one row per preference and one column per component
 * category.
 *
 * @param {import("./snaBase.js").Member[]} members - The members of the group being
 *   analysed.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: string[][][][] }}
 *   `rowIndex` is `["likes", "dislikes"]`, `columnIndex` is the component
 *   category per column (in `COMPONENTS_KEYS` order), and `values[i][j]` is the
 *   list of components (each component being a list of member ids) of
 *   preference type `rowIndex[i]` for category `columnIndex[j]`.
 */
export const getSnaComponents = (members) => {
  const preferenceTypes = ["likes", "dislikes"];

  const componentsByPreference = preferenceTypes.map((typeOfPreference) => {
    const graph = createLikesGraph(members, typeOfPreference);
    return computeSnaComponents(graph);
  });

  return {
    rowIndex: [...preferenceTypes],
    columnIndex: [...COMPONENTS_KEYS],
    values: componentsByPreference.map((components) =>
      COMPONENTS_KEYS.map((key) => components[key]),
    ),
  };
};
