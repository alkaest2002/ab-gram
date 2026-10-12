//////////////////////////////////////////////////////////////////////////////////
// MORENO PLOTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the shortest directed paths from `source` to every reachable node
 * using breadth-first search.
 *
 * This is a local reimplementation of `graphology-shortest-path`'s unweighted
 * `singleSource`, kept here so the Moreno plots don't have to pull that
 * CommonJS dependency into the Web Worker bundle.
 *
 * @param {import("graphology").DirectedGraph} graph - The directed network.
 * @param {string} source - The source node id.
 * @returns {Record<string, string[]>} Map of `target -> [source, ..., target]`
 *   for every node reachable from `source`. Unreachable nodes are absent.
 */
const singleSource = (graph, source) => {
  const paths = { [source]: [source] };

  // Breadth-first frontier: nodes discovered in the previous level.
  let frontier = [source];

  while (frontier.length > 0) {
    const nextFrontier = [];

    for (const node of frontier) {
      for (const neighbor of graph.outboundNeighbors(node)) {
        // First discovery is the shortest path in an unweighted graph.
        if (paths[neighbor] === undefined) {
          paths[neighbor] = paths[node].concat(neighbor);
          nextFrontier.push(neighbor);
        }
      }
    }

    frontier = nextFrontier;
  }

  return paths;
};

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
 * Path lengths come from a local breadth-first search, so every ordered pair
 * is classified by its shortest directed path length and appears in exactly
 * one bucket.
 *
 * @param {import("graphology").DirectedGraph} graph - The directed network.
 * @returns {Record<string, {directed: string[], oneHop: string[], multipleHops: string[], unreachable: string[]}>}
 *   An object keyed by each node's `memberId` attribute. Each value lists the
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

    // Key by the node's `memberId` attribute so callers can retrieve a specific
    // node without walking the graph again.
    result[graph.getNodeAttribute(source, "memberId")] = categories;
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
 * @param {string} memberId - The `memberId` of the node whose paths are requested.
 * @returns {{directed: string[], oneHop: string[], multipleHops: string[], unreachable: string[]} | undefined}
 *   The target node ids reachable from `memberId`, split by the number of hops
 *   required, or `undefined` when the node is not present in the map.
 */
export const getNodeDirectedPaths = (directedPaths, memberId) =>
  directedPaths[memberId];

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT CONFIGURATION
//////////////////////////////////////////////////////////////////////////////////

// Canvas and drawing constants, all expressed in SVG user units (the viewBox).
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

// Center of the concentric layout, where the ego (target) node sits.
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;

// Node circles: a fixed radius, with a label sized to fit inside.
const NODE_RADIUS = 16;
const LABEL_FONT_SIZE = 11;
const NODE_STROKE_WIDTH = 2;

// Nodes are drawn as white circles with a colored stroke; the label is dark.
const NODE_FILL_COLOR = "#FFFFFF";
const NODE_LABEL_COLOR = "#000000";

// Concentric ring layout: ring 1 sits this far from the center, and each
// further ring adds this gap on top of the previous one. Rings are numbered
// 1..4 (closest to farthest), matching the reachability buckets below.
const RING_1_RADIUS = 80;
const RING_GAP = 55;

// Direction marker: a small filled triangle pointing back toward the ego.
const TRIANGLE_SIZE = 8;

// Stroke colors, applied by the priority order documented in `buildMorenoEgoPlot`.
const DISLIKE_COLOR = "#FF0000";
const REACHABLE_COLOR = "#0000FF";
const UNREACHABLE_COLOR = "#000000";

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT SVG HELPERS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Escape a value for safe interpolation into XML/SVG markup.
 *
 * @param {string|number} value - The text to escape (e.g. a member id).
 * @returns {string} The XML-escaped text.
 */
const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Format a numeric SVG coordinate for output (two decimals is far more precise
 * than the canvas resolution requires).
 *
 * @param {number} value - The raw coordinate.
 * @returns {string} The rounded coordinate.
 */
const formatCoordinate = (value) => String(Math.round(value * 100) / 100);

