// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

//////////////////////////////////////////////////////////////////////////////////
// MORENO PLOTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the shortest directed distances from `source` to every reachable
 * node using breadth-first search.
 *
 * This is a local reimplementation of `graphology-shortest-path`'s unweighted
 * `singleSource`, kept here so the Moreno plots don't have to pull that
 * CommonJS dependency into the Web Worker bundle.
 *
 * Edges are followed in their own direction only (the "likes" relation points
 * from the choosing member to the chosen one), so a node is reachable only when
 * the source's choices lead to it transitively.
 *
 * Nodes are identified by their `memberId` attribute rather than their graph
 * key, so the returned map is keyed by member id.
 *
 * @param {import("graphology").DirectedGraph} graph - The directed network.
 * @param {string} source - The graph key of the source node.
 * @returns {Record<string, number>} Map of `target memberId -> distance` (in
 *   directed edges) for every node reachable from `source`. Unreachable nodes
 *   are absent.
 */
const singleSource = (graph, source) => {
  const sourceId = graph.getNodeAttribute(source, "memberId");
  const distances = { [sourceId]: 0 };

  // Breadth-first frontier holds graph keys (what the traversal API consumes);
  // distances are stored by `memberId`.
  let frontier = [source];

  while (frontier.length > 0) {
    const nextFrontier = [];

    for (const node of frontier) {
      const nodeId = graph.getNodeAttribute(node, "memberId");
      const nodeDistance = distances[nodeId];

      // Follow only outgoing edges, so a path respects the edge direction.
      for (const neighbor of graph.outboundNeighbors(node)) {
        const neighborId = graph.getNodeAttribute(neighbor, "memberId");

        // First discovery is the shortest distance in an unweighted graph.
        if (distances[neighborId] === undefined) {
          distances[neighborId] = nodeDistance + 1;
          nextFrontier.push(neighbor);
        }
      }
    }

    frontier = nextFrontier;
  }

  return distances;
};

/**
 * Compute the reachability categories of every node in the graph, treating
 * likes edges as directed and dislikes as a rejection that overrides any likes
 * path.
 *
 * For each source node `A`, every other node `B` is reached by following the
 * "likes" edges in their own direction. `B` is then filed under the bucket that
 * matches the shortest directed likes path from `A` to `B`:
 *
 * - `mutuality`:    `A` likes `B` and `B` likes `A` back
 * - `oneHop`:       `A` likes `B`, but `B` does not like `A`
 * - `twoHops`:      reached through exactly one intermediary — `A → C → B`
 * - `multipleHops`: reached through two or more intermediaries — `A → C → D → B`
 * - `difficultToReach`: no directed likes path leads from `A` to `B`, or `A`
 *                       dislikes `B`
 *
 * Distances come from a local breadth-first search over outgoing likes edges,
 * and a node the source dislikes is always placed in `difficultToReach`, so every
 * ordered pair appears in exactly one bucket.
 *
 * @param {import("graphology").DirectedGraph} likesGraph - The directed likes
 *   network (edges point from the choosing member to the chosen one).
 * @param {import("graphology").DirectedGraph} dislikesGraph - The directed
 *   dislikes network (same edge direction convention; nodes are keyed by the
 *   same member ids).
 * @returns {Record<string, {mutuality: string[], oneHop: string[], twoHops: string[], multipleHops: string[], difficultToReach: string[]}>}
 *   An object keyed by each node's `memberId` attribute. Each value lists the
 *   target node ids, split by their relationship to that source.
 */
