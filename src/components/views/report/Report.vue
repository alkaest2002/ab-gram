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
import ReportDoc from "@/components/views/report/ReportDoc.vue";

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

const currentComponent = computed(() => statusComponents[status.value] ?? null);

// --- Watchers -----------

// --- Lifecycle ----------
// With no members there is nothing to report: leave before mounting and hand
// the user over to the notify view.
onBeforeMount(() => {
    if (!sociogramStore.hasMembers) {
        router.replace({ name: "reportNoDataError", query: { to: "/sociogram" } });
        return;
    }

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

  worker.onerror = ({ error }) => {
        stopWorker();
        failGeneration(error);
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
    <component
        :is="currentComponent"
        v-if="currentComponent"
        @report-geenrating-stop="stopGeneration"
    />
</template>
