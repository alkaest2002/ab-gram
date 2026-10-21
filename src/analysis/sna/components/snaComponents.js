import { DirectedGraph } from "graphology";
import {
  connectedComponents,
  stronglyConnectedComponents,
} from "graphology-components";


//////////////////////////////////////////////////////////////////////////////////
// BASE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Component categories produced by `computeSnaComponents`, in output order.
 */
const COMPONENTS_KEYS = /** @type {const} */ ([
  "dyads",
  "cliques",
  "strongComponentsWithReciprocalEdges",
  "strongComponents",
  "weakComponents",
]);

/**
 * @typedef {typeof COMPONENTS_KEYS[number]} ComponentsKey
 */

/**
 * Every value is a list of components, where a component is the list of member
 * ids that form it (e.g. `[["a", "b"], ["c", "d", "e"]]`).
 *
 * @typedef {Record<ComponentsKey, string[][]>} SnaComponents
 */

/**
 * Per-member presence statistics. Keyed by member id; each member maps every
 * component type to the fraction (0–1) of that type's components that contain
 * the member.
 *
 * @typedef {Record<string, Record<ComponentsKey, number>>} MemberInComponentStats
 */

/**
 * Minimum number of members a component must have to be reported.
 *
 * Dyads are always pairs (two members); every other component category must
 * have at least `MIN_COMPONENT_SIZE` members.
 */
const MIN_COMPONENT_SIZE = 3;


//////////////////////////////////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Keep only the components with at least `MIN_COMPONENT_SIZE` members.
 *
 * Shared by every category (other than dyads) so the size rule lives in one
 * place.
 *
 * @param {string[][]} components - Components as lists of member ids.
 * @returns {string[][]} The components that are large enough to be reported.
 */
const filterBySize = (components) =>
  components.filter((component) => component.length >= MIN_COMPONENT_SIZE);

/**
 * Visit every reciprocal edge of the graph.
 *
 * A reciprocal edge is a directed edge that `createLikesGraph` flagged with
 * `isMutual`. Self-loops are never visited: a member cannot form a
 * relationship with itself, so this is the single place where they are
 * excluded for every category that relies on reciprocity.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @param {(source: string, target: string) => void} callback - Called once per
 *   reciprocal, non-loop edge.
 */
const forEachMutualEdge = (graph, callback) => {
  graph.forEachDirectedEdge((_edge, attributes, source, target) => {
    if (source !== target && attributes.isMutual) {
      callback(source, target);
    }
  });
};

/**
 * Build the undirected adjacency of a graph: for every node, the set of nodes
 * it is connected to through an edge in either direction. Self-loops are
 * ignored.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {Map<string, Set<string>>} Node id -> set of adjacent node ids.
 */
const buildUndirectedAdjacency = (graph) => {
  const adjacency = new Map();

  graph.forEachNode((node) => {
    // `neighbors` merges in- and out-neighbours; a self-loop lists the node
    // itself, so it is removed.
    const neighbors = new Set(graph.neighbors(node));
    neighbors.delete(node);
    adjacency.set(node, neighbors);
  });

  return adjacency;
};


//////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the dyads: pairs of members with a bidirectional relationship.
 *
 * A dyad is an unordered pair `[a, b]` such that both `a → b` and `b → a`
 * exist. `createLikesGraph` flags every reciprocal edge with `isMutual`, so a
 * directed edge contributes a dyad when `isMutual` is set. Keeping only the
 * edge whose source sorts before its target guarantees each pair is emitted
 * exactly once, with a deterministic member order.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @returns {string[][]} One `[a, b]` pair per reciprocal relationship.
 */
