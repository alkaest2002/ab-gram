<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, inject, onMounted, ref } from "vue";

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
                Pagina {{ pageNumber }}<template v-if="totalPages"> di {{ totalPages }}</template>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
/* Each report page uses the same A4 dimensions on screen and in print. */
.report-page {
  /* Border-box sizing keeps the padding inside the A4 sheet dimensions. */
  --page-width: 210mm;
  --page-height: 297mm;
  --page-padding: 10mm;

  --header-height: 6mm;
  --title-height: 14mm;
  --footer-height: 6mm;

  /* Height budget for the whole table, including the header, title (if present), and footer. */
  --content-height: calc(var(--page-height) - 2 * var(--page-padding));

  width: var(--page-width);
  min-height: var(--page-height);
  max-height: var(--page-height);
  overflow: hidden;
  padding: var(--page-padding);
  margin: 0;
  box-sizing: border-box;

  font-size: 11pt;

  /* Ask the browser to preserve report colors when printing. */
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

/* Break between printed pages without forcing a break after the last one. */
.report-page:not(:last-child) {
  break-after: page;
  page-break-after: always;
}

/* Paragraphs and list items follow the font size of their surrounding section. */
.report-page p,
.report-page li {
  font-size: inherit;
}

/* Lay out the page bands in one column spanning the padded sheet. */
.page-table {
  width: 100%;
  height: var(--content-height);
  table-layout: fixed;
  border-collapse: collapse;
}

/* Bands start flush at the top unless a cell opts into vertical centering. */
.page-cell {
  padding: 0;
  vertical-align: top;
}

/* Reserve a band for the report label on every page. */
.page-row--header {
  height: var(--header-height);
}

/* Reserve a separate band for pages that supply a title. */
.page-row--title {
  height: var(--title-height);
}

/* Reserve footer space for the version and page number. */
.page-row--footer {
  height: var(--footer-height);
}

/* Give the body the remaining height so .page-content can resolve its 100% height. */
.page-cell--content {
  height: calc(var(--content-height) - var(--header-height) - var(--footer-height));
}

/* Subtract the title band from the body height when the pageTitle slot is present. */
.page-cell--content--with-title {
  height: calc(
    var(--content-height) - var(--header-height) - var(--title-height) - var(--footer-height)
  );
}

/* Clip excess slot content here rather than letting it push the footer down. */
.page-content {
  height: 100%;
  overflow: hidden;
}

/* Center the report label vertically and separate it from the page below. */
.page-cell--header {
  vertical-align: middle;
  border-bottom: 1px solid var(--color-line);
}

/* Center the slotted title vertically within its band. */
.page-cell--title {
  vertical-align: middle;
}

/* Center the footer details vertically beneath the divider. */
.page-cell--footer {
  vertical-align: middle;
  border-top: 1px solid var(--color-line);
}
</style>
