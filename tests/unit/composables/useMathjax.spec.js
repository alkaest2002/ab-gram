// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { afterEach, expect, it, vi } from "vite-plus/test";

vi.mock("vue", async (importOriginal) => ({ ...(await importOriginal()), onMounted: vi.fn() }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("skips typesetting when existing startup stalls and retries after recovery", async () => {
  vi.useFakeTimers();
  const mathjax = { startup: { promise: new Promise(() => {}) }, typesetPromise: vi.fn() };
  vi.stubGlobal("window", { MathJax: mathjax });
  const { useMathjax } = await import("@/composables/docs/useMathjax");
  const container = {};
  const { typeset } = useMathjax({ value: container });

  const pending = typeset();
  await vi.advanceTimersByTimeAsync(10000);
  await pending;
  expect(mathjax.typesetPromise).not.toHaveBeenCalled();

  mathjax.startup.promise = Promise.resolve();
  await typeset();
  expect(mathjax.typesetPromise).toHaveBeenCalledWith([container]);
  expect(vi.getTimerCount()).toBe(0);
});
