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
import { getSnaPlots } from "@/analysis/snaPlots.js";

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

describe("getSnaPlots", () => {
  it("returns one plot per graph in input order", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];
    const likes = createLikesGraph(members, "likes");
    const dislikes = createLikesGraph(members, "dislikes");

    const plots = getSnaPlots([
      [likes, "#0000FF"],
      [dislikes, "#FF0000"],
    ]);

    expect(plots).toHaveLength(2);

    expect(plots[0].typeOfPreference).toBe("likes");
    expect(plots[0].accentColor).toBe("#0000FF");
    expect(plots[0].svg).toBe("<svg></svg>");

    expect(plots[1].typeOfPreference).toBe("dislikes");
    expect(plots[1].accentColor).toBe("#FF0000");
    expect(plots[1].svg).toBe("<svg></svg>");
  });

  it("returns an empty array for no graphs", () => {
    expect(getSnaPlots([])).toEqual([]);
  });
});
