// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { getGroupAnalysis } from "@/analysis/analysisMain.js";

/**
 * Generates a complete group report outside the main thread.
 *
 * The request must contain a structured-cloneable, non-reactive snapshot of
 * the members. The successful response has the same shape as
 * `getGroupAnalysis`; failures are returned as an error response rather
 * than thrown across the worker boundary.
 *
 * @typedef {object} ReportWorkerRequest
 * @property {Parameters<typeof getGroupAnalysis>[0]} members - Members to analyse.
 *
 * @typedef {object} WorkerErrorResponse
 * @property {string} error - Human-readable failure message.
 *
 * @typedef {ReturnType<typeof getGroupAnalysis> | WorkerErrorResponse} ReportWorkerResponse
 */

/**
 * Run the full group analysis for an incoming request.
 *
 * @param {MessageEvent<ReportWorkerRequest>} event - Worker request event.
 * @returns {void}
 */
self.onmessage = (event) => {
  try {
    const members = event.data?.members ?? [];
    const result = getGroupAnalysis(members);
    self.postMessage(result);
  } catch (error) {
    console.error("Worker error:", error, error?.stack);
    self.postMessage({
      error: error?.message ?? "Impossibile generare il report.",
    });
  }
};