/**
 * Radius of a ring in the concentric layout.
 *
 * Rings are numbered from 1 (closest to the ego) to 4 (outermost). Empty rings
 * keep their radial slot, so the distance of every other ring is unchanged when
 * an inner ring has no nodes.
 *
 * @param {number} ringIndex - The 1-based ring number.
 * @returns {number} The ring's radius, in SVG user units.
 */
const ringRadius = (ringIndex) => RING_1_RADIUS + (ringIndex - 1) * RING_GAP;

/**
 * Build the direction marker for a node that points back toward the ego.
 *
 * The triangle's tip sits on the node's inner edge (the side facing the ego)
 * and its base opens away from the ego, so it reads as "this member points at
 * the ego".
 *
 * @param {number} x - Horizontal center of the node.
 * @param {number} y - Vertical center of the node.
 * @param {string} color - The marker's fill color.
 * @returns {string} The triangle's SVG markup (empty when the node is the ego).
 */
const triangleMarkup = (x, y, color) => {
  const dx = CENTER_X - x;
  const dy = CENTER_Y - y;
  const length = Math.hypot(dx, dy);

  // The ego sits at the center, so there is no meaningful direction to point
  // toward; draw nothing.
  if (length === 0) return "";

  // Unit vector pointing from the node toward the ego.
  const ux = dx / length;
  const uy = dy / length;

  const tipX = x + ux * NODE_RADIUS;
  const tipY = y + uy * NODE_RADIUS;

  // The base opens away from the ego, behind the tip along the node's radius.
  const baseCenterX = tipX - ux * TRIANGLE_SIZE;
  const baseCenterY = tipY - uy * TRIANGLE_SIZE;

  // Perpendicular to the radius, for the base's two corners.
  const px = -uy;
  const py = ux;
  const half = TRIANGLE_SIZE / 2;

  return (
    `<polygon fill="${color}" points="` +
    `${formatCoordinate(tipX)},${formatCoordinate(tipY)} ` +
    `${formatCoordinate(baseCenterX + px * half)},${formatCoordinate(baseCenterY + py * half)} ` +
    `${formatCoordinate(baseCenterX - px * half)},${formatCoordinate(baseCenterY - py * half)}">` +
    `</polygon>`
  );
};

/**
 * Build the markup for a single node: a white circle with a colored stroke, its
 * member id centered inside, and (optionally) a direction marker pointing back
 * toward the ego.
 *
 * @param {number} x - Horizontal center of the node.
 * @param {number} y - Vertical center of the node.
 * @param {string} label - The member id to display.
 * @param {string} strokeColor - The circle's stroke color.
 * @param {boolean} hasTriangle - Whether to draw the direction marker.
 * @returns {string} The node's SVG markup.
 */
const nodeMarkup = (x, y, label, strokeColor, hasTriangle) =>
  `<circle r="${NODE_RADIUS}" fill="${NODE_FILL_COLOR}" stroke="${strokeColor}" stroke-width="${NODE_STROKE_WIDTH}" cx="${formatCoordinate(x)}" cy="${formatCoordinate(y)}"></circle>` +
  `<text font-size="${LABEL_FONT_SIZE}" text-anchor="middle" x="${formatCoordinate(x)}" y="${formatCoordinate(y)}" dominant-baseline="central" fill="${NODE_LABEL_COLOR}">${escapeXml(label)}</text>` +
  (hasTriangle ? triangleMarkup(x, y, strokeColor) : "");

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build an SVG "ego" plot centered on a single member.
 *
 * The member sits at the center and every other member is placed on one of
 * four concentric rings according to how many directed "likes" steps it takes
 * to reach them from the ego:
 *
 * - ring 1: reached directly (one edge)
 * - ring 2: reached through exactly one intermediate hop (two edges)
 * - ring 3: reached through two or more intermediate hops (three or more edges)
 * - ring 4: unreachable from the ego
 *
 * Within a ring, nodes are spaced at equal angular intervals; empty rings are
 * not skipped, so every ring keeps its radial position even when empty. Nodes
 * are stroked in priority order: red when they directly dislike the ego, blue
 * when they are reachable from the ego, and black otherwise. A node that
 * directly likes or dislikes the ego additionally carries a small triangle
 * pointing toward it.
 *
 * The SVG is built as a plain string (no DOM access), matching the other plot
 * builders.
 *
 * @param {string} memberId - The id of the ego (target) node.
 * @param {import("graphology").DirectedGraph} likesGraph - The directed likes
 *   graph (edges point from the choosing member to the chosen one).
 * @param {import("graphology").DirectedGraph} dislikesGraph - The directed
 *   dislikes graph (same edge direction convention).
 * @param {Record<string, {directed: string[], oneHop: string[], multipleHops: string[], unreachable: string[]}>} directedPaths -
 *   The map returned by {@link getDirectedPaths} for the likes graph, used to
 *   determine reachability and hop distance from `memberId` via
 *   {@link getNodeDirectedPaths}.
 * @returns {{memberId: string, svg: string}} The ego's id and its serialized
 *   SVG markup.
 */
