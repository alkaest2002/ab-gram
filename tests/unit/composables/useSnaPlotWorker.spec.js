// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi } from "vite-plus/test";

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
  const api = useSnaPlotWorker({ onSuccess, onError });

  return { api, worker, onSuccess, onError };
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

  it("reports an error when worker instantiation fails", () => {
    createSnaPlotWorker.mockReset();
    createSnaPlotWorker.mockImplementation(() => {
      throw new Error("blocked");
    });

    const onError = vi.fn();
    const api = useSnaPlotWorker({ onError });

    api.regeneratePlot(makePayload());

    expect(onError).toHaveBeenCalledWith("Impossibile avviare il worker.");
    expect(api.isPlotRegenerating.value).toBe(false);
  });
});
