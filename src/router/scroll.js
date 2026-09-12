// Coordinates the router's `scrollBehavior` with the page-level `<Transition>`.
//
// Vue Router runs `scrollBehavior` as soon as navigation is confirmed, before an
// `out-in` transition has finished. Scrolling immediately makes the outgoing page
// jump while it is still fading out. To avoid that, `scrollBehavior` returns a
// promise and we resolve it from `PageTransition` once its enter transition ends.

let resolveScroll = null;
let fallbackTimer = null;

// Safety net for navigations that don't go through a page transition (e.g.
// re-navigating to the current route). A normal transition finishes well under
// this, so the fallback only fires when no `after-enter` ever arrives.
const TRANSITION_TIMEOUT = 500;

/**
 * Wait for the page transition to finish.
 * Used by `scrollBehavior` in `src/router/index.js`.
 */
export function waitForPageTransition() {
  clearTimeout(fallbackTimer);

  return new Promise((resolve) => {
    resolveScroll = resolve;
    fallbackTimer = setTimeout(() => {
      resolveScroll?.();
      resolveScroll = null;
    }, TRANSITION_TIMEOUT);
  });
}

/**
 * Resolve the pending scroll. Called by `PageTransition` on `@after-enter`.
 */
export function resolvePageTransition() {
  if (resolveScroll) {
    clearTimeout(fallbackTimer);
    resolveScroll();
    resolveScroll = null;
  }
}
