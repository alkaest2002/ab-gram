/**
 * Worker Loader - Handles preloading and instantiation of heavy workers
 *
 * Usage:
 * 1. In Home.vue (or root component):
 *    import { preloadWorker } from '@/utils/workerLoader'
 *    onMounted(() => {
 *      requestIdleCallback(() => preloadWorker())
 *    })
 *
 * 2. In Report.vue (or any component using the worker):
 *    import { createReportWorker } from '@/utils/workerLoader'
 *    worker = createReportWorker()
 */

import ReportWorker from '@/workers/reportWorker.js?worker';

// Track whether the worker chunk has already been preloaded.
let isPreloaded = false;

/**
 * Preload the worker chunk in the background.
 *
 * This should be called early (e.g., in Home.vue onMounted) to download the
 * worker chunk before it's actually needed. Constructing the worker triggers
 * the browser to fetch its (large) chunk, so the real instantiation in
 * `createReportWorker` is served from cache.
 *
 * Benefits:
 * - Worker chunk is cached by the browser
 * - The actual worker instantiation loads from cache
 * - Reduces perceived latency when the worker is actually needed
 *
 * Safe to call multiple times (uses a flag to prevent duplicates).
 *
 * @returns {Promise<void>}
 */
export const preloadWorker = async () => {
  if (isPreloaded) return;

  // Constructing the worker starts the download of its chunk. The worker's
  // top-level scope has no side effects, so it's discarded right away.
  createReportWorker().terminate();

  isPreloaded = true;
  console.debug('✓ Worker module preloaded successfully');
};

/**
 * Create and instantiate the report worker
 *
 * This should be called when you actually need to run the worker.
 * If preloadWorker() was called earlier, the bundle will load from cache.
 *
 * Example:
 * ```js
 * const worker = createReportWorker();
 * worker.onmessage = (event) => {
 *   console.log('Worker result:', event.data);
 * };
 * worker.postMessage({ members: [...] });
 * ```
 *
 * @returns {Worker} A new Worker instance
 * @throws {Error} If worker instantiation fails
 */
export const createReportWorker = () => {
  try {
    const worker = new ReportWorker();
    console.debug('✓ Report worker instantiated');
    return worker;
  } catch (error) {
    console.error('Failed to create report worker:', error);
    throw new Error(`Worker instantiation failed: ${error.message}`);
  }
};

/**
 * Check if worker bundle is preloaded
 * Useful for debugging or conditional logic
 *
 * @returns {boolean} True if preloadWorker() has been called
 */
export const isWorkerPreloaded = () => {
  return isPreloaded;
};
