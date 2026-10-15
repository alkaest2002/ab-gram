<script setup>
// --- Vue ----------------
import { computed, inject, onMounted, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------
import { APP_VERSION_KEY, REPORT_PAGES_KEY } from "./reportPages.js";

// --- Props --------------

// --- Emits --------------

// --- State --------------
// App version is provided by `ReportGenerated` and injected here to stamp the footer.
const appVersion = inject(APP_VERSION_KEY, null);

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
    <section
        class="report-page rounded-lg bg-canvas border border-gray-200 shadow-lg print:rounded-none print:shadow-none"
    >
        <!--
          Every page is a single-column, borderless layout table: header, an
          optional title band, the content, and the footer. Fixed A4-derived row
          heights keep a fixed-height page (the SNA page) on one printed sheet,
          while list-heavy pages can still grow onto a second sheet because a
          table's `height` acts as a minimum.
        -->
        <table class="page-table">
            <tr class="page-row page-row--header">
                <td class="page-cell page-cell--header">
                    <p class="font-mono text-[9pt] font-medium tracking-relaxed uppercase text-muted">
                        AB-Grid Report
                    </p>
                </td>
            </tr>

            <tr v-if="$slots.pageTitle" class="page-row page-row--title">
                <td class="page-cell page-cell--title">
                    <slot name="pageTitle" />
                </td>
            </tr>

            <tr class="page-row page-row--content">
                <td class="page-cell page-cell--content">
                    <slot />
                </td>
            </tr>

            <tr class="page-row page-row--footer">
                <td class="page-cell page-cell--footer">
                    <div class="flex items-center justify-between">
                        <span class="font-mono text-[9pt] text-muted">Versione: {{ appVersion }}</span>
                        <span v-if="pageNumber" class="font-mono text-[9pt] text-muted">
                            Pagina {{ pageNumber
                            }}<template v-if="totalPages"> di {{ totalPages }}</template>
                        </span>
                    </div>
                </td>
            </tr>
        </table>
    </section>
</template>

<style scoped>
/* A4 sheet geometry. These units are print facts, not layout choices. */
.report-page {
    width: 210mm;
    min-height: 297mm;
    max-height: 297mm;
    overflow: hidden;
    padding: 10mm;
    margin: 0;
    box-sizing: border-box;

    /* Base type size for the printed document. */
    font-size: 11pt;

    /* Keep borders and backgrounds faithful on paper. */
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
}

/* Every page except the last starts a fresh printed sheet. */
.report-page:not(:last-child) {
    break-after: page;
    page-break-after: always;
}

/* The layout table fills the A4 content box: 210 × 297 mm minus 10 mm padding
   = 190 × 277 mm. */
.page-table {
    width: 100%;
    height: 277mm;
    table-layout: fixed;
    border-collapse: collapse;
}

.page-cell {
    padding: 0;
    vertical-align: top;
}

.page-row--header {
    height: 6mm;
}
.page-row--title {
    height: 14mm;
}
.page-row--footer {
    height: 6mm;
}

.page-cell--header {
    vertical-align: middle;
    border-bottom: 1px solid var(--color-line);
}
.page-cell--title {
    vertical-align: middle;
}
.page-row--content {
    vertical-align: top;
}
.page-cell--footer {
    vertical-align: middle;
    border-top: 1px solid var(--color-line);
}
</style>
