<script setup>
// --- Imports ------------
//   -- From vue
import { onBeforeMount, onBeforeUnmount } from "vue";

//   -- From vue-router
import { useRouter } from "vue-router";

//   -- From stores
import { useReportStore } from "@/stores/report";
import { useSociogramStore } from "@/stores/sociogram";

//   -- From components
import ReportLoading from "@/components/views/report/ReportLoading.vue";

//   -- From utils
import { createReportWorker } from "@/utils/workerLoader";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------
const router = useRouter();

// --- Stores -------------
const reportStore = useReportStore();
const sociogramStore = useSociogramStore();

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

    worker.onerror = (event) => {
        console.error("Report worker failed:", {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
        });
        stopWorker();
        failGeneration(event);
    };

    worker.onmessageerror = (event) => {
        console.error("Report worker message error:", event);
        stopWorker();
        failGeneration(event);
    };

    // Hand the worker a plain, non-reactive snapshot of the sociogram members.
    const members = JSON.parse(JSON.stringify(sociogramStore.members));
    worker.postMessage({ members });
}

function failGeneration(error) {
    reportStore.setStatus("error");
    router.replace({ name: "reportError", query: { to: "/sociogram" } });
}

function stopGeneration() {
    stopWorker();
    reportStore.setStatus("idle");
    router.replace({ name: "reportStopped", query: { to: "/sociogram" } });
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