export const getNodePaths = (likesGraph, dislikesGraph) => {
  const result = {};

  likesGraph.forEachNode((source) => {
    const sourceId = likesGraph.getNodeAttribute(source, "memberId");

    // Shortest directed distances from `source` to every reachable node over
    // the likes graph. `distances[targetId]` is the number of edges on the
    // shortest directed likes path, or absent when `targetId` cannot be reached.
    const distances = singleSource(likesGraph, source);

    const categories = {
      mutuality: [],
      oneHop: [],
      twoHops: [],
      multipleHops: [],
      difficultToReach: [],
    };

    likesGraph.forEachNode((target) => {
      const targetId = likesGraph.getNodeAttribute(target, "memberId");
      if (targetId === sourceId) return;

      const distance = distances[targetId];

      // A node the source dislikes is treated as difficult to reach regardless
      // of any likes path, so it lands on the outer ring and can be stroked red.
      if (
        dislikesGraph.hasDirectedEdge(source, target) ||
        distance === undefined
      ) {
        categories.difficultToReach.push(targetId);
      } else if (distance === 1) {
        // A directly likes the target; mutual only when the feeling is
        // reciprocated.
        if (likesGraph.hasDirectedEdge(target, source)) {
          categories.mutuality.push(targetId);
        } else {
          categories.oneHop.push(targetId);
        }
      } else if (distance === 2) {
        // A -> C -> B
        categories.twoHops.push(targetId);
      } else {
        // A -> C -> D -> B (two or more intermediaries)
        categories.multipleHops.push(targetId);
      }
    });

    // Key by the node's `memberId` attribute so callers can retrieve a specific
    // node without walking the graph again.
    result[sourceId] = categories;
  });

  return result;
};

/**
 * Get the reachability categories of a specific node from the precomputed map.
 *
 * This is a plain lookup into the result of {@link getNodePaths}, so it runs in
 * constant time and never re-runs the shortest-path computation.
 *
 * @param {Record<string, {mutuality: string[], oneHop: string[], twoHops: string[], multipleHops: string[], difficultToReach: string[]}>} nodePaths -
 *   The map returned by {@link getNodePaths}.
 * @param {string} memberId - The `memberId` of the node whose categories are requested.
 * @returns {{mutuality: string[], oneHop: string[], twoHops: string[], multipleHops: string[], difficultToReach: string[]} | undefined}
 *   The target node ids, split by their relationship to `memberId`, or
 *   `undefined` when the node is not present in the map.
 */
export const getNodePathsFor = (nodePaths, memberId) => nodePaths[memberId];

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT CONFIGURATION
//////////////////////////////////////////////////////////////////////////////////

// Node circles: a fixed radius, with a label sized to fit inside.
const NODE_RADIUS = 13;
const LABEL_FONT_SIZE = 10;
const NODE_STROKE_WIDTH = 2;

// Concentric ring layout: ring 1 sits this far from the center, and each
// further ring adds this gap on top of the previous one. Rings are numbered
// 1..5 (closest to farthest), matching the reachability buckets below. The gap
// is deliberately roomy so adjacent rings have clearance for many nodes.
const RING_1_RADIUS = 80;
const RING_GAP = 70;
const RING_COUNT = 5;

// Empty margin left around the outermost boundary so no node or dashed circle
// is clipped by the canvas edge.
const CANVAS_PADDING = 60;

// The dashed boundary closing the outermost ring sits half a ring-gap beyond
// that ring; padding beyond it sizes the square canvas.
const OUTERMOST_BOUNDARY_RADIUS =
  RING_1_RADIUS + (RING_COUNT - 1) * RING_GAP + RING_GAP / 2;

// Center of the concentric layout, where the ego (target) node sits.
const CENTER_X = OUTERMOST_BOUNDARY_RADIUS + CANVAS_PADDING;
const CENTER_Y = CENTER_X;
const CANVAS_WIDTH = CENTER_X * 2;
const CANVAS_HEIGHT = CENTER_Y * 2;

// Direction marker: a small filled triangle pointing back toward the ego.
const TRIANGLE_SIZE = 8;

