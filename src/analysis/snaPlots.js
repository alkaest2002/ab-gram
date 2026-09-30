import { SVG } from "@svgdotjs/svg.js";
import forceLayout from "graphology-layout-force";

//////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////////////////

// Canvas and drawing constants, all expressed in SVG user units (the viewBox).
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

// Breathing room kept between the drawn graph and the canvas edges.
const PADDING = 48;

// Node circles are "small": a fixed radius, with a label sized to fit inside.
const NODE_RADIUS = 16;
const LABEL_FONT_SIZE = 11;

// Edge strokes: mutual edges are drawn thicker than non-mutual ones.
const NON_MUTUAL_EDGE_WIDTH = 1;
const MUTUAL_EDGE_WIDTH = 2.5;

// Arrowhead: a light open chevron (no filled triangle), pointing at the target.
const ARROW_SIZE = 8;
const ARROW_STROKE_WIDTH = 1;

// Horizontal spacing between consecutive isolated nodes.
const ISOLATED_GAP = 8;

// Vertical clearance kept between the connected graph and the isolated row.
const ISOLATED_ROW_CLEARANCE = 8;

// Number of force-directed iterations run to settle the random layout.
const FORCE_MAX_ITERATIONS = 300;

// Member ids inside a node are white, for contrast against the colored circle.
const NODE_LABEL_COLOR = "#FFFFFF";

// Isolated nodes are drawn in black.
const ISOLATED_NODE_COLOR = "#000000";


//////////////////////////////////////////////////////////////////////////////////
// COORDINATE NORMALIZATION
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build a function that maps a node's raw force-layout coordinates onto the SVG
 * canvas.
 *
 * The force layout works in its own (arbitrary, possibly negative) coordinate
 * space, so its positions cannot be used directly as SVG coordinates. This
 * helper fits the bounding box of the given nodes into the canvas while
 * preserving the layout's aspect ratio: it scales uniformly and centers the
 * result.
 *
 * @param {import("graphology").DirectedGraph} graph - The graph, whose nodes
 *   hold `x`/`y` attributes produced by the force layout.
 * @param {string[]} nodes - The nodes whose positions are normalized (the
 *   connected members; isolated members are placed separately).
 * @param {number} bottomInset - Distance from the canvas bottom reserved for
 *   the isolated row. The connected graph is fitted above this line.
 * @returns {(node: string) => {x: number, y: number}} A mapper from a node id
 *   to its normalized SVG coordinates.
 */
const buildCoordinateMapper = (graph, nodes, bottomInset) => {
  // A graph with no connected nodes has nothing to fit; the mapper is unused
  // in that case, but still returns a well-defined (centered) point.
  if (nodes.length === 0) {
    return () => ({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  }

  // Bounding box of the raw layout positions.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const x = graph.getNodeAttribute(node, "x");
    const y = graph.getNodeAttribute(node, "y");
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  const rawWidth = maxX - minX;
  const rawHeight = maxY - minY;

  // Area available to the connected graph: the canvas minus the padding and
  // any band reserved at the bottom for the isolated nodes.
  const availableWidth = CANVAS_WIDTH - 2 * PADDING;
  const availableHeight = CANVAS_HEIGHT - PADDING - bottomInset;

  // Uniform scale: the largest that fits both axes, so the aspect ratio of the
  // force layout is preserved. `Infinity` guards degenerate axes (all nodes
  // sharing a single x or y coordinate).
  const scale =
    rawWidth === 0 && rawHeight === 0
      ? 1
      : Math.min(
          rawWidth === 0 ? Infinity : availableWidth / rawWidth,
          rawHeight === 0 ? Infinity : availableHeight / rawHeight,
        );

  // Center the scaled content in the available area.
  const offsetX = (CANVAS_WIDTH - rawWidth * scale) / 2 - minX * scale;
  const offsetY =
    (PADDING + CANVAS_HEIGHT - bottomInset - rawHeight * scale) / 2 -
    minY * scale;

  return (node) => ({
    x: graph.getNodeAttribute(node, "x") * scale + offsetX,
    y: graph.getNodeAttribute(node, "y") * scale + offsetY,
  });
};


//////////////////////////////////////////////////////////////////////////////////
// DRAWING
//////////////////////////////////////////////////////////////////////////////////

/**
 * Compute the visible endpoints of an edge.
 *
 * The line is shortened by `radius` on both sides so it stops at the boundary
 * of the source and target circles instead of running underneath them. The
 * arrowhead (when present) then sits exactly on the target circle's edge.
 *
 * @param {{x: number, y: number}} from - Source node center.
 * @param {{x: number, y: number}} to - Target node center.
 * @param {number} radius - Node radius, in SVG user units.
 * @returns {{x1: number, y1: number, x2: number, y2: number}} The edge endpoints.
 */
const computeEdgeEndpoints = (from, to, radius) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);

  // Coincident (or nearly coincident) nodes have no direction to shorten along;
  // keep the edge between their centers so it stays visible under the nodes.
  if (length === 0 || length <= 2 * radius) {
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  }

  const ux = dx / length;
  const uy = dy / length;

  return {
    x1: from.x + ux * radius,
    y1: from.y + uy * radius,
    x2: to.x - ux * radius,
    y2: to.y - uy * radius,
  };
};

/**
 * Draw a node: a small, fully colored circle with its member id centered inside.
 *
 * The label is written as a raw text node (no `<tspan>`) and centered
 * horizontally with `text-anchor: middle` and vertically with
 * `dominant-baseline: central`, so it sits at the exact circle center.
 *
 * @param {import("@svgdotjs/svg.js").Svg} draw - The SVG root.
 * @param {number} x - Horizontal center of the node.
 * @param {number} y - Vertical center of the node.
 * @param {string} label - The member id to display.
 * @param {string} fillColor - The circle's fill color.
 */