export const buildMorenoEgoPlot = (
  memberId,
  likesGraph,
  dislikesGraph,
  directedPaths,
) => {
  const paths = getNodeDirectedPaths(directedPaths, memberId);

  // The four buckets, in ring order. `getNodeDirectedPaths` returns `undefined`
  // for an unknown member; degrade to an empty layout in that case.
  const rings = [
    paths?.directed ?? [],
    paths?.oneHop ?? [],
    paths?.multipleHops ?? [],
    paths?.unreachable ?? [],
  ];

  const reachable = new Set([...rings[0], ...rings[1], ...rings[2]]);

  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">`,
  );

  // The ego itself, always at the center. It trivially reaches itself, so it is
  // blue, and (having no self-edge) carries no direction marker.
  parts.push(nodeMarkup(CENTER_X, CENTER_Y, memberId, REACHABLE_COLOR, false));

  rings.forEach((ringNodes, ringIndex) => {
    const radius = ringRadius(ringIndex + 1);

    ringNodes.forEach((node, index) => {
      const angle = (index / ringNodes.length) * 2 * Math.PI - Math.PI / 2;
      const x = CENTER_X + radius * Math.cos(angle);
      const y = CENTER_Y + radius * Math.sin(angle);

      const dislikesEgo = dislikesGraph.hasDirectedEdge(node, memberId);
      const likesEgo = likesGraph.hasDirectedEdge(node, memberId);

      const strokeColor = dislikesEgo
        ? DISLIKE_COLOR
        : reachable.has(node)
          ? REACHABLE_COLOR
          : UNREACHABLE_COLOR;

      parts.push(nodeMarkup(x, y, node, strokeColor, likesEgo || dislikesEgo));
    });
  });

  parts.push(`</svg>`);

  return { memberId, svg: parts.join("") };
};

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT BATCH BUILDER
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build an SVG ego plot for every member of the group.
 *
 * This is the caching entry point for ego plots: the likes directed-paths map
 * is computed exactly once (via {@link getDirectedPaths}) and reused for every
 * member, so each plot only does an O(1) lookup via {@link getNodeDirectedPaths}
 * instead of re-running the all-pairs shortest-path computation.
 *
 * @param {{id: string}[]} members - The group members, in the order their plots
 *   should be returned.
 * @param {import("graphology").DirectedGraph} likesGraph - The directed likes
 *   graph (edges point from the choosing member to the chosen one).
 * @param {import("graphology").DirectedGraph} dislikesGraph - The directed
 *   dislikes graph (same edge direction convention).
 * @returns {Array<{memberId: string, svg: string}>} One ego plot per member, in
 *   the same order as `members`.
 */
export const getMorenoEgoPlots = (members, likesGraph, dislikesGraph) => {
  const directedPaths = getDirectedPaths(likesGraph);

  return members.map((member) =>
    buildMorenoEgoPlot(member.id, likesGraph, dislikesGraph, directedPaths),
  );
};
