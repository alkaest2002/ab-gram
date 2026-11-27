<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, onUnmounted, provide } from "vue";

import { storeToRefs } from "pinia";

import { useAppStore } from "@/stores/app";
import { useReportStore } from "@/stores/report";
import { useGroupStore } from "@/stores/group";

import ReportCommandBar from "@/components/views/report/ReportCommandBar/ReportCommandBar.vue";
import ReportDoc from "@/components/views/report/reportDoc/ReportDoc.vue";
import { APP_VERSION_KEY } from "@/components/views/report/reportDoc/pages/reportPages.js";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------
const reportStore = useReportStore();
const groupStore = useGroupStore();
const { version: appVersion } = storeToRefs(useAppStore());

// --- State --------------
provide(APP_VERSION_KEY, appVersion);

// --- Composables --------

// --- Computed -----------
const reportData = computed(() => ({
  appVersion: appVersion.value,
  membersData: {
    allMembersHaveNoDislikes: groupStore.allMembersHaveNoDislikes,
    ...groupStore.$state,
  },
  analysisData: reportStore.$state,
}));

// --- Watchers -----------

// --- Lifecycle ----------
onUnmounted(() => reportStore.resetStore());

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