const drawNode = (draw, x, y, label, fillColor) => {
  draw.circle(NODE_RADIUS * 2).fill(fillColor).center(x, y);

  draw
    .plain(String(label))
    .font({ size: LABEL_FONT_SIZE, anchor: "middle" })
    .attr({ x, y, "dominant-baseline": "central" })
    .fill(NODE_LABEL_COLOR);
};

/**
 * Draw the isolated members (those without any edge) in a row starting at the
 * bottom-left corner, in black.
 *
 * @param {import("@svgdotjs/svg.js").Svg} draw - The SVG root.
 * @param {string[]} isolatedNodes - The ids of the isolated members.
 */
const drawIsolatedNodes = (draw, isolatedNodes) => {
  let x = PADDING;
  const y = CANVAS_HEIGHT - PADDING;

  isolatedNodes.forEach((node) => {
    drawNode(draw, x, y, node, ISOLATED_NODE_COLOR);
    x += NODE_RADIUS * 2 + ISOLATED_GAP;
  });
};

/**
 * Build the SVG plot of a single preference graph.
 *
 * @param {import("graphology").DirectedGraph} graph - A preference graph built
 *   by `createLikesGraph` (tagged with its `typeOfPreference`).
 * @param {string} accentColor - The accent color used for nodes and edges.
 * @returns {{typeOfPreference: string, accentColor: string, svg: string}}
 *   The plot's preference type, accent color, and serialized SVG markup.
 */
const buildPlot = (graph, accentColor) => {
  // Settle the random starting layout with the force-directed algorithm. This
  // updates each node's `x`/`y` attributes in place.
  forceLayout.assign(graph, { maxIterations: FORCE_MAX_ITERATIONS });

  // Split members: isolated nodes have no edge at all and are drawn separately
  // at the bottom-left, in black.
  const connected = [];
  const isolated = [];
  graph.forEachNode((node) => {
    (graph.degree(node) === 0 ? isolated : connected).push(node);
  });

  // Transparent background and no border: the root SVG carries no fill, stroke
  // or border, and no background rectangle is added.
  const draw = SVG()
    .size(CANVAS_WIDTH, CANVAS_HEIGHT)
    .viewbox(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Arrowhead for non-mutual edges: an open chevron (two thin strokes) instead
  // of a filled triangle, so it reads light. `ref` aligns the marker's tip (its
  // right edge) with the line endpoint, and the default `orient="auto"` rotates
  // it to follow the line's direction.
  const arrow = draw
    .marker(ARROW_SIZE, ARROW_SIZE, (add) => {
      add
        .path(`M0,0 L${ARROW_SIZE},${ARROW_SIZE / 2} L0,${ARROW_SIZE}`)
        .fill("none")
        .stroke({
          color: accentColor,
          width: ARROW_STROKE_WIDTH,
          linecap: "round",
        });
    })
    .ref(ARROW_SIZE, ARROW_SIZE / 2);

  // Reserve room at the bottom for the isolated row so it never overlaps the
  // connected graph (with a little clearance between them).
  const bottomInset =
    isolated.length > 0
      ? PADDING + NODE_RADIUS * 2 + ISOLATED_ROW_CLEARANCE
      : PADDING;

  const toSvg = buildCoordinateMapper(graph, connected, bottomInset);

  // Draw edges first so the nodes are painted on top of them.
  graph.forEachDirectedEdge((edge, attributes, source, target) => {
    const from = toSvg(source);
    const to = toSvg(target);
    const { x1, y1, x2, y2 } = computeEdgeEndpoints(from, to, NODE_RADIUS);

    // Mutual edges are thicker and plain; non-mutual edges are thinner and
    // carry a light arrowhead pointing at their target.
    const width = attributes.isMutual
      ? MUTUAL_EDGE_WIDTH
      : NON_MUTUAL_EDGE_WIDTH;

    const line = draw
      .line(x1, y1, x2, y2)
      .stroke({ color: accentColor, width });

    if (!attributes.isMutual) line.marker("end", arrow);
  });

  // Connected members: small colored circles labelled with their member id.
  connected.forEach((node) => {
    const { x, y } = toSvg(node);
    drawNode(draw, x, y, node, accentColor);
  });

  // Isolated members: a black row at the bottom-left.
  drawIsolatedNodes(draw, isolated);

  return {
    typeOfPreference: graph.getAttribute("typeOfPreference"),
    accentColor,
    svg: draw.svg(),
  };
};


//////////////////////////////////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Build an SVG plot for each preference graph.
 *
 * Each graph is expected to carry an initial random layout (see
 * `createLikesGraph`). Its nodes are first repositioned with
 * `graphology-layout-force`, then rendered into an SVG with `svg.js`: the
 * connected members become accent-colored circles (labelled with their member
 * id) joined by accent-colored edges, mutual edges drawn thicker and without
 * arrowheads and non-mutual edges thinner with a light chevron arrowhead
 * pointing at their target. Isolated members are drawn in black along the
 * bottom-left edge.
 *
 * @param {Array<[import("graphology").DirectedGraph, string]>} graphs - A list
 *   of `[graph, accentColor]` pairs, one per preference type.
 * @returns {Array<{typeOfPreference: string, accentColor: string, svg: string}>}
 *   One plot per input graph, in the same order. Each plot exposes the
 *   preference type, the accent color used, and the serialized SVG markup.
 */
export const getSnaPlots = (graphs) => {
  return graphs.map(([graph, accentColor]) => buildPlot(graph, accentColor));
};
