<script setup>
// --- Vue ----------------

// --- Routers ------------
import { useRouter } from "vue-router";

// --- Stores -------------
import { useReportStore } from "@/stores/report";

// --- Components ---------
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeftIcon.vue";
import PrinterIcon from "@/components/ui/icons/PrinterIcon.vue";
import DownloadIcon from "@/components/ui/icons/DownloadIcon.vue";

// --- Composables --------
import { useDownload } from "@/composables/useDownload";

// --- Props --------------

// --- Emits --------------

// --- State --------------
const router = useRouter();
const reportStore = useReportStore();
const { downloadJson } = useDownload();

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function goBack() {
    router.push({ name: "sociogram" });
}

function printReport() {
    window.print();
}

function downloadReport() {
    const report = {
        edgeTypes: reportStore.edgeTypes,
        morenoGroupLevelMetrics: reportStore.morenoGroupLevelMetrics,
        morenoIndividualLevelMetrics: reportStore.morenoIndividualLevelMetrics,
        snaLikesComponents: reportStore.snaLikesComponents,
        snaLikesGroupLevelMetrics: reportStore.snaLikesGroupLevelMetrics,
        snaLikesIndividualLevelMetric: reportStore.snaLikesIndividualLevelMetric,
        snaLikesPlots: reportStore.snaLikesPlots,
        snaDislikesComponents: reportStore.snaDislikesComponents,
        snaDislikesGroupLevelMetrics: reportStore.snaDislikesGroupLevelMetrics,
        snaDislikesIndividualLevelMetric: reportStore.snaDislikesIndividualLevelMetric,
        snaDislikesPlots: reportStore.snaDislikesPlots,
    };

    downloadJson(report, "report.json");
}
</script>

<template>
    <nav
        class="fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-6 print:hidden"
        aria-label="Comandi del report"
    >
        <div
            class="flex items-center gap-1 rounded-full border border-line bg-black/20 p-1.5 shadow-lg backdrop-blur-md"
        >
            <button
                type="button"
                class="cmd-btn"
                aria-label="Torna al sociogramma"
                title="Torna al sociogramma"
                @click="goBack"
            >
                <ArrowLeftIcon />
            </button>
            <button
                type="button"
                class="cmd-btn"
                aria-label="Genera PDF"
                title="Genera PDF"
                @click="printReport"
            >
                <PrinterIcon />
            </button>
            <button
                type="button"
                class="cmd-btn"
                aria-label="Scarica JSON"
                title="Scarica JSON"
                @click="downloadReport"
            >
                <DownloadIcon />
            </button>
        </div>
    </nav>
</template>
