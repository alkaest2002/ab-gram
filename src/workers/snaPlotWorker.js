// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { createSnaNetwork } from "@/analysis/sna/snaBase.js";
import { getSnaPlot } from "@/analysis/sna/plots/snaPlots.js";

/**
 * Regenerates one SNA plot outside the main thread.
 *
 * A fresh preference graph is built from the member snapshot, positioned with
 * the requested ForceAtlas2 configuration, and serialized to SVG. Building a
 * new graph also gives the layout a new random starting position.
 *
 * @typedef {object} SnaPlotWorkerConfig
 * @property {Parameters<typeof createSnaNetwork>[1]} typeOfPreference - Preference graph to build.
 * @property {object} settings - ForceAtlas2 layout settings.
 * @property {number} settings.scalingRatio - Repulsion scaling factor.
 * @property {number} settings.gravity - Attraction toward the layout center.
 *
 * @typedef {object} SnaPlotWorkerRequest
 * @property {Parameters<typeof createSnaNetwork>[0]} members - Members used to rebuild the graph.
 * @property {string} accentColor - CSS color used to render nodes and edges.
 * @property {SnaPlotWorkerConfig} config - Graph and layout configuration.
 *
 * @typedef {object} SnaPlotWorkerSuccessResponse
 * @property {string} svg - Serialized SVG markup for the regenerated plot.
 *
 * @typedef {object} WorkerErrorResponse
 * @property {string} error - Human-readable failure message.
 *
 * @typedef {SnaPlotWorkerSuccessResponse | WorkerErrorResponse} SnaPlotWorkerResponse
 */

/**
 * Rebuild and render an SNA plot for an incoming request.
 *
 * @param {MessageEvent<SnaPlotWorkerRequest>} event - Worker request event.
 * @returns {void}
 */
self.onmessage = (event) => {
  try {
    const { members, accentColor, config } = event.data ?? {};
    const { typeOfPreference, ...forceAtlas2Config } = config;
    const network = createSnaNetwork(members, typeOfPreference);
    const plot = getSnaPlot(network, accentColor, forceAtlas2Config)[0];
    self.postMessage({ svg: plot.svg });
  } catch (error) {
    console.error("SNA plot worker error:", error, error?.stack);
    self.postMessage({
      error: error?.message ?? "Impossibile rigenerare il grafico.",
    });
  }
};
