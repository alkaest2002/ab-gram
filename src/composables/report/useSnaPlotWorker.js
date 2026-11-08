// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { onBeforeUnmount, ref } from "vue";

import { createSnaPlotWorker } from "@/workers/workerHelpers";

/**
 * Reactive lifecycle manager for the SNA plot regeneration worker.
 *
 * Wraps the instantiation, message handling, and termination of the
 * `snaPlotWorker` web worker so the owning component stays declarative: it
 * calls `regenerate()` with a snapshot of the members and ForceAtlas2 settings,
 * and receives the regenerated SVG (or an error) through the `onSuccess` /
 * `onError` callbacks. The worker is terminated automatically on unmount, and
 * `stop()` can cancel a regeneration in flight (e.g. the modal's "Stop" action).
 *
 * @param {{ onSuccess?: (svg: string | undefined) => void, onError?: (message: string) => void }} [options]
 *   Callbacks invoked when the worker completes or fails. `onError` also fires
 *   on instantiation failure (e.g. a worker blocked by the browser).
 * @returns {{
 *   isRegenerating: import("vue").Ref<boolean>,
 *   regenerate: (payload: {
 *     members: Array,
 *     accentColor: string,
 *     typeOfSna: string,
 *     settings: { scalingRatio: number, gravity: number },
 *   }) => void,
 *   stop: () => void,
 * }}
 */
export function useSnaPlotWorker({ onSuccess, onError } = {}) {
  const isRegenerating = ref(false);

  /** The live worker, kept so it can be terminated mid-flight. */
  let worker = null;

  /** Terminate the worker (if any) and clear the in-flight flag. */
  function stop() {
    if (worker) {
      worker.terminate();
      worker = null;
    }
    isRegenerating.value = false;
  }

  /**
   * Regenerate a single SNA plot off the main thread.
   *
   * @param {object} payload
   * @param {Array} payload.members - Members used to rebuild the graph.
   * @param {string} payload.accentColor - Plot accent color.
   * @param {string} payload.typeOfSna - "likes" | "dislikes".
   * @param {{scalingRatio: number, gravity: number}} payload.settings - ForceAtlas2 settings.
   */
  function regenerate({ members, accentColor, typeOfSna, settings }) {
    if (isRegenerating.value) return;

    try {
      worker = createSnaPlotWorker();
    } catch (err) {
      console.error("Failed to create SNA plot worker:", err);
      onError?.("Impossibile avviare il worker.");
      return;
    }

    isRegenerating.value = true;

    worker.onmessage = (event) => {
      const { data } = event;
      stop();

      if (data?.error) {
        onError?.(data.error);
        return;
      }
      // Call the success callback with the regenerated SVG.
      onSuccess?.(data?.svg);
    };

    worker.onerror = () => {
      stop();
      // Call the error callback with a generic error message.
      onError?.("Impossibile rigenerare il grafico.");
    };

    // Hand the worker a plain, non-reactive snapshot of the members so it can
    // be structured-cloned without dragging Vue proxies across the boundary.
    worker.postMessage({
      members: JSON.parse(JSON.stringify(members)),
      accentColor,
      config: {
        typeOfPreference: typeOfSna,
        settings,
      },
    });
  }

  onBeforeUnmount(stop);

  return { isRegenerating, regenerate, stop };
}
