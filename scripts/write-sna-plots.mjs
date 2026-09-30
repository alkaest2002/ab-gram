/**
 * Debug helper: render the SNA plots and write the resulting SVGs to disk.
 *
 * This exercises the real `getSnaPlots` (via `createLikesGraph`) without a
 * browser: a minimal DOM shim provides just enough of `document`/`window` for
 * `@svgdotjs/svg.js` to build and serialize an SVG in Node. The generated files
 * land in `debug-plots/` so they can be opened in a browser or image viewer.
 *
 * Run with:
 *
 *   node scripts/write-sna-plots.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

//////////////////////////////////////////////////////////////////////////////////
// MINIMAL DOM SHIM (svg.js needs `document`/`window` outside the browser)
//////////////////////////////////////////////////////////////////////////////////

class DomNode {
  constructor(nodeName) {
    this.nodeName = nodeName;
    this.nodeType = nodeName === "#text" ? 3 : 1;
    this._attrs = new Map();
    this.childNodes = [];
    this.parentNode = null;
    this.instance = null;
    this._text = "";
  }

  get id() {
    return this._attrs.get("id") ?? null;
  }
  set id(v) {
    this._attrs.set("id", String(v));
  }

  setAttribute(name, value) {
    this._attrs.set(name, String(value));
  }
  setAttributeNS(_ns, name, value) {
    this._attrs.set(name, String(value));
  }
  getAttribute(name) {
    return this._attrs.has(name) ? this._attrs.get(name) : null;
  }
  hasAttribute(name) {
    return this._attrs.has(name);
  }
  removeAttribute(name) {
    this._attrs.delete(name);
  }

  appendChild(child) {
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }
  insertBefore(child, ref) {
    const i = this.childNodes.indexOf(ref);
    if (i < 0) this.childNodes.push(child);
    else this.childNodes.splice(i, 0, child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) {
    const i = this.childNodes.indexOf(child);
    if (i >= 0) this.childNodes.splice(i, 1);
    child.parentNode = null;
    return child;
  }
  hasChildNodes() {
    return this.childNodes.length > 0;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1];
  }
  get firstChild() {
    return this.childNodes[0];
  }
  get firstElementChild() {
    return this.childNodes.find((c) => c.nodeType === 1);
  }
  get children() {
    return this.childNodes.filter((c) => c.nodeType === 1);
  }

  get textContent() {
    if (this.nodeType === 3) return this._text;
    return this.childNodes.map((c) => c.textContent).join("");
  }
  set textContent(v) {
    this._text = String(v);
    this.childNodes = [];
  }

  // A non-null box keeps svg.js's bbox() happy without a real layout engine.
  getBBox() {
    return { x: 0, y: 0, width: 10, height: 10 };
  }
  dispatchEvent() {
    return true;
  }

  querySelector(selector) {
    return this._find(this, selector.toUpperCase());
  }
  _find(node, name) {
    for (const child of node.childNodes) {
      if (child.nodeType !== 1) continue;
      if (child.nodeName === name) return child;
      const found = this._find(child, name);
      if (found) return found;
    }
    return null;
  }

  get outerHTML() {
    return this._serialize();
  }
  get innerHTML() {
    return this.childNodes.map((c) => c._serialize()).join("");
  }
  _serialize() {
    if (this.nodeType === 3) {
      return this._text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    }
    let out = `<${this.nodeName}`;
    for (const [name, value] of this._attrs) {
      const escaped = String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");
      out += ` ${name}="${escaped}"`;
    }
    if (this.childNodes.length === 0) return `${out}/>`;
    out += ">";
    for (const child of this.childNodes) out += child._serialize();
    return `${out}</${this.nodeName}>`;
  }
}

class FakeEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
    this.cancelable = init.cancelable || false;
    this.defaultPrevented = false;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}

const document = {
  createElementNS(_ns, name) {
    const node = new DomNode(name);
    node.ownerDocument = document;
    return node;
  },
  createTextNode(text) {
    const node = new DomNode("#text");
    node._text = String(text);
    node.ownerDocument = document;
    return node;
  },
  createElement(name) {
    return this.createElementNS(null, name);
  },
  documentElement: new DomNode("html"),
};

const window = {
  Node: DomNode,
  SVGElement: DomNode,
  Event: FakeEvent,
  CustomEvent: FakeEvent,
  Date,
  performance: { now: () => 0 },
  CSS: { escape: (s) => s },
  requestAnimationFrame: () => 0,
  getComputedStyle() {
    return { getPropertyValue: () => "16px" };
  },
};

globalThis.window = window;
globalThis.document = document;

//////////////////////////////////////////////////////////////////////////////////
// REAL IMPORTS (after the shim, so svg.js sees `document`/`window`)
//////////////////////////////////////////////////////////////////////////////////

const { createLikesGraph } = await import("../src/analysis/snaBase.js");
const { getSnaPlots } = await import("../src/analysis/snaPlots.js");

//////////////////////////////////////////////////////////////////////////////////
// SAMPLE DATA
//////////////////////////////////////////////////////////////////////////////////

// A small group covering every case the plot must render: mutual edges (a-b,
// e-f), one-sided edges (a-c, c-d, ...), and an isolated member (g).
const members = [
  { id: "a", name: "Alice", likes: ["b", "c"], dislikes: ["d"] },
  { id: "b", name: "Bob", likes: ["a"], dislikes: ["a"] },
  { id: "c", name: "Carol", likes: ["d"], dislikes: ["b"] },
  { id: "d", name: "Dan", likes: [], dislikes: [] },
  { id: "e", name: "Eve", likes: ["f"], dislikes: ["f"] },
  { id: "f", name: "Frank", likes: ["e"], dislikes: ["e"] },
  { id: "g", name: "Grace", likes: [], dislikes: [] },
];

//////////////////////////////////////////////////////////////////////////////////
// RENDER + WRITE
//////////////////////////////////////////////////////////////////////////////////

// Blue for likes, red for dislikes — matching analysisMain.js.
const plots = getSnaPlots([
  [createLikesGraph(members, "likes"), "#0000FF"],
  [createLikesGraph(members, "dislikes"), "#FF0000"],
]);

const outDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "debug-plots",
);
mkdirSync(outDir, { recursive: true });

for (const plot of plots) {
  if (!plot.svg || !plot.svg.startsWith("<svg")) {
    throw new Error(`Malformed SVG for "${plot.typeOfPreference}".`);
  }

  const file = resolve(outDir, `${plot.typeOfPreference}.svg`);
  writeFileSync(file, plot.svg);
  console.log(
    `wrote ${file} (${plot.svg.length} bytes, ${plot.accentColor})`,
  );
}
