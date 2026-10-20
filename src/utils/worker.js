/**
 * Worker instantiation helpers.
 *
 * The actual worker entry scripts live in `src/workers` and are imported here
 * with Vite's `?worker` suffix. This module is the single place that knows how
 * to construct them, so the instantiation/error-handling boilerplate is shared
 * instead of being duplicated per worker.
 *
 * Usage:
 * ```js
 * import { createReportWorker, preloadReportWorker } from "@/utils/worker";
 *
 * // Warm the (large) report chunk in the background, e.g. in Home.vue.
 * requestIdleCallback(() => preloadReportWorker().catch(console.warn));
 *
 * // Run the analysis.
 * const worker = createReportWorker();
 * worker.onmessage = (event) => console.log("Worker result:", event.data);
 * worker.postMessage({ members: [...] });
 * ```
 */

import ReportWorker from "@/workers/reportWorker.js?worker";
import SnaPlotWorker from "@/workers/snaPlotWorker.js?worker";

// Track which worker chunks have already been preloaded, keyed by their
// creator so the bookkeeping is shared rather than duplicated per worker.
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
 * Preload a worker chunk in the background.
 *
 * Constructing the worker triggers the browser to fetch its chunk; the worker's
 * top-level scope has no side effects, so it's discarded right away. The real
 * instantiation (via `createReportWorker`/`createSnaPlotWorker`) is then served
 * from cache. Each worker is preloaded at most once.
 *
 * @param {() => Worker} createWorker - The worker creator.
 * @param {string} label - Human-readable name used in logs.
 */
const preloadWorker = (createWorker, label) => {
  if (preloadedWorkers.has(createWorker)) return;

  createWorker().terminate();

  preloadedWorkers.add(createWorker);
  console.debug(`✓ ${label} worker module preloaded`);
};

/**
 * Preload the report worker chunk in the background.
 *
 * @returns {Promise<void>} A promise that rejects if preloading fails.
 */
export const preloadReportWorker = async () =>
  preloadWorker(createReportWorker, "Report");

/**
 * Preload the SNA plot worker chunk in the background.
 *
 * @returns {Promise<void>} A promise that rejects if preloading fails.
 */
export const preloadSnaPlotWorker = async () =>
  preloadWorker(createSnaPlotWorker, "SNA plot");
