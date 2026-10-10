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

function ensureMathJax() {
  if (injected || window.MathJax?.startup?.promise) return;
  injected = true;

  const script = document.createElement("script");
  script.src = MATHJAX_SRC;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Shared promise that resolves once MathJax has finished loading and its
 * startup sequence has completed.
 *
 * `MathJax.startup.promise` is the promise resolved when `pageReady()` is
 * done (MathJax runs its startup typesetting, then resolves). The `MathJax`
 * global starts as a plain config object and is replaced by the loaded
 * library asynchronously, so `startup.promise` doesn't exist until the loader
 * has run. We poll for it once and then wait on that promise. The result is
 * memoized so every caller shares a single poll.
 */
let readyPromise = null;

function mathjaxReady(timeoutMs = 10000) {
  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve) => {
    const attach = () => {
      const startup = window.MathJax?.startup;
      if (!startup?.promise) return false;
      startup.promise.then(resolve);
      return true;
    };

    if (attach()) return;

    const poll = setInterval(() => {
      if (attach()) clearInterval(poll);
    }, 50);

    // Fallback so callers never hang if the loader fails to run.
    setTimeout(() => {
      clearInterval(poll);
      resolve();
    }, timeoutMs);
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

  async function typeset() {
    ensureMathJax();
    await mathjaxReady();
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
