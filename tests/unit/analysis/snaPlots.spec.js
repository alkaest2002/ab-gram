import { describe, it, expect, vi } from "vitest";

// `snaPlots` builds its SVG as a plain string (no DOM), so it runs in Node and
// inside a Web Worker alike. We only stub the force layout: `createLikesGraph`
// already assigns a random layout, so a no-op keeps the test fast and
// deterministic while still leaving valid `x`/`y` coordinates in place.
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
    expect(plots[0].svg).toContain("<svg");
    expect(plots[0].svg).toContain("</svg>");
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
    expect(plots[0].svg).toContain("<svg");
    expect(plots[0].svg).toContain("</svg>");
  });

  it("renders a node per member and an edge per directed preference", () => {
    const members = [
      makeMember("a", ["b"]),
      makeMember("b", ["a"]),
    ];
    const likes = createLikesGraph(members, "likes");

    const plots = getSnaPlot(likes, "#0000FF");
    const svg = plots[0].svg;

    // Two members => two circles and two labels.
    expect(svg.match(/<circle /g)).toHaveLength(2);
    expect(svg.match(/<text /g)).toHaveLength(2);

    // Two directed preferences => two edges (both mutual here).
    expect(svg.match(/<line /g)).toHaveLength(2);

    // The arrowhead marker is always declared.
    expect(svg).toContain("<marker ");
    expect(svg).toContain("<defs>");
  });
});
