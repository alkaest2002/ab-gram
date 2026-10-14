<script setup>
// --- Vue ----------------
import { provide, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import PageListOfMembers from "@/components/views/report/reportDoc/pages/PageListOfMembers.vue";
import PageListOfPreferences from "@/components/views/report/reportDoc/pages/PageListOfPreferences.vue";

// --- Composables --------
import { REPORT_PAGES_KEY } from "@/components/views/report/reportDoc/pages/reportPages.js";

// --- Props --------------
const props = defineProps({
    reportData: { type: Object, required: true },
});

// --- Emits --------------

// --- State --------------
// Pages register themselves as they mount. The count is reactive, so every
// footer can show "Pagina N di M" without manual numbering.
const totalPages = ref(0);

provide(REPORT_PAGES_KEY, {
    register() {
        totalPages.value += 1;
        return totalPages.value;
    },
    totalPages,
});

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="space-y-8 print:space-y-0">
        <!--
          The document is composed declaratively: each child below is one page.
          Add pages here — repeating a component renders the page again, and
          numbering stays correct via the registry provided above.
        -->
        <PageListOfMembers :report-data="reportData" />
        <PageListOfPreferences :report-data="reportData" />
    </div>
</template>
