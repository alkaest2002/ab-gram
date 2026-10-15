<script setup>
// --- Vue ----------------
import { provide, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import PageCover from "@/components/views/report/reportDoc/pages/PageCover.vue";
import PageListOfMembers from "@/components/views/report/reportDoc/pages/PageListOfMembers.vue";
import PageListOfPreferences from "@/components/views/report/reportDoc/pages/PageListOfPreferences.vue";
import PageSnaGroupMetrics from "@/components/views/report/reportDoc/pages/PageSnaGroupMetrics.vue";

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
        <PageCover />
        <PageListOfMembers :report-data="reportData" />
        <PageListOfPreferences :report-data="reportData" />
        <PageSnaGroupMetrics
            type-of-sna="likes"
            :sna-plot="reportData.report?.snaLikesPlots?.[0] ?? null"
            :sna-metrics="reportData.report?.snaLikesGroupLevelMetrics ?? {}"
        />
        <PageSnaGroupMetrics
            v-if="!reportData.sociogram.allMembersHaveNoDislikes"
            type-of-sna="dislikes"
            :sna-plot="reportData.report?.snaDislikesPlots?.[0] ?? null"
            :sna-metrics="reportData.report?.snaDislikesGroupLevelMetrics ?? {}"
        />
    </div>
</template>