// Stroke, fill, and label colors, per node kind. The ego at the center is drawn
// dark gray over a light gray fill with a dark label; the remaining nodes use a
// colored stroke — blue for like, red for dislike, gray for neutral — over a
// white fill. Like and dislike labels inherit the stroke color, while the
// neutral label is darkened for legibility.
const EGO_STROKE_COLOR = "#333333";
const EGO_FILL_COLOR = "#FFFFFF";
const EGO_LABEL_COLOR = "#333333";
const DISLIKE_STROKE_COLOR = "#FF0000";
const DISLIKE_FILL_COLOR = "#FFFFFF";
const REACHABLE_STROKE_COLOR = "#0000FF";
const REACHABLE_FILL_COLOR = "#FFFFFF";
const NEUTRAL_STROKE_COLOR = "#333333";
const NEUTRAL_FILL_COLOR = "#FFFFFF";
const NEUTRAL_LABEL_COLOR = "#333333";

// Dashed boundary circles separating the concentric regions.
const BOUNDARY_COLOR = "#333333";
const BOUNDARY_STROKE_WIDTH = 1;
const BOUNDARY_DASH = "4 4";

// Region names, ordered from the innermost ring to the outermost ring. The
// center (where the ego node lies) is intentionally not labelled, so these five
// names correspond one-to-one with the five rings in `buildMorenoEgoPlot`.
const REGION_LABELS = ["0MU", "0HP", "1HP", "2HP+", "DTR"];
const REGION_LABEL_FONT_SIZE = 13;
const REGION_LABEL_COLOR = "#333333";

// Angular gap (in radians) reserved at the 12 o'clock position so the stacked
// region labels never collide with a node. Nodes are distributed over the
// remaining arc, leaving a node-free corridor along the vertical line from the
// center up to the north edge.
const NORTH_GAP = Math.PI / 3;

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
 * Rings are numbered from 1 (closest to the ego) to 5 (outermost). Empty rings
 * keep their radial slot, so the distance of every other ring is unchanged when
 * an inner ring has no nodes.
 *
 * @param {number} ringIndex - The 1-based ring number.
 * @returns {number} The ring's radius, in SVG user units.
 */
const ringRadius = (ringIndex) => RING_1_RADIUS + (ringIndex - 1) * RING_GAP;

/**
 * Radii of the dashed boundary circles that separate the concentric regions.
 *
 * The layout has six regions — the center (ego) plus five rings — separated by
 * six boundaries: one enclosing the ego, one between each adjacent pair of
 * rings, and one closing the outermost ring. Each boundary sits halfway between
 * its two neighbouring tracks, so it never intersects a node.
 *
 * @returns {number[]} Boundary radii, ordered from innermost to outermost.
 */
const ringBoundaries = () => {
  const boundaries = [ringRadius(1) / 2];

  for (let ring = 1; ring < RING_COUNT; ring += 1) {
    boundaries.push((ringRadius(ring) + ringRadius(ring + 1)) / 2);
  }

  boundaries.push(ringRadius(RING_COUNT) + RING_GAP / 2);

  return boundaries;
};

/**
 * Build the markup for one dashed boundary circle.
 *
 * @param {number} radius - The boundary's radius, in SVG user units.
 * @returns {string} The boundary's SVG markup.
 */
const ringBoundaryMarkup = (radius) =>
  `<circle cx='${CENTER_X}' cy='${CENTER_Y}' r='${formatCoordinate(radius)}' fill='none' stroke='${BOUNDARY_COLOR}' stroke-width='${BOUNDARY_STROKE_WIDTH}' stroke-dasharray='${BOUNDARY_DASH}'></circle>`;

/**
 * Build a direction marker for a node, pointing either toward or away from the
 * ego.
 *
 * The triangle's base lies tangent to the node's circle and its tip extends just
 * past the circumference in the direction of the relationship's target. An
 * inward marker (`towardEgo`) tips toward the center, reading as "this member
 * points at the ego"; an outward marker tips away from the center, reading as
 * "the ego points at this member".
 *
 * @param {number} x - Horizontal center of the node.
 * @param {number} y - Vertical center of the node.
 * @param {string} color - The marker's fill color.
 * @param {boolean} towardEgo - Whether the tip faces the ego (inward) or away
 *   from it (outward).
 * @returns {string} The triangle's SVG markup (empty when the node is the ego).
 */
