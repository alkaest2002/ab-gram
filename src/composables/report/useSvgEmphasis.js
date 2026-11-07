// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { watchEffect } from "vue";

/**
 * Toggle `.is-dimmed` CSS classes on SVG elements injected via `v-html`.
 *
 * The SVG produced by `snaPlots.js` stamps every node element with
 * `data-node="<id>"` and every edge with `data-source="<id>"`. This
 * composable watches a reactive `dimmedNodes` set and flips the `.is-dimmed`
 * class on the matching elements, plus swaps `marker-end` URLs so arrowheads
 * follow suit. No SVG is rebuilt — only classes and attributes are toggled.
 *
 * The effect uses `flush: 'post'` so it runs *after* Vue has patched the DOM,
 * guaranteeing that the `v-html` content is present when we query it.
 *
 * @param {import("vue").Ref<HTMLElement|null>} containerRef
 *   Template ref wrapping the `v-html` div that holds the injected SVG.
 * @param {import("vue").ComputedRef<Set<string>>} dimmedNodes
 *   The set of node ids that should currently appear dimmed.
 * @param {import("vue").Ref<string>|import("vue").ComputedRef<string>} svgContent
 *   Reactive SVG markup string. Accessed inside the effect solely to register
 *   it as a dependency, so the effect re-runs whenever `v-html` replaces the
 *   DOM (e.g. after a worker regeneration) and classes need to be re-applied
 *   to the fresh elements.
 */
export function useSvgEmphasis(containerRef, dimmedNodes, svgContent) {
  watchEffect(
    () => {
      const container = containerRef.value;
      if (!container) return;

      // Track the SVG markup so the effect re-runs when v-html replaces the
      // DOM with new elements that lack the `.is-dimmed` class.
      // eslint-disable-next-line no-unused-expressions
      svgContent.value;

      const dimmed = dimmedNodes.value;
      const svg = container.querySelector("svg");
      if (!svg) return;

      const accentMarker = svg.dataset.accentMarker;
      const dimmedMarker = svg.dataset.dimmedMarker;

      // Toggle classes on node circles and labels.
      container.querySelectorAll("[data-node]").forEach((el) => {
        el.classList.toggle("is-dimmed", dimmed.has(el.dataset.node));
      });

      // Toggle classes on edges and swap arrowhead marker URLs.
      container.querySelectorAll("[data-source]").forEach((el) => {
        const isDimmed = dimmed.has(el.dataset.source);
        el.classList.toggle("is-dimmed", isDimmed);

        // Swap the marker-end reference so the arrowhead color matches.
        if (el.hasAttribute("marker-end")) {
          const markerId = isDimmed ? dimmedMarker : accentMarker;
          el.setAttribute("marker-end", `url(#${markerId})`);
        }
      });

      // SVG has no z-index: paint order follows document order. Re-append
      // emphasized elements after dimmed ones so they are painted on top.
      // Order: dimmed edges → emphasized edges → dimmed nodes → emphasized nodes.
      //
      // Only the connected nodes (direct `<svg>` children) are reordered. The
      // isolated nodes live inside a translated `<g>`; re-appending them to the
      // root would drop that transform and shift them up into the graph.
      if (dimmed.size > 0) {
        const edges = [...svg.querySelectorAll("[data-source]")];
        const nodes = [...svg.querySelectorAll("circle[data-node]")].filter(
          (circle) => circle.parentNode === svg,
        );

        for (const edge of edges) {
          if (!edge.classList.contains("is-dimmed")) svg.appendChild(edge);
        }
        for (const circle of nodes) {
          // Each node is a circle + text pair; move both together.
          const text = circle.nextElementSibling;
          if (circle.classList.contains("is-dimmed")) {
            svg.appendChild(circle);
            if (text) svg.appendChild(text);
          }
        }
        for (const circle of nodes) {
          const text = circle.nextElementSibling;
          if (!circle.classList.contains("is-dimmed")) {
            svg.appendChild(circle);
            if (text) svg.appendChild(text);
          }
        }
      }
    },
    { flush: "post" },
  );
}
