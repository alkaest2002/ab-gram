// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { nextTick, onMounted } from "vue";

/**
 * Lazily injects the MathJax loader script the first time typesetting is
 * actually needed, so non-docs routes never download it.
 *
 * `window.MathJax` starts as the config object from index.html (which has a
 * `startup` block but no `startup.promise`); the loaded library replaces it
 * and adds `startup.promise`. That is the signal we use to detect "already
 * loaded" so we never inject twice.
 */
const MATHJAX_SRC = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js";
let injected = false;

/** Ensure the MathJax loader has been requested at most once. */
function ensureMathJax() {
  if (injected || window.MathJax?.startup?.promise) return;
  injected = true;

  const script = document.createElement("script");
  script.src = MATHJAX_SRC;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Shared wait for MathJax startup or the loader fallback.
 *
 * `MathJax.startup.promise` is the promise resolved when `pageReady()` is
 * done (MathJax runs its startup typesetting, then resolves). The `MathJax`
 * global starts as a plain config object and is replaced by the loaded
 * library asynchronously, so `startup.promise` doesn't exist until the loader
 * has run. We poll for it once and then wait on that promise. The result is
 * memoized so every caller shares a single poll.
 */
/** @type {Promise<boolean> | null} */
let readyPromise = null;

/**
 * Share one deadline for loader discovery and startup. A rejection or timeout
 * skips this typeset attempt; a later call can retry if the loader recovers.
 *
 * @param {number} [timeoutMs=10000]
 * @returns {Promise<boolean>} Whether startup completed before the deadline.
 */
function mathjaxReady(timeoutMs = 10000) {
  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve) => {
    let settled = false;

    /** Stop both timers and notify all waiters; a failed attempt can be retried. */
    function finish(ready) {
      // Startup can settle after the timeout; don't clear a newer retry's promise.
      if (settled) return;
      settled = true;
      if (!ready) readyPromise = null;
      clearInterval(poll);
      clearTimeout(deadline);
      resolve(ready);
    }

    /** If the loader has exposed its startup promise, wait for it; otherwise let polling continue. */
    async function attach() {
      const startup = window.MathJax?.startup?.promise;
      if (!startup) return;
      // We found the loader. Stop polling, but keep the deadline while startup runs.
      clearInterval(poll);
      try {
        await startup;
        finish(true);
      } catch {
        finish(false);
      }
    }

    const poll = setInterval(attach, 50);
    const deadline = setTimeout(() => finish(false), timeoutMs);
    // Check now rather than waiting for the first poll. Callers await readyPromise,
    // not this probe; attach handles startup rejection itself.
    void attach();
  });

  return readyPromise;
}

/**
 * Re-typesets the math inside `containerRef` once it is in the DOM, and keeps
 * MathJax's internal state consistent across SPA navigation.
 *
 * MathJax runs automatically only on page load, but the docs are rendered
 * client-side by Vue (and swapped on navigation), so we have to run it again
 * whenever the article content is (re)rendered.
 *
 * @param {import("vue").Ref<HTMLElement | null>} containerRef
 * @returns {{ typeset: () => Promise<void>, clear: () => void }}
 */
export function useMathjax(containerRef) {
  /**
   * Tells MathJax to forget any math previously typeset inside `containerRef`
   * and to reset TeX state (labels and automatic equation numbering).
   *
   * Per https://docs.mathjax.org/en/latest/advanced/typeset.html this MUST run
   * before the container's content is removed/replaced, otherwise MathJax keeps
   * orphaned `MathItem`s in its internal list: memory grows and re-rendering
   * can touch stale expressions. `texReset()` stops equation numbering and
   * labels leaking from one page into the next.
   */
  function clear() {
    const mathjax = window.MathJax;
    if (!mathjax) return;

    if (containerRef.value) mathjax.typesetClear?.([containerRef.value]);
    mathjax.texReset?.();
  }

  /** Re-typeset the current container after MathJax and Vue are ready. */
  async function typeset() {
    ensureMathJax();
    if (!(await mathjaxReady())) return;
    await nextTick();

    if (containerRef.value && window.MathJax?.typesetPromise) {
      try {
        await window.MathJax.typesetPromise([containerRef.value]);
      } catch {
        // MathJax can reject if typesetting races with navigation; harmless.
      }
    }
  }

  onMounted(typeset);

  return { typeset, clear };
}
