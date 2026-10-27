// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * SNA plot regeneration worker.
 *
 * Rebuilds a single SNA plot with updated ForceAtlas2 settings off the main
 * thread, so changing the layout does not freeze the UI. It rebuilds the
 * preference graph from the members (which also assigns a fresh random starting
 * layout), runs the force layout, and renders the SVG.
 *
 * Inbound message:  { members, accentColor, config }
 * Outbound message: { svg } or { error: string } when something went wrong.
 */

import { createLikesGraph } from "@/analysis/sna/snaBase.js";
import { getSnaPlot } from "@/analysis/sna/plots/snaPlots.js";

self.onmessage = (event) => {
  try {
    const { members, accentColor, config } = event.data ?? {};
    const { typeOfPreference, ...forceAtlas2Config } = config;
    const graph = createLikesGraph(members, typeOfPreference);
    const plot = getSnaPlot(graph, accentColor, forceAtlas2Config)[0];
    self.postMessage({ svg: plot.svg });
  } catch (error) {
    console.error("SNA plot worker error:", error, error?.stack);
    self.postMessage({
      error: error?.message ?? "Impossibile rigenerare il grafico.",
    });
  }
};
