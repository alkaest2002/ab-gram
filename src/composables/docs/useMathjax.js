import { nextTick, onMounted } from "vue";

/**
 * Resolves once MathJax has finished loading and is ready to typeset.
 *
 * In this SPA, MathJax can finish loading either before or after Vue mounts,
 * so we can't assume `typesetPromise` exists yet — we wait on MathJax's own
 * startup promise (polling until the loader script has replaced the global).
 */
function mathjaxReady(timeoutMs = 10000) {
  return new Promise((resolve) => {
    if (window.MathJax?.startup?.promise) {
      window.MathJax.startup.promise.then(resolve);
      return;
    }

    const poll = setInterval(() => {
      if (window.MathJax?.startup?.promise) {
        clearInterval(poll);
        window.MathJax.startup.promise.then(resolve);
      }
    }, 50);

    setTimeout(() => {
      clearInterval(poll);
      resolve();
    }, timeoutMs);
  });
}

/**
 * Re-typesets the math inside `containerRef` once it is in the DOM.
 *
 * MathJax runs automatically only on page load, but the docs are rendered
 * client-side by Vue (and swapped on navigation), so we have to run it again
 * whenever the article content is (re)rendered.
 */
export function useMathjax(containerRef) {
  async function typeset() {
    await mathjaxReady();
    await nextTick();

    if (window.MathJax?.typesetPromise && containerRef.value) {
      try {
        await window.MathJax.typesetPromise([containerRef.value]);
      } catch {
        // MathJax can reject if typesetting races with navigation; harmless.
      }
    }
  }

  onMounted(typeset);

  return { typeset };
}
