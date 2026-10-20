import { describe, it, expect, vi } from "vitest";

// Capture the ForceAtlas2 options so the forwarded settings can be asserted.
const { forceAtlas2Assign } = vi.hoisted(() => ({ forceAtlas2Assign: vi.fn() }));

vi.mock("graphology-layout-forceatlas2", () => ({
  default: { assign: forceAtlas2Assign },
}));

const makeMember = (id, likes = [], dislikes = []) => ({
  id,
  name: id,
  likes,
  dislikes,
});

// The worker registers its message handler on `self`, which does not exist in
// Node. Provide a minimal stand-in with a captured `postMessage`.
const postMessage = vi.fn();
globalThis.self = { postMessage, onmessage: null };

const handleMessage = (data) => self.onmessage({ data });

describe("snaPlotWorker", () => {
  it("builds and posts a single plot from members", async () => {
    await import("@/workers/snaPlotWorker.js");

    handleMessage({
      members: [makeMember("a", ["b"]), makeMember("b", ["a"])],
      accentColor: "#0000FF",
      config: { typeOfPreference: "likes" },
    });

    const [message] = postMessage.mock.calls[0];
    expect(message.svg).toContain("<svg");
    expect(message.svg).toContain("</svg>");
    expect(message.svg).toContain("#0000FF");
  });

  it("plots the configured preference type", async () => {
    await import("@/workers/snaPlotWorker.js");

    handleMessage({
      members: [makeMember("a", [], ["b"]), makeMember("b", [], ["a"])],
      accentColor: "#FF0000",
      config: { typeOfPreference: "dislikes" },
    });

    const graph = forceAtlas2Assign.mock.calls[0][0];
    expect(graph.getAttribute("typeOfPreference")).toBe("dislikes");
  });

  it("forwards the ForceAtlas2 settings to the layout", async () => {
    await import("@/workers/snaPlotWorker.js");
    forceAtlas2Assign.mockClear();

    handleMessage({
      members: [makeMember("a", ["b"]), makeMember("b", [])],
      accentColor: "#0000FF",
      config: {
        typeOfPreference: "likes",
        settings: { scalingRatio: 2, gravity: 0.5 },
      },
    });

    const options = forceAtlas2Assign.mock.calls[0][1];

    expect(options.settings.scalingRatio).toBe(2);
    expect(options.settings.gravity).toBe(0.5);
    expect(options).not.toHaveProperty("typeOfPreference");
  });
});