const triangleMarkup = (x, y, color, towardEgo) => {
  const dx = CENTER_X - x;
  const dy = CENTER_Y - y;
  const length = Math.hypot(dx, dy);

  // The ego sits at the center, so there is no meaningful direction to point
  // toward; draw nothing.
  if (length === 0) return "";

  // Unit vector pointing from the node toward the relationship's target: the
  // ego for an inward marker, the node itself (away from the center) for an
  // outward marker.
  const sign = towardEgo ? 1 : -1;
  const ux = (sign * dx) / length;
  const uy = (sign * dy) / length;

  // The point on the node's circumference facing the target, where the base of
  // the triangle is tangent to the circle.
  const baseX = x + ux * NODE_RADIUS;
  const baseY = y + uy * NODE_RADIUS;

  // Perpendicular to the radius: the tangent line along which the base lies.
  const px = -uy;
  const py = ux;
  const half = TRIANGLE_SIZE / 2;

  // The tip extends toward the target, just past the circumference.
  const tipX = baseX + ux * TRIANGLE_SIZE;
  const tipY = baseY + uy * TRIANGLE_SIZE;

  return (
    `<polygon fill='${color}' points='` +
    `${formatCoordinate(tipX)},${formatCoordinate(tipY)} ` +
    `${formatCoordinate(baseX + px * half)},${formatCoordinate(baseY + py * half)} ` +
    `${formatCoordinate(baseX - px * half)},${formatCoordinate(baseY - py * half)}'>` +
    `</polygon>`
  );
};

/**
 * Build the markup for a single node: a circle with a colored stroke and fill,
 * its member id centered inside, and up to two direction markers (one pointing
 * toward the ego for the node's feeling, one pointing away for the ego's
 * feeling).
 *
 * @param {number} x - Horizontal center of the node.
 * @param {number} y - Vertical center of the node.
 * @param {string} label - The member id to display.
 * @param {string} strokeColor - The circle's stroke color.
 * @param {string} fillColor - The circle's fill color.
 * @param {string} labelColor - The label's fill color.
 * @param {string|null} inwardColor - Fill color of the inward marker (the node
 *   feels about the ego), or `null` for no marker.
 * @param {string|null} outwardColor - Fill color of the outward marker (the ego
 *   feels about the node), or `null` for no marker.
 * @returns {string} The node's SVG markup.
 */
const nodeMarkup = (x, y, label, strokeColor, fillColor, labelColor, inwardColor, outwardColor) =>
  `<circle r='${NODE_RADIUS}' fill='${fillColor}' stroke='${strokeColor}' stroke-width='${NODE_STROKE_WIDTH}' cx='${formatCoordinate(x)}' cy='${formatCoordinate(y)}'></circle>` +
  `<text font-size='${LABEL_FONT_SIZE}' text-anchor='middle' x='${formatCoordinate(x)}' y='${formatCoordinate(y)}' dominant-baseline='central' fill='${labelColor}'>${escapeXml(label)}</text>` +
  (inwardColor ? triangleMarkup(x, y, inwardColor, true) : "") +
  (outwardColor ? triangleMarkup(x, y, outwardColor, false) : "");

/**
 * Build the markup for the region labels.
 *
 * The five region names are stacked vertically along the 12 o'clock line (the
 * vertical axis running from the center up to the north). Each name is centered
 * on the top point of its ring, so reading from the center outward gives the
 * rings in order (innermost first, outermost last). Nodes are kept out of the
 * reserved `NORTH_GAP` corridor around that line, so the names never overlap a
 * node.
 *
 * @returns {string} The region labels' SVG markup.
 */
