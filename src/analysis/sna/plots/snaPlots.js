import forceAtlas2 from 'graphology-layout-forceatlas2';

//////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////////////////

// Number of ForceAtlas2 iterations run to settle the initial node coordinates.
const ITERATIONS = 300;

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
const MUTUAL_EDGE_WIDTH = 4;

// Arrowhead: a light open chevron (no filled triangle), pointing at the target.
const ARROW_SIZE = 8;
const ARROW_STROKE_WIDTH = 1;

// Spacing between consecutive isolated nodes, horizontally and vertically.
const ISOLATED_GAP = 8;

// Member ids inside a node are white, for contrast against the colored circle.
const NODE_LABEL_COLOR = "#FFFFFF";

// Isolated nodes are drawn in black.
const ISOLATED_NODE_COLOR = "#000000";

// Counter used to keep arrowhead marker ids unique when several plots are
// embedded in the same document.
let markerCounter = 0;


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
 *   connected members; isolated members are placed in a separate plot).
 * @returns {(node: string) => {x: number, y: number}} A mapper from a node id
 *   to its normalized SVG coordinates.
 */
const buildCoordinateMapper = (graph, nodes) => {
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

  // Area available to the connected graph: the canvas minus the padding.
  const availableWidth = CANVAS_WIDTH - 2 * PADDING;
  const availableHeight = CANVAS_HEIGHT - 2 * PADDING;

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
  const offsetY = (CANVAS_HEIGHT - rawHeight * scale) / 2 - minY * scale;

  return (node) => ({
    x: graph.getNodeAttribute(node, "x") * scale + offsetX,
    y: graph.getNodeAttribute(node, "y") * scale + offsetY,
  });
};


//////////////////////////////////////////////////////////////////////////////////
// SVG STRING HELPERS
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
 * Build the markup for a single node: a small, fully colored circle with its
 * member id centered inside.
 *
 * The label is written as a raw text node (no `<tspan>`) and centered
 * horizontally with `text-anchor: middle` and vertically with
 * `dominant-baseline: central`, so it sits at the exact circle center.
 *
 * @param {number} x - Horizontal center of the node.
 * @param {number} y - Vertical center of the node.
 * @param {string} label - The member id to display.
 * @param {string} fillColor - The circle's fill color.
 * @returns {string} The node's SVG markup.
 */
const nodeMarkup = (x, y, label, fillColor) =>
  `<circle r='${NODE_RADIUS}' fill='${fillColor}' cx='${formatCoordinate(x)}' cy='${formatCoordinate(y)}'></circle>` +
  `<text font-size='${LABEL_FONT_SIZE}' text-anchor='middle' x='${formatCoordinate(x)}' y='${formatCoordinate(y)}' dominant-baseline='central' fill='${NODE_LABEL_COLOR}'>${escapeXml(label)}</text>`;

/**
 * Build the isolated members' plot dynamically.
 *
 * Isolated members are laid out in rows that wrap once the canvas width is
 * reached, so any number of them can be accommodated. The returned `height`
 * is the vertical space the plot occupies, and `render` returns the SVG markup
 * drawn using the container's local coordinates (its origin).
 *
 * @param {string[]} isolatedNodes - The ids of the isolated members.
 * @returns {{height: number, render: () => string}} The plot's height and a
 *   function that returns its SVG markup.
 */
