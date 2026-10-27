// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Worker instantiation helpers.
 *
 * The actual worker entry scripts live in `src/workers` and are imported here
 * with Vite's `?worker` suffix (for the constructor) and `?worker&url` (for the
 * built chunk URL, used to warm the browser cache). This module is the single
 * place that knows how to construct them, so the instantiation/error-handling
 * boilerplate is shared instead of being duplicated per worker.
 *
 * Usage:
 * ```js
 * import { createReportWorker, preloadReportWorker } from "@/utils/worker";
 *
 * // Warm the (large) report chunk in the background.
 * preloadReportWorker();
 *
 * // Run the analysis.
 * const worker = createReportWorker();
 * worker.onmessage = (event) => console.log("Worker result:", event.data);
 * worker.postMessage({ members: [...] });
 * ```
 */

import ReportWorker from "@/workers/reportWorker.js?worker";
import SnaPlotWorker from "@/workers/snaPlotWorker.js?worker";
import reportWorkerUrl from "@/workers/reportWorker.js?worker&url";
import snaPlotWorkerUrl from "@/workers/snaPlotWorker.js?worker&url";

// Track which worker chunks have already been preloaded, keyed by their URL so
// the bookkeeping is shared rather than duplicated per worker.
const preloadedWorkers = new Set();

/**
 * Construct a worker, normalising instantiation errors.
 *
 * @param {new () => Worker} WorkerCtor - The Vite `?worker` module.
 * @param {string} label - Human-readable name used in logs and errors.
 * @returns {Worker} A new Worker instance.
 * @throws {Error} If worker instantiation fails.
 */
const instantiate = (WorkerCtor, label) => {
  try {
    const worker = new WorkerCtor();
    console.debug(`✓ ${label} worker instantiated`);
    return worker;
  } catch (error) {
    console.error(`Failed to create ${label} worker:`, error);
    throw new Error(`Worker instantiation failed: ${error.message}`);
  }
};

/**
 * Create and instantiate the report worker (full sociogram analysis).
 *
 * @returns {Worker} A new Worker instance.
 * @throws {Error} If worker instantiation fails.
 */
export const createReportWorker = () => instantiate(ReportWorker, "Report");

/**
 * Create and instantiate the SNA plot worker (single plot regeneration).
 *
 * @returns {Worker} A new Worker instance.
 * @throws {Error} If worker instantiation fails.
 */
export const createSnaPlotWorker = () => instantiate(SnaPlotWorker, "SNA plot");

/**
 * Warm the browser's HTTP cache for a worker chunk in the background.
 *
 * The chunk is fetched directly rather than constructed and immediately
 * terminated: `new Worker(url).terminate()` can abort the download before it
 * completes, leaving the chunk uncached when the real worker is created.
 * Prefetching the URL populates the cache so `createReportWorker` /
 * `createSnaPlotWorker` is served locally. Each chunk is prefetched at most once.
 *
 * @param {string} url - The built worker chunk URL.
 * @param {string} label - Human-readable name used in logs.
 * @returns {Promise<void>} Resolves once the prefetch settles (never rejects).
 */
const prefetchWorker = async (url, label) => {
  if (preloadedWorkers.has(url)) return;
  preloadedWorkers.add(url);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.debug(`✓ ${label} worker module prefetched`);
  } catch (error) {
    // Best-effort: on failure the worker simply loads on demand.
    console.warn(`Failed to prefetch ${label} worker module:`, error);
  }
};

/**
 * Preload the report worker chunk in the background.
 *
 * @returns {Promise<void>} A promise that resolves once the prefetch settles.
 */
export const preloadReportWorker = () =>
  prefetchWorker(reportWorkerUrl, "Report");

/**
 * Preload the SNA plot worker chunk in the background.
 *
 * @returns {Promise<void>} A promise that resolves once the prefetch settles.
 */
export const preloadSnaPlotWorker = () =>
  prefetchWorker(snaPlotWorkerUrl, "SNA plot");
