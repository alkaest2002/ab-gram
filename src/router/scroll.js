// Coordinates the router's `scrollBehavior` with the page-level `<Transition>`.
//
// Vue Router runs `scrollBehavior` as soon as navigation is confirmed, before an
// `out-in` transition has finished. Scrolling right away makes the outgoing page
// jump while it is still fading out; scrolling at `after-enter` makes the incoming
// page flash at the old scroll position before it jumps to the top.
//
// The sweet spot is the entering element's `before-enter` hook: with
// `mode="out-in"` it fires after the outgoing page has fully left but before the
// incoming page is inserted, so the scroll change is never visible. `scrollBehavior`
// therefore returns a promise and we resolve it from `PageTransition` on
// `@before-enter`.

let resolveScroll = null;
let fallbackTimer = null;

// Safety net for navigations that don't go through a page transition (e.g.
// re-navigating to the current route). A normal transition finishes well under
// this, so the fallback only fires when no `before-enter` ever arrives.
const TRANSITION_TIMEOUT = 500;

/**
 * Wait for the incoming page transition to begin.
 * Used by `scrollBehavior` in `src/router/index.js`.
 */
export function waitForPageTransition() {
  clearTimeout(fallbackTimer);

  // If a previous navigation is still pending (rapid consecutive navigations),
  // settle it now so its promise doesn't hang and it can't fight the newer one.
  if (resolveScroll) {
    resolveScroll();
    resolveScroll = null;
  }

  return new Promise((resolve) => {
    resolveScroll = resolve;
    fallbackTimer = setTimeout(() => {
      if (resolveScroll) {
        resolveScroll();
        resolveScroll = null;
      }
    }, TRANSITION_TIMEOUT);
  });
}

/**
 * Resolve the pending scroll. Called by `PageTransition` on `@before-enter`.
 */
export function resolvePageTransition() {
  if (resolveScroll) {
    clearTimeout(fallbackTimer);
    resolveScroll();
    resolveScroll = null;
  }
}