const buildIsolatedNodesPlot = (isolatedNodes) => {
  if (isolatedNodes.length === 0) {
    return { height: 0, render: () => "" };
  }

  // Most circles (plus their gaps) that fit across the available width.
  const nodesPerRow = Math.max(
    1,
    Math.floor(
      (CANVAS_WIDTH - 2 * PADDING + ISOLATED_GAP) /
        (NODE_RADIUS * 2 + ISOLATED_GAP),
    ),
  );
  const rows = Math.ceil(isolatedNodes.length / nodesPerRow);

  // Top/bottom padding plus one node band per row and a gap between rows.
  const height =
    2 * PADDING + rows * (NODE_RADIUS * 2) + (rows - 1) * ISOLATED_GAP;

  const render = () =>
    isolatedNodes
      .map((node, index) => {
        const row = Math.floor(index / nodesPerRow);
        const col = index % nodesPerRow;
        const x = PADDING + NODE_RADIUS + col * (NODE_RADIUS * 2 + ISOLATED_GAP);
        const y = PADDING + NODE_RADIUS + row * (NODE_RADIUS * 2 + ISOLATED_GAP);
        return nodeMarkup(x, y, node, ISOLATED_NODE_COLOR);
      })
      .join("");

  return { height, render };
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
  // Settle the random starting layout with ForceAtlas2. This updates each
  // node's `x`/`y` attributes in place.
  forceAtlas2.assign(graph, { iterations: ITERATIONS });

  // Split members: isolated nodes have no edge at all and are drawn in a
  // separate plot stacked below the connected graph.
  const connected = [];
  const isolated = [];
  graph.forEachNode((node) => {
    (graph.degree(node) === 0 ? isolated : connected).push(node);
  });

  // Build the isolated plot first: its height sets the total SVG height.
  const isolatedPlot = buildIsolatedNodesPlot(isolated);

  // Transparent background and no border: the root SVG carries no fill, stroke
  // or border, and no background rectangle is added. Its height is the sum of
  // the connected graph and the isolated plot (when present).
  const totalHeight = CANVAS_HEIGHT + isolatedPlot.height;
  const markerId = `arrow-${markerCounter++}`;

  const parts = [];

  parts.push(
    `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='${CANVAS_WIDTH}' height='${totalHeight}' viewBox='0 0 ${CANVAS_WIDTH} ${totalHeight}'>`,
  );

  // Arrowhead for non-mutual edges: an open chevron (two thin strokes) instead
  // of a filled triangle, so it reads light. `refX`/`refY` align the marker's
  // tip (its right edge) with the line endpoint, and `orient='auto'` rotates it
  // to follow the line's direction.
  parts.push(
    `<defs><marker id='${markerId}' markerWidth='${ARROW_SIZE}' markerHeight='${ARROW_SIZE}' refX='${ARROW_SIZE}' refY='${ARROW_SIZE / 2}' viewBox='0 0 ${ARROW_SIZE} ${ARROW_SIZE}' orient='auto'>` +
      `<path d='M0,0 L${ARROW_SIZE},${ARROW_SIZE / 2} L0,${ARROW_SIZE}' fill='none' stroke='${accentColor}' stroke-width='${ARROW_STROKE_WIDTH}' stroke-linecap='round'></path>` +
      `</marker></defs>`,
  );

  const toSvg = buildCoordinateMapper(graph, connected);

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
    const markerEnd = attributes.isMutual ? "" : ` marker-end='url(#${markerId})'`;

    parts.push(
      `<line x1='${formatCoordinate(x1)}' y1='${formatCoordinate(y1)}' x2='${formatCoordinate(x2)}' y2='${formatCoordinate(y2)}' stroke='${accentColor}' stroke-width='${width}'${markerEnd}></line>`,
    );
  });

  // Connected members: small colored circles labelled with their member id.
  connected.forEach((node) => {
    const { x, y } = toSvg(node);
    parts.push(nodeMarkup(x, y, node, accentColor));
  });

  // Isolated members: a black plot stacked below the connected graph, drawn
  // into a group translated down by the connected graph's height.
  if (isolatedPlot.height > 0) {
    parts.push(`<g transform='translate(0, ${CANVAS_HEIGHT})'>`);
    parts.push(isolatedPlot.render());
    parts.push(`</g>`);
  }

  parts.push(`</svg>`);

  return {
    typeOfPreference: graph.getAttribute("typeOfPreference"),
    accentColor,
    svg: parts.join(""),
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
 * `graphology-layout-forceatlas2`, then rendered into SVG markup: the connected
 * members become accent-colored circles (labelled with their member id) joined
 * by accent-colored edges, mutual edges drawn thicker and without arrowheads and
 * non-mutual edges thinner with a light chevron arrowhead pointing at their
 * target. Isolated members are drawn in black in a plot stacked vertically below
 * the connected graph.
 *
 * The SVG is built as a plain string (no DOM access), so it can run both in the
 * browser main thread and inside a Web Worker, where `document` is unavailable.
 *
 * @param {Array<[import("graphology").DirectedGraph, string]>} graphs - A list
 *   of `[graph, accentColor]` pairs, one per preference type.
 * @returns {Array<{typeOfPreference: string, accentColor: string, svg: string}>}
 *   One plot per input graph, in the same order. Each plot exposes the
 *   preference type, the accent color used, and the serialized SVG markup.
 */
export const getSnaPlot = (graph, accentColor) => {
  return [buildPlot(graph, accentColor)];
};
