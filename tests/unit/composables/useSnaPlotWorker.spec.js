// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { afterEach, describe, it, expect, vi } from "vite-plus/test";
import { createRenderer, defineComponent } from "vue";

import { useSnaPlotWorker } from "@/composables/report/useSnaPlotWorker";

const { createSnaPlotWorker } = vi.hoisted(() => ({
  createSnaPlotWorker: vi.fn(),
}));

vi.mock("@/workers/workerHelpers", () => ({
  createSnaPlotWorker,
}));

const makeWorker = () => ({
  terminate: vi.fn(),
  postMessage: vi.fn(),
  onmessage: null,
  onerror: null,
});

const makePayload = () => ({
  members: [{ id: "a", name: "A", likes: [], dislikes: [] }],
  accentColor: "#2563eb",
  typeOfSna: "likes",
  settings: { scalingRatio: 1, gravity: 1 },
});

// A minimal host renderer supplies a real component lifecycle without needing
// a browser DOM or an additional test dependency.
const renderer = createRenderer({
  patchProp: () => {},
  insert: (child, parent) => {
    child.parent = parent;
    parent.children.push(child);
  },
  remove: () => {},
  createElement: () => ({ children: [], parent: null }),
  createText: (text) => ({ text, parent: null }),
  createComment: (text) => ({ text, parent: null }),
  setText: (node, text) => {
    node.text = text;
  },
  setElementText: (node, text) => {
    node.text = text;
  },
  parentNode: (node) => node.parent,
  nextSibling: () => null,
});

const mountedApps = [];

afterEach(() => {
  for (const app of mountedApps.splice(0)) app.unmount();
  vi.restoreAllMocks();
});

/**
 * Instantiate the composable with a fresh fake worker and spy callbacks.
 * Resetting `createSnaPlotWorker` at the start of each call keeps the mock
 * state isolated between tests.
 */
function setup() {
  createSnaPlotWorker.mockReset();
  const worker = makeWorker();
  createSnaPlotWorker.mockReturnValue(worker);

  const onSuccess = vi.fn();
  const onError = vi.fn();
  let api;

  const app = renderer.createApp(
    defineComponent({
      setup() {
        api = useSnaPlotWorker({ onSuccess, onError });
        return () => null;
      },
    }),
  );
  app.mount({ children: [] });
  mountedApps.push(app);

  const unmount = () => {
    const index = mountedApps.indexOf(app);
    if (index !== -1) mountedApps.splice(index, 1);
    app.unmount();
  };

  return { api, worker, onSuccess, onError, unmount };
}

describe("useSnaPlotWorker", () => {
  it("instantiates a worker and posts the members/config snapshot", () => {
    const { api, worker } = setup();

    api.regeneratePlot(makePayload());

    expect(createSnaPlotWorker).toHaveBeenCalledTimes(1);
    expect(api.isPlotRegenerating.value).toBe(true);
    expect(worker.postMessage).toHaveBeenCalledTimes(1);

    const [message] = worker.postMessage.mock.calls[0];
    expect(message.accentColor).toBe("#2563eb");
    expect(message.config).toEqual({
      typeOfPreference: "likes",
      settings: { scalingRatio: 1, gravity: 1 },
    });
    expect(message.members).toEqual([{ id: "a", name: "A", likes: [], dislikes: [] }]);
  });

  it("posts a plain copy of the members, not the original reference", () => {
    const { api, worker } = setup();
    const members = [{ id: "a", name: "A", likes: [], dislikes: [] }];

    api.regeneratePlot({ ...makePayload(), members });

    const [message] = worker.postMessage.mock.calls[0];
    expect(message.members).toEqual(members);
    expect(message.members).not.toBe(members);
  });

  it("ignores a second regeneratePlot while one is already in flight", () => {
    const { api, worker } = setup();

    api.regeneratePlot(makePayload());
    api.regeneratePlot(makePayload());

    expect(createSnaPlotWorker).toHaveBeenCalledTimes(1);
    expect(worker.postMessage).toHaveBeenCalledTimes(1);
  });

  it("calls onSuccess with the SVG and clears the in-flight flag", () => {
    const { api, worker, onSuccess, onError } = setup();
    api.regeneratePlot(makePayload());

    worker.onmessage({ data: { svg: "<svg></svg>" } });

    expect(onSuccess).toHaveBeenCalledWith("<svg></svg>");
    expect(onError).not.toHaveBeenCalled();
    expect(api.isPlotRegenerating.value).toBe(false);
  });

  it("calls onError when the worker posts an error", () => {
    const { api, worker, onSuccess, onError } = setup();
    api.regeneratePlot(makePayload());

    worker.onmessage({ data: { error: "boom" } });

    expect(onError).toHaveBeenCalledWith("boom");
    expect(onSuccess).not.toHaveBeenCalled();
    expect(api.isPlotRegenerating.value).toBe(false);
  });

  it("calls onError when the worker itself errors", () => {
    const { api, worker, onSuccess, onError } = setup();
    api.regeneratePlot(makePayload());

    worker.onerror();

    expect(onError).toHaveBeenCalledWith("Impossibile rigenerare il grafico.");
    expect(onSuccess).not.toHaveBeenCalled();
    expect(api.isPlotRegenerating.value).toBe(false);
  });

  it("terminates the worker when stopRegeneratingPlot() is called", () => {
    const { api, worker } = setup();
    api.regeneratePlot(makePayload());

    api.stopRegeneratingPlot();

    expect(worker.terminate).toHaveBeenCalledTimes(1);
    expect(api.isPlotRegenerating.value).toBe(false);
  });

  it("terminates the worker automatically when the component unmounts", () => {
    const { api, worker, unmount } = setup();
    api.regeneratePlot(makePayload());

    unmount();

    expect(worker.terminate).toHaveBeenCalledTimes(1);
    expect(api.isPlotRegenerating.value).toBe(false);
  });

  it("reports an error when worker instantiation fails", () => {
    const { api, onError } = setup();
    const error = new Error("blocked");
    createSnaPlotWorker.mockImplementation(() => {
      throw error;
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    api.regeneratePlot(makePayload());

    expect(consoleError).toHaveBeenCalledWith("Failed to create SNA plot worker:", error);
    expect(onError).toHaveBeenCalledWith("Impossibile avviare il worker.");
    expect(api.isPlotRegenerating.value).toBe(false);
  });
});
