import { describe, it, expect, vi } from "vitest";

// Capture the ForceAtlas2 options so the forwarded settings can be asserted.
const { forceAtlas2Assign } = vi.hoisted(() => ({ forceAtlas2Assign: vi.fn() }));

vi.mock("graphology-layout-forceatlas2", () => ({
  default: { assign: forceAtlas2Assign },
}));

import { regenerateSnaPlot } from "@/analysis/sna/plots/regenerateSnaPlots.js";

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

describe("regenerateSnaPlot", () => {
  it("builds and returns a single plot from members", () => {
    const members = [makeMember("a", ["b"]), makeMember("b", ["a"])];

    const plot = regenerateSnaPlot(members, "#0000FF", {
      typeOfPreference: "likes",
    });

    expect(plot.typeOfPreference).toBe("likes");
    expect(plot.accentColor).toBe("#0000FF");
    expect(plot.svg).toContain("<svg");
    expect(plot.svg).toContain("</svg>");
  });

  it("plots the configured preference type", () => {
    const members = [makeMember("a", [], ["b"]), makeMember("b", [], ["a"])];

    const plot = regenerateSnaPlot(members, "#FF0000", {
      typeOfPreference: "dislikes",
    });

    expect(plot.typeOfPreference).toBe("dislikes");
  });

  it("forwards the ForceAtlas2 settings to the layout", () => {
    forceAtlas2Assign.mockClear();

    regenerateSnaPlot([makeMember("a", ["b"]), makeMember("b", [])], "#0000FF", {
      typeOfPreference: "likes",
      settings: { scalingRatio: 2, gravity: 0.5 },
    });

    const options = forceAtlas2Assign.mock.calls[0][1];

    expect(options.settings.scalingRatio).toBe(2);
    expect(options.settings.gravity).toBe(0.5);
    expect(options).not.toHaveProperty("typeOfPreference");
  });
});