const computeDyads = (graph) => {
  const dyads = [];

  forEachMutualEdge(graph, (source, target) => {
    // Source must sort before target to emit each pair exactly once.
    if (source < target) {
      dyads.push([source, target]);
    }
  });

  return dyads;
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
 * projection. Only cliques of at least `MIN_COMPONENT_SIZE` members are
 * returned, so triads and larger groups are reported while pairs are left to
 * `dyads`.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {string[][]} The cliques, each as a list of member ids.
 */
const computeCliques = (graph) =>
  filterBySize(findMaximalCliques(buildUndirectedAdjacency(graph)));

/**
 * Compute the strongly connected groups that only use reciprocal edges.
 *
 * The graph is reduced to its reciprocal edges — the ones `createLikesGraph`
 * flagged with `isMutual` — then its strongly connected components are computed.
 * Only components of at least `MIN_COMPONENT_SIZE` members are returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph built by
 *   `createLikesGraph`.
 * @returns {string[][]} The components, each as a list of member ids.
 */
const computeStrongComponentsWithReciprocalEdges = (graph) => {
  const reciprocal = new DirectedGraph();

  graph.forEachNode((node) => reciprocal.addNode(node));

  forEachMutualEdge(graph, (source, target) => {
    reciprocal.mergeDirectedEdge(source, target);
  });

  return filterBySize(stronglyConnectedComponents(reciprocal));
};

/**
 * Compute the strongly connected components of the graph, following the
 * direction of every edge. Only components of at least `MIN_COMPONENT_SIZE`
 * members are returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {string[][]} The components, each as a list of member ids.
 */
const computeStrongComponents = (graph) =>
  filterBySize(stronglyConnectedComponents(graph));

/**
 * Compute the weakly connected components of the graph, ignoring the direction
 * of every edge. Only components of at least `MIN_COMPONENT_SIZE` members are
 * returned.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {string[][]} The components, each as a list of member ids.
 */
const computeWeakComponents = (graph) =>
  filterBySize(connectedComponents(graph));

/**
 * Sort every component's members and the component list itself.
 *
 * Each component's members are sorted alphabetically, then the component list
 * is ordered by length (smallest first). Components of equal length are ordered
 * lexicographically so the output stays deterministic regardless of the
 * graph's traversal order, which is convenient for reports and tests.
 *
 * @param {string[][]} components - Components as lists of member ids.
 * @returns {string[][]} The same components, deterministically ordered.
 */
const sortComponents = (components) => {
  const sorted = components.map((component) => [...component].sort());

  sorted.sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;

    for (let i = 0; i < a.length; i += 1) {
      if (a[i] < b[i]) return -1;
      if (a[i] > b[i]) return 1;
    }
    return 0;
  });

  return sorted;
};

//////////////////////////////////////////////////////////////////////////////////
// COMPUTE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Computation for each component category. Keyed by `COMPONENTS_KEYS` so the
 * output shape and the list of categories cannot drift apart.
 *
 * @type {Record<ComponentsKey, (graph: import("graphology").DirectedGraph) => string[][]>}
 */
const COMPONENTS = {
  dyads: computeDyads,
  cliques: computeCliques,
  strongComponentsWithReciprocalEdges: computeStrongComponentsWithReciprocalEdges,
  strongComponents: computeStrongComponents,
  weakComponents: computeWeakComponents,
};

/**
 * Count of a single component type's components that contain `member`.
 *
 * @param {string} member - The member id.
 * @param {string[][]} components - The components of one type.
 * @returns {number} The count of components. A type with no
 *   components has nothing to be present in, so it reports `0`.
 */
const presenceCount = (member, components) =>
  components.length === 0
    ? 0
    : components.filter((component) => component.includes(member)).length;

/**
 * Percentage of a single component type's components that contain `member`.
 *
 * @param {string} member - The member id.
 * @param {string[][]} components - The components of one type.
 * @returns {number} The presence fraction in `[0, 1]`. A type with no
 *   components has nothing to be present in, so it reports `0`.
 */
const presencePercentage = (member, components) =>
  components.length === 0
    ? 0
    : components.filter((component) => component.includes(member)).length /
      components.length;

/**
 * Compute, for every member, the fraction of each component type's components
 * that contain the member.
 *
 * @param {string[]} members - The member ids (the graph's nodes).
 * @param {SnaComponents} components - The components keyed by type.
 * @returns {MemberInComponentStats} Member id -> component type -> presence fraction.
 */
const computeMemberInComponents = (members, components) =>
  Object.fromEntries(
    members.map((member) => [
      member,
      Object.fromEntries(
        Object.entries(components).map(([type, list]) => [
          type,
          { cnt: presenceCount(member, list), pct: presencePercentage(member, list) },
        ]),
      ),
    ]),
  );

/**
 * Compute the SNA components of a directed preference graph and, for every
 * member, the fraction of each component type's components that contain it.
 *
 * @param {import("graphology").DirectedGraph} graph - The likes graph.
 * @returns {SnaComponents & { memberInComponents: MemberInComponentStats }} The components
 *   keyed by category, each value a list of member-id lists, plus the
 *   `memberInComponents` presence fractions.
 */
const computeSnaComponents = (graph) => {
  const components = /** @type {SnaComponents} */ (
    Object.fromEntries(
      COMPONENTS_KEYS.map((key) => [key, sortComponents(COMPONENTS[key](graph))]),
    )
  );

  return {
    ...components,
    memberInComponents: computeMemberInComponents(graph.nodes(), components),
  };
};


//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the SNA components of a single preference graph.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph`.
 * @returns {SnaComponents & { memberInComponents: MemberInComponentStats }} The components
 *   keyed by component type (a component being a list of member ids), plus
 *   `memberInComponents`: per member, the fraction of each type's components that
 *   contain them.
 */
export const getSnaComponents = (graph) => computeSnaComponents(graph);
