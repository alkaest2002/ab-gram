import { describe, it, expect, vi } from "vitest";

// `snaPlots` renders SVG with `@svgdotjs/svg.js`, which requires a browser DOM.
// Unit tests stub the DOM-bound SVG factory and the force layout so the module
// can be exercised in the Node test environment.
vi.mock("@svgdotjs/svg.js", () => {
  const draw = {
    size: () => draw,
    viewbox: () => draw,
    marker: (...args) => {
      const add = args[2];
      if (typeof add === "function") add(draw);
      return draw;
    },
    ref: () => draw,
    line: () => draw,
    circle: () => draw,
    plain: () => draw,
    group: () => draw,
    path: () => draw,
    fill: () => draw,
    stroke: () => draw,
    font: () => draw,
    attr: () => draw,
    center: () => draw,
    translate: () => draw,
    svg: () => "<svg></svg>",
  };

  return { SVG: () => draw };
});

vi.mock("graphology-layout-forceatlas2", () => ({
  default: { assign: () => {} },
}));

import { createLikesGraph } from "@/analysis/snaBase.js";
import { getSnaPlot } from "@/analysis/snaPlots.js";

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

describe("getSnaPlot", () => {
  it("returns a single plot for the likes graph", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];
    const likes = createLikesGraph(members, "likes");

    const plots = getSnaPlot(likes, "#0000FF");

    expect(plots).toHaveLength(1);
    expect(plots[0].typeOfPreference).toBe("likes");
    expect(plots[0].accentColor).toBe("#0000FF");
    expect(plots[0].svg).toBe("<svg></svg>");
  });

  it("carries the graph's preference type and accent color", () => {
    const members = [
      makeMember("a", [], ["b"]),
      makeMember("b", [], ["a"]),
    ];
    const dislikes = createLikesGraph(members, "dislikes");

    const plots = getSnaPlot(dislikes, "#FF0000");

    expect(plots).toHaveLength(1);
    expect(plots[0].typeOfPreference).toBe("dislikes");
    expect(plots[0].accentColor).toBe("#FF0000");
    expect(plots[0].svg).toBe("<svg></svg>");
  });
});
