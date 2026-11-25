// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { nextTick, onMounted } from "vue";

// MathJax CDN URL for the loader script.
const MATHJAX_SRC = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js";

/** @type {Promise<boolean> | null} Shared by all docs pages. */
let readyPromise = null;

/** Load MathJax on demand, then wait for its own startup work. */
async function loadMathJax() {
  try {
    if (!window.MathJax?.startup?.promise) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = MATHJAX_SRC;
        script.onload = resolve;
        script.onerror = () => {
          script.remove();
          reject(new Error("MathJax script failed to load"));
        };
        document.head.appendChild(script);
      });
    }
    const startup = window.MathJax?.startup?.promise;
    if (!startup) throw new Error("MathJax loader did not initialize startup");
    await startup;
    return true;
  } catch (error) {
    console.warn("MathJax startup failed:", error);
    readyPromise = null;
    return false;
  }
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
    readyPromise ??= loadMathJax();
    if (!(await readyPromise)) return;
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
