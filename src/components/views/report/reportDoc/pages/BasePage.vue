<script setup>
// --- Imports ------------
//   -- From vue
import { computed, inject, onMounted, ref } from "vue";

//   -- From relative
import { APP_VERSION_KEY, REPORT_PAGES_KEY } from "./reportPages.js";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// App version is provided by `ReportGenerated` and injected here to stamp the footer.
const appVersion = inject(APP_VERSION_KEY, null);

// Page number comes from the report's registry (see ReportDoc). When the page
// is rendered outside a report, it falls back to no number.
const registry = inject(REPORT_PAGES_KEY, null);
const pageNumber = ref(null);

// --- Composables --------

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
          optional title band, the content, and the footer. Each band has a fixed
          A4-derived height, so a page always occupies exactly one sheet; content
          taller than its band is clipped rather than growing the page onto a
          second sheet.
        -->
        <table class="page-table">
            <tbody>
                <tr class="page-row page-row--header">
                    <td class="page-cell page-cell--header">
                        <p class="font-mono text-[7.5pt] font-medium tracking-relaxed uppercase text-muted">
                            AB-Gram Report
                        </p>
                    </td>
                </tr>

                <tr v-if="$slots.pageTitle" class="page-row page-row--title">
                    <td class="page-cell page-cell--title">
                        <slot name="pageTitle" />
                    </td>
                </tr>

                <tr class="page-row page-row--content">
                    <td
                        class="page-cell page-cell--content"
                        :class="{ 'page-cell--content--with-title': $slots.pageTitle }"
                    >
                        <div class="page-content">
                            <slot />
                        </div>
                    </td>
                </tr>

                <tr class="page-row page-row--footer">
                    <td class="page-cell page-cell--footer">
                        <div class="flex items-center justify-between">
                            <span class="font-mono text-[7.5pt] text-muted">AB-Gram ver. {{ appVersion }}</span>
                            <span v-if="pageNumber" class="font-mono text-[7.5pt] text-muted">
                                Pagina {{ pageNumber
                                }}<template v-if="totalPages"> di {{ totalPages }}</template>
                            </span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<style scoped>
/* A4 sheet geometry. These units are print facts, not layout choices. The band
   heights are expressed as variables and the content band is derived with calc,
   so the header + title + content + footer always add up to exactly one A4 sheet. */
.report-page {
    /* Sheet geometry: A4, minus the page padding. */
    --page-width: 210mm;
    --page-height: 297mm;
    --page-padding: 10mm;

    /* Fixed band heights. */
    --header-height: 6mm;
    --title-height: 14mm;
    --footer-height: 6mm;

    /* Height available to the layout table inside the padded sheet. */
    --content-height: calc(var(--page-height) - 2 * var(--page-padding)); /* 277mm */

    width: var(--page-width);
    min-height: var(--page-height);
    max-height: var(--page-height);
    overflow: hidden;
    padding: var(--page-padding);
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

/* Report page typography:  */
.report-page p,
.report-page li {
  font-size: inherit;
}

/* The layout table fills the A4 content box. */
.page-table {
    width: 100%;
    height: var(--content-height);
    table-layout: fixed;
    border-collapse: collapse;
}

.page-cell {
    padding: 0;
    vertical-align: top;
}

.page-row--header {
    height: var(--header-height);
}
.page-row--title {
    height: var(--title-height);
}
.page-row--footer {
    height: var(--footer-height);
}

/* The content band fills the sheet minus the fixed bands. Its height must be
   explicit (not auto) so percentage/flex-sized children resolve against a
   definite containing-block height. It is also a hard ceiling: the wrapper
   below clips, so content can never grow the page. */
.page-cell--content {
    height: calc(var(--content-height) - var(--header-height) - var(--footer-height));
}
.page-cell--content--with-title {
    height: calc(
        var(--content-height) - var(--header-height) - var(--title-height) - var(--footer-height)
    );
}

/* Clip overflowing content to the content band, enforcing one sheet per page. */
.page-content {
    height: 100%;
    overflow: hidden;
}

.page-cell--header {
    vertical-align: middle;
    border-bottom: 1px solid var(--color-line);
}
.page-cell--title {
    vertical-align: middle;
}
.page-cell--footer {
    vertical-align: middle;
    border-top: 1px solid var(--color-line);
}
</style>