const regionLabelsMarkup = () =>
  REGION_LABELS.map(
    (label, index) =>
      `<text font-size='${REGION_LABEL_FONT_SIZE}' text-anchor='middle' x='${formatCoordinate(CENTER_X)}' y='${formatCoordinate(CENTER_Y - ringRadius(index + 1))}' dominant-baseline='central' fill='${REGION_LABEL_COLOR}'>${escapeXml(label)}</text>`,
  ).join("");

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build an SVG "ego" plot centered on a single member.
 *
 * The member sits at the center and every other member is placed on one of five
 * concentric rings according to how many directed "likes" steps it takes to
 * reach them from the ego:
 *
 * - ring 1: mutual like (the ego and the member like each other) — `0MU`
 * - ring 2: liked directly, but not back (one edge) — `0HP`
 * - ring 3: reached through exactly one intermediary (two edges) — `1HP`
 * - ring 4: reached through two or more intermediaries (three or more edges) —
 *   `2HP+`
 * - ring 5: difficult to reach from the ego, including nodes the ego dislikes — `DTR`
 *
 * Within a ring, nodes are spaced at equal angular intervals and each ring
 * starts at a random angle so the regions don't all align; empty rings are not
 * skipped, so every ring keeps its radial position even when empty. A fixed
 * angular corridor is reserved at the 12 o'clock position and left node-free, so
 * the region names can be stacked vertically along that line — each name
 * centered on the top point of its ring, reading from the center out to the
 * north (innermost first, outermost last). Dashed boundary circles separate the
 * concentric regions, and the square canvas is padded so the outermost boundary
 * stays clear of the edges. Nodes are colored in priority order: red when the
 * node is disliked by the ego or dislikes the ego, blue when the node is liked
 * by the ego or likes the ego, and gray otherwise (neutral/difficult to reach). The ego
 * at the center is light gray, stroke and fill. A direct like
 * or dislike between the node and the ego additionally carries a small triangle
 * tangent to the node's circle: pointing toward the ego when the node feels
 * about the ego, and away from the ego when the ego likes or dislikes the node.
 *
 * The SVG is built as a plain string (no DOM access), matching the other plot
 * builders.
 *
 * @param {string} memberId - The id of the ego (target) node.
 * @param {import("graphology").DirectedGraph} likesGraph - The directed likes
 *   graph (edges point from the choosing member to the chosen one).
 * @param {import("graphology").DirectedGraph} dislikesGraph - The directed
 *   dislikes graph (same edge direction convention).
 * @param {Record<string, {mutuality: string[], oneHop: string[], twoHops: string[], multipleHops: string[], difficultToReach: string[]}>} nodePaths -
 *   The map returned by {@link getNodePaths} for the likes/dislikes graphs,
 *   used to determine reachability and hop distance from `memberId` via
 *   {@link getNodePathsFor}.
 * @returns {{memberId: string, svg: string}} The ego's id and its serialized
 *   SVG markup.
 */
