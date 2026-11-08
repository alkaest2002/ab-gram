// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi } from "vite-plus/test";

// `snaPlots` builds its SVG as a plain string (no DOM), so it runs in Node and
// inside a Web Worker alike. We only stub the force layout: `createSnaNetwork`
// already assigns a random layout, so a no-op keeps the test fast and
// deterministic while still leaving valid `x`/`y` coordinates in place.
vi.mock("graphology-layout-forceatlas2", () => ({
  default: { assign: () => {} },
}));

import { createSnaNetwork } from "@/analysis/sna/snaBase.js";
import { getSnaPlot } from "@/analysis/sna/plots/snaPlots.js";

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

describe("getSnaPlot", () => {
  it("returns a single plot for the likes network", () => {
    const members = [makeMember("a", ["b"]), makeMember("b", ["a"])];
    const likesNetwork = createSnaNetwork(members, "likes");

    const plots = getSnaPlot(likesNetwork, "#0000FF");

    expect(plots).toHaveLength(1);
    expect(plots[0].typeOfPreference).toBe("likes");
    expect(plots[0].accentColor).toBe("#0000FF");
    expect(plots[0].svg).toContain("<svg");
    expect(plots[0].svg).toContain("</svg>");
  });

  it("carries the network's preference type and accent color", () => {
    const members = [makeMember("a", [], ["b"]), makeMember("b", [], ["a"])];
    const dislikesNetwork = createSnaNetwork(members, "dislikes");

    const plots = getSnaPlot(dislikesNetwork, "#FF0000");

    expect(plots).toHaveLength(1);
    expect(plots[0].typeOfPreference).toBe("dislikes");
    expect(plots[0].accentColor).toBe("#FF0000");
    expect(plots[0].svg).toContain("<svg");
    expect(plots[0].svg).toContain("</svg>");
  });

  it("renders a node per member and an edge per directed preference", () => {
    const members = [makeMember("a", ["b"]), makeMember("b", ["a"])];
    const likesNetwork = createSnaNetwork(members, "likes");

    const plots = getSnaPlot(likesNetwork, "#0000FF");
    const svg = plots[0].svg;

    // Two members => two circles and two labels.
    expect(svg.match(/<circle /g)).toHaveLength(2);
    expect(svg.match(/<text /g)).toHaveLength(2);

    // Two directed preferences => two edges (both mutual here).
    expect(svg.match(/<line /g)).toHaveLength(2);

    // The arrowhead markers are always declared (accent + dimmed).
    expect(svg).toContain("<marker ");
    expect(svg).toContain("<defs>");
  });

  it("stamps data-node on nodes and data-source on edges for CSS emphasis", () => {
    const members = [makeMember("a", ["b"]), makeMember("b", ["a"]), makeMember("c", ["a"])];
    const likesNetwork = createSnaNetwork(members, "likes");

    const plots = getSnaPlot(likesNetwork, "#0000FF");
    const svg = plots[0].svg;

    // Every connected node has data-node on both its circle and text.
    expect(svg.match(/data-node='a'/g).length).toBeGreaterThanOrEqual(2);
    expect(svg.match(/data-node='b'/g).length).toBeGreaterThanOrEqual(2);
    expect(svg.match(/data-node='c'/g).length).toBeGreaterThanOrEqual(2);

    // Every edge carries data-source matching its source node.
    expect(svg).toContain("data-source='a'");
    expect(svg).toContain("data-source='b'");
    expect(svg).toContain("data-source='c'");

    // The SVG root carries marker ids so Vue can swap them.
    expect(svg).toMatch(/data-accent-marker='[^']+'/);
    expect(svg).toMatch(/data-dimmed-marker='[^']+'/);
  });

  it("declares both accent and dimmed arrowhead markers", () => {
    const members = [makeMember("a", ["b"]), makeMember("b")];
    const likesNetwork = createSnaNetwork(members, "likes");

    const plots = getSnaPlot(likesNetwork, "#0000FF");
    const svg = plots[0].svg;

    // Two markers: one accent-colored, one transparent (dimmed edges are
    // hidden entirely, so the arrowhead must be invisible too).
    expect(svg.match(/<marker /g)).toHaveLength(2);
    expect(svg).toContain("stroke='#0000FF'");
    expect(svg).toContain("stroke='transparent'");
  });
});
