// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { afterEach, expect, it, vi } from "vite-plus/test";

vi.mock("vue", async (importOriginal) => ({ ...(await importOriginal()), onMounted: vi.fn() }));

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
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
  await vi.advanceTimersByTimeAsync(20000);
  await pending;
  expect(mathjax.typesetPromise).not.toHaveBeenCalled();

  mathjax.startup.promise = Promise.resolve();
  await typeset();
  expect(mathjax.typesetPromise).toHaveBeenCalledWith([container]);
  expect(vi.getTimerCount()).toBe(0);
});

it("typesets without navigation when startup recovers at the first timeout", async () => {
  vi.useFakeTimers();
  const mathjax = { startup: { promise: new Promise(() => {}) }, typesetPromise: vi.fn() };
  vi.stubGlobal("window", { MathJax: mathjax });
  const { useMathjax } = await import("@/composables/docs/useMathjax");
  const pending = useMathjax({ value: {} }).typeset();
  mathjax.startup.promise = Promise.resolve();
  await vi.advanceTimersByTimeAsync(10000);
  await pending;
  expect(mathjax.typesetPromise).toHaveBeenCalledOnce();
  expect(vi.getTimerCount()).toBe(0);
});

it("logs startup rejection and stops without waiting for a timeout", async () => {
  vi.useFakeTimers();
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const { useMathjax } = await import("@/composables/docs/useMathjax");
  const error = new Error("startup failed");
  const mathjax = { startup: { promise: Promise.reject(error) }, typesetPromise: vi.fn() };
  vi.stubGlobal("window", { MathJax: mathjax });
  await useMathjax({ value: {} }).typeset();
  expect(warn).toHaveBeenCalledWith("MathJax startup failed:", error);
  expect(mathjax.typesetPromise).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
