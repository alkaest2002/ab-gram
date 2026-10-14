<script setup>
// --- Vue ----------------
import { computed, inject, onMounted, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------
import { REPORT_PAGES_KEY } from "./reportPages.js";

// --- Props --------------
defineProps({
    /** Small uppercase label shown in the page header. */
    eyebrow: { type: String, default: "Report" },
    /** Document title shown in the page header. */
    title: { type: String, default: "Sociogramma di gruppo" },
});

// --- Emits --------------

// --- State --------------
// Page number comes from the report's registry (see ReportDoc). When the page
// is rendered outside a report, it falls back to no number.
const registry = inject(REPORT_PAGES_KEY, null);
const pageNumber = ref(null);

// --- Computed -----------
const totalPages = computed(() => registry?.totalPages.value ?? null);

// --- Watchers -----------

// --- Lifecycle ----------
onMounted(() => {
    if (registry) pageNumber.value = registry.register();
});

// --- Methods ------------
</script>

<template>
    <section class="report-page flex flex-col rounded-lg bg-canvas border border-gray-200 shadow-lg print:rounded-none print:shadow-none">
        <header class="flex items-start justify-between gap-6 border-b border-line pb-4">
            <div class="space-y-1">
                <p class="font-mono text-xs font-medium tracking-[0.14em] uppercase text-muted">
                    {{ eyebrow }}
                </p>
                <p class="text-sm font-semibold text-ink">{{ title }}</p>
            </div>
        </header>

        <div class="flex-1 pt-6">
            <slot />
        </div>

        <footer class="mt-6 flex items-center justify-between border-t border-line pt-3">
            <span class="font-mono text-xs text-muted">AB-Grid</span>
            <span v-if="pageNumber" class="font-mono text-xs text-muted">
                Pagina {{ pageNumber }}<template v-if="totalPages"> di {{ totalPages }}</template>
            </span>
        </footer>
    </section>
</template>

<style scoped>
/* A4 sheet geometry. These units are print facts, not layout choices, so they
   live here instead of in Tailwind utilities. */
.report-page {
    width: 210mm;
    min-height: 297mm;
    padding: 10mm;
    box-sizing: border-box;

    /* Keep borders and backgrounds faithful on paper. */
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
}

/* Every page except the last starts a fresh printed sheet. */
.report-page:not(:last-child) {
    break-after: page;
    page-break-after: always;
}
</style>
