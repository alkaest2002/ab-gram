<script setup>
// --- Vue ----------------
import { computed, onBeforeMount, onBeforeUnmount } from "vue";

// --- Routers ------------
import { useRouter } from "vue-router";

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useReportStore } from "@/stores/report";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import ReportLoading from "@/components/views/report/ReportLoading.vue";
import ReportCommandBar from "@/components/views/report/ReportCommandBar.vue";
import ReportDoc from "@/components/views/report/reportDoc/ReportDoc.vue";

// --- Composables --------
import { createReportWorker } from "@/utils/workerLoader";

// --- Props --------------

// --- Emits --------------

// --- State --------------
const router = useRouter();
const reportStore = useReportStore();
const sociogramStore = useSociogramStore();
const { status } = storeToRefs(reportStore);

/** @type {Worker | null} Active report generation worker. */
let worker = null;

// --- Computed -----------
const statusComponents = {
    generating: ReportLoading,
    generated: ReportDoc,
};

const currentComponent = computed(
    () => statusComponents[status.value] ?? "generating",
);

const reportData = computed(() => ({
    sociogram: sociogramStore.$state,
    report: reportStore.$state,
}));

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
    <div>
        <component
            :is="currentComponent"
            :report-data="reportData"
            @report-geenrating-stop="stopGeneration"
        />

        <ReportCommandBar v-if="status === 'generated'" :report-data="reportData" />
    </div>
</template>
