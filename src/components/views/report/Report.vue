<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { onBeforeMount, onBeforeUnmount } from "vue";

import { useRouter } from "vue-router";

import { useReportStore } from "@/stores/report";
import { useGroupStore } from "@/stores/group";

import ReportLoading from "@/components/views/report/ReportLoading.vue";

import { createReportWorker } from "@/workers/workerHelpers";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------
const router = useRouter();

// --- Stores -------------
const reportStore = useReportStore();
const groupStore = useGroupStore();

// --- State --------------
/** @type {Worker | null} Active report generation worker. */
let worker = null;

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onBeforeMount(() => {
  reportStore.setStatus("generating");
  startGeneration();
});

onBeforeUnmount(() => {
  stopWorker();
});

// --- Methods ------------
function startGeneration() {
  worker = createReportWorker();

  // Worker lifecycle: a script load or execution failure is not a reply.
  worker.onerror = (event) => {
    console.error("Report worker failed:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
    stopWorker();
    failGeneration();
  };

  // Worker → main thread: the reply contains either the analysis or a reported error.
  worker.onmessage = (event) => {
    const { data } = event;
    stopWorker();

    if (data?.error) {
      failGeneration();
      return;
    }

    reportStore.setAnalysis(data);
    reportStore.setStatus("generated");
    router.replace({ name: "reportGenerated" });
  };

  // Worker → main thread: a message that cannot be deserialized is not a reply.
  worker.onmessageerror = (event) => {
    console.error("Main thread could not deserialize the report worker's reply:", event);
    stopWorker();
    failGeneration();
  };

  // Main thread → worker: send a plain snapshot, not Vue's reactive members.
  const members = JSON.parse(JSON.stringify(groupStore.members));
  worker.postMessage({ members });
}

function failGeneration() {
  reportStore.setStatus("error");
  router.replace({ name: "reportError", query: { to: "/group" } });
}

function stopGeneration() {
  stopWorker();
  reportStore.setStatus("idle");
  router.replace({ name: "reportStopped", query: { to: "/group" } });
}

function stopWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
</script>

<template>
  <ReportLoading @stop-generating-report="stopGeneration" />
</template>
