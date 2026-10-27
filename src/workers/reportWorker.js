// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Report generation worker.
 *
 * Receives a plain (non-reactive) snapshot of the sociogram members and runs
 * the full sociogram analysis (`getSociogramAnalysis`), which computes the
 * adjacency matrices, edge types, Moreno metrics, SNA metrics, components and
 * SVG plots.
 *
 * Inbound message:  { members: Member[] }
 * Outbound message: the combined sociogram analysis result (see
 *                   `getSociogramAnalysis`), or { error: string } when
 *                   something went wrong.
 */

import { getSociogramAnalysis } from "@/analysis/analysisMain.js";

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
