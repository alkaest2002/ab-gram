<script setup>
// --- Vue ----------------

// --- Routers ------------
import { useRouter } from "vue-router";

// --- Stores -------------

// --- Components ---------
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeftIcon.vue";
import PrinterIcon from "@/components/ui/icons/PrinterIcon.vue";
import DownloadIcon from "@/components/ui/icons/DownloadIcon.vue";

// --- Composables --------
import { useDownload } from "@/composables/useDownload";
const { downloadJson } = useDownload();

// --- Props --------------
const props = defineProps({
    reportData: {
        type: Object,
        required: true,
    },
});

// --- Emits --------------

// --- State --------------
const router = useRouter();

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
    downloadJson(props.reportData, "report-data", true, false);
}
</script>

<template>
    <nav
        class="fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-6 print:hidden"
        aria-label="Comandi del report"
    >
        <div
            class="flex items-center gap-1 rounded-full bg-black/70 p-1.5 shadow-lg backdrop-blur-md"
        >
            <button
                type="button"
                class="cmd-btn"
                aria-label="Torna al sociogramma"
                title="Torna al sociogramma"
                @click="goBack"
            >
                <ArrowLeftIcon :stroke-class="'stroke-white'" />
            </button>
            <button
                type="button"
                class="cmd-btn"
                aria-label="Genera PDF"
                title="Genera PDF"
                @click="printReport"
            >
                <PrinterIcon :stroke-class="'stroke-white'" />
            </button>
            <button
                type="button"
                class="cmd-btn"
                aria-label="Scarica JSON"
                title="Scarica JSON"
                @click="downloadReport"
            >
                <DownloadIcon :stroke-class="'stroke-white'" />
            </button>
        </div>
    </nav>
</template>
