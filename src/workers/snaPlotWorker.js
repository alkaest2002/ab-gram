/**
 * SNA plot regeneration worker.
 *
 * Rebuilds a single SNA plot with updated ForceAtlas2 settings off the main
 * thread, so changing the layout does not freeze the UI. The heavy work is
 * `regenerateSnaPlot`, which rebuilds the graph and runs the force layout.
 *
 * Inbound message:  { members, accentColor, config }
 * Outbound message: { svg } or { error: string } when something went wrong.
 */

import { regenerateSnaPlot } from "@/analysis/sna/plots/regenerateSnaPlots.js";

self.onmessage = (event) => {
  try {
    const { members, accentColor, config } = event.data ?? {};
    const plot = regenerateSnaPlot(members ?? [], accentColor, config);
    self.postMessage({ svg: plot.svg });
  } catch (error) {
    console.error("SNA plot worker error:", error, error?.stack);
    self.postMessage({
      error: error?.message ?? "Impossibile rigenerare il grafico.",
    });
  }
};
