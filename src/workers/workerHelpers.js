// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Constructs and preloads the application's Web Workers.
 *
 * Vite's `?worker` imports provide worker constructors, while `?worker&url`
 * imports provide the emitted chunk URLs used for cache warming. Keeping both
 * details here gives callers a bundler-independent API and centralizes
 * instantiation errors and best-effort preloading.
 *
 * Usage:
 * ```js
 * import { createReportWorker, preloadReportWorker } from "@/workers/workerHelpers";
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

/** Worker chunk URLs for which a preload has already been attempted. @type {Set<string>} */
const preloadedWorkers = new Set();

/**
 * Construct a worker and normalize constructor failures.
 *
 * @param {new () => Worker} WorkerCtor - Constructor exposed by a Vite `?worker` import.
 * @param {string} label - Human-readable worker name used in diagnostics.
 * @returns {Worker} A newly started worker.
 * @throws {Error} When the browser cannot instantiate the worker.
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
export const preloadReportWorker = () => prefetchWorker(reportWorkerUrl, "Report");

/**
 * Preload the SNA plot worker chunk in the background.
 *
 * @returns {Promise<void>} A promise that resolves once the prefetch settles.
 */
export const preloadSnaPlotWorker = () => prefetchWorker(snaPlotWorkerUrl, "SNA plot");