export const buildMorenoEgoPlot = (
  memberId,
  likesGraph,
  dislikesGraph,
  nodePaths,
) => {
  const paths = getNodePathsFor(nodePaths, memberId);

  // The five buckets, in ring order. `getNodePathsFor` returns `undefined`
  // for an unknown member; degrade to an empty layout in that case.
  const rings = [
    paths?.mutuality ?? [],
    paths?.oneHop ?? [],
    paths?.twoHops ?? [],
    paths?.multipleHops ?? [],
    paths?.difficultToReach ?? [],
  ];

  const parts = [];

  parts.push(
    `<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='${CANVAS_WIDTH}' height='${CANVAS_HEIGHT}' viewBox='0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}'>`,
  );

  // Draw the dashed boundaries separating the concentric regions first, so the
  // nodes are drawn on top of them.
  ringBoundaries().forEach((radius) => parts.push(ringBoundaryMarkup(radius)));

  // The ego itself, always at the center, drawn light gray. It has no self-edge,
  // so it carries no direction marker.
  parts.push(
    nodeMarkup(CENTER_X, CENTER_Y, memberId, EGO_STROKE_COLOR, EGO_FILL_COLOR, EGO_LABEL_COLOR, null, null),
  );

  rings.forEach((ringNodes, ringIndex) => {
    const radius = ringRadius(ringIndex + 1);

    // Give each ring its own random starting angle so the regions don't all
    // align on the same ray out from the center. The north corridor reserved for
    // the region labels is skipped, so no node ever lands on the 12 o'clock
    // line where the stacked names are drawn.
    const available = 2 * Math.PI - NORTH_GAP;
    // One random value is consumed per ring (even an empty one, keeping the
    // mocked sequence in the tests deterministic). The phase only varies within
    // a single slot so the whole ring stays inside the safe arc; a wider phase
    // would let the last node wrap around into the reserved north corridor.
    const slot =
      ringNodes.length > 0 ? available / ringNodes.length : available;
    const offset = Math.random() * slot;

    ringNodes.forEach((node, index) => {
      const angle =
        -Math.PI / 2 +
        NORTH_GAP / 2 +
        offset +
        (index / ringNodes.length) * available;
      const x = CENTER_X + radius * Math.cos(angle);
      const y = CENTER_Y + radius * Math.sin(angle);

      // A relationship exists independently in each direction: the node's
      // feeling toward the ego and the ego's feeling toward the node.
      const likesEgo = likesGraph.hasDirectedEdge(node, memberId);
      const dislikesEgo = dislikesGraph.hasDirectedEdge(node, memberId);
      const egoLikes = likesGraph.hasDirectedEdge(memberId, node);
      const egoDislikes = dislikesGraph.hasDirectedEdge(memberId, node);

      // Dislike (in either direction) wins over like, which wins over the
      // remaining neutral nodes. Each kind pairs a stroke, fill, and label color.
      const [strokeColor, fillColor, labelColor] = dislikesEgo || egoDislikes
        ? [DISLIKE_STROKE_COLOR, DISLIKE_FILL_COLOR, DISLIKE_STROKE_COLOR]
        : likesEgo || egoLikes
          ? [REACHABLE_STROKE_COLOR, REACHABLE_FILL_COLOR, REACHABLE_STROKE_COLOR]
          : [NEUTRAL_STROKE_COLOR, NEUTRAL_FILL_COLOR, NEUTRAL_LABEL_COLOR];

      // Inward marker: the node likes (blue) or dislikes (red) the ego.
      const inwardColor = dislikesEgo
        ? DISLIKE_STROKE_COLOR
        : likesEgo
          ? REACHABLE_STROKE_COLOR
          : null;

      // Outward marker: the ego likes (blue) or dislikes (red) the node.
      const outwardColor = egoDislikes
        ? DISLIKE_STROKE_COLOR
        : egoLikes
          ? REACHABLE_STROKE_COLOR
          : null;

      parts.push(
        nodeMarkup(x, y, node, strokeColor, fillColor, labelColor, inwardColor, outwardColor),
      );
    });
  });

  // Region names, stacked vertically in the node-free right margin.
  parts.push(regionLabelsMarkup());

  parts.push(`</svg>`);

  return { memberId, svg: parts.join("") };
};

//////////////////////////////////////////////////////////////////////////////////
// EGO PLOT BATCH BUILDER
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build an SVG ego plot for every member of the group.
 *
 * This is the caching entry point for ego plots: the likes/dislikes reachability
 * map is computed exactly once (via {@link getNodePaths}) and reused for every member,
 * so each plot only does an O(1) lookup via {@link getNodePathsFor} instead of
 * re-running the all-pairs shortest-path computation.
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
  const nodePaths = getNodePaths(likesGraph, dislikesGraph);

  return members.map((member) =>
    buildMorenoEgoPlot(member.id, likesGraph, dislikesGraph, nodePaths),
  );
};
