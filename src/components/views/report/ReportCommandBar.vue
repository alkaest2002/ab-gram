<script setup>
// --- Vue ----------------

// --- Routers ------------
import { useRouter } from "vue-router";

// --- Stores -------------

// --- Components ---------
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeftIcon.vue";

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
    downloadJson(props.reportData, "report-data", "application/json", true, false);
}
</script>

<template>
    <nav
        class="fixed inset-x-0 bottom-0 z-30 flex justify-center gap-1 px-6 pb-6 print:hidden"
        aria-label="Comandi del report"
    >
        <button
            type="button"
            class="cmd-btn"
            aria-label="Torna al sociogramma"
            title="Torna al sociogramma"
            @click="goBack"
        >
            <ArrowLeftIcon :size="'size-7'" :stroke-class="'stroke-white'" />
        </button>
        <button
            type="button"
            class="cmd-btn"
            aria-label="Genera PDF"
            title="Genera PDF"
            @click="printReport"
        >
            <span class="cmd-label">PDF</span>
        </button>
        <button
            type="button"
            class="cmd-btn"
            aria-label="Scarica JSON"
            title="Scarica JSON"
            @click="downloadReport"
        >
            <span class="cmd-label">JSON</span>
        </button>
    </nav>
</template>

<style scoped>
.cmd-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 9999px;
    background-color: rgb(50 50 50);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    transition: background-color 150ms ease;
}

.cmd-btn:hover,
.cmd-btn:focus-visible {
    background-color: rgb(50 50 50);
}

.cmd-label {
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1;
}
</style>
