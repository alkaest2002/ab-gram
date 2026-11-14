// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { getSociogramAnalysis } from "@/analysis/analysisMain.js";

/**
 * Generates a complete sociogram report outside the main thread.
 *
 * The request must contain a structured-cloneable, non-reactive snapshot of
 * the members. The successful response has the same shape as
 * `getSociogramAnalysis`; failures are returned as an error response rather
 * than thrown across the worker boundary.
 *
 * @typedef {object} ReportWorkerRequest
 * @property {Parameters<typeof getSociogramAnalysis>[0]} members - Members to analyse.
 *
 * @typedef {object} WorkerErrorResponse
 * @property {string} error - Human-readable failure message.
 *
 * @typedef {ReturnType<typeof getSociogramAnalysis> | WorkerErrorResponse} ReportWorkerResponse
 */

/**
 * Run the full sociogram analysis for an incoming request.
 *
 * @param {MessageEvent<ReportWorkerRequest>} event - Worker request event.
 * @returns {void}
 */
self.onmessage = (event) => {
  try {
    const members = event.data?.members ?? [];
    const result = getSociogramAnalysis(members);
    self.postMessage(result);
  } catch (error) {
    console.error("Worker error:", error, error?.stack);
    self.postMessage({
      error: error?.message ?? "Impossibile generare il report.",
    });
  }
};
