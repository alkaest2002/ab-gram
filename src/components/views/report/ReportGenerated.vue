<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed, provide } from "vue";

//   -- From pinia
import { storeToRefs } from "pinia";

//   -- From stores
import { useAppStore } from "@/stores/app";
import { useReportStore } from "@/stores/report";
import { useSociogramStore } from "@/stores/sociogram";

//   -- From components
import ReportCommandBar from "@/components/views/report/ReportCommandBar.vue";
import ReportDoc from "@/components/views/report/reportDoc/ReportDoc.vue";
import { APP_VERSION_KEY } from "@/components/views/report/reportDoc/pages/reportPages.js";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------
const reportStore = useReportStore();
const sociogramStore = useSociogramStore();
const { appVersion } = storeToRefs(useAppStore());

// --- State --------------
provide(APP_VERSION_KEY, appVersion);

// --- Composables --------

// --- Computed -----------
const reportData = computed(() => ({
    appVersion: appVersion.value,
    membersData: {
        allMembersHaveNoDislikes: sociogramStore.allMembersHaveNoDislikes,
        ...sociogramStore.$state,
    },
    analysisData: reportStore.$state,
}));

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function handleRegenerateSnaPlot(plot) {
    reportStore.setSnaPlot(plot);
}
</script>

<template>
    <div>
        <ReportDoc :report-data="reportData" @regenerate-sna-plot="handleRegenerateSnaPlot" />
        <ReportCommandBar :report-data="reportData" />
    </div>
</template>
