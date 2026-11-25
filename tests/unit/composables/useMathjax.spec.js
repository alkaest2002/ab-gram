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

function mockLoader() {
  const script = { remove: vi.fn() };
  const appendChild = vi.fn();
  vi.stubGlobal("document", { createElement: () => script, head: { appendChild } });
  vi.stubGlobal("window", { MathJax: { startup: {} } });
  return { script, appendChild };
}

it("shares one download and waits for startup before typesetting", async () => {
  const { useMathjax } = await import("@/composables/docs/useMathjax");
  const { script, appendChild } = mockLoader();
  const { typeset } = useMathjax({ value: {} });
  expect(appendChild).not.toHaveBeenCalled();
  const pending = [typeset(), typeset()];
  expect(appendChild).toHaveBeenCalledOnce();
  const startup = Promise.withResolvers();
  window.MathJax = { startup, typesetPromise: vi.fn() };
  script.onload();
  await Promise.resolve();
  expect(window.MathJax.typesetPromise).not.toHaveBeenCalled();
  startup.resolve();
  await Promise.all(pending);
  expect(window.MathJax.typesetPromise).toHaveBeenCalledTimes(2);
});

it("allows another download after a script error", async () => {
  const { useMathjax } = await import("@/composables/docs/useMathjax");
  const { script, appendChild } = mockLoader();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const { typeset } = useMathjax({ value: {} });
  const first = typeset();
  script.onerror();
  await first;
  expect(script.remove).toHaveBeenCalledOnce();
  const second = typeset();
  expect(appendChild).toHaveBeenCalledTimes(2);
  window.MathJax = { startup: { promise: Promise.resolve() }, typesetPromise: vi.fn() };
  script.onload();
  await second;
  expect(window.MathJax.typesetPromise).toHaveBeenCalledOnce();
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
