<script setup>
// --- Vue ----------------
import { computed, provide } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { useReportStore } from "@/stores/report";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import ReportCommandBar from "@/components/views/report/ReportCommandBar.vue";
import ReportDoc from "@/components/views/report/reportDoc/ReportDoc.vue";

// --- Composables --------
import { APP_VERSION_KEY } from "@/components/views/report/reportDoc/pages/reportPages.js";

// --- Props --------------

// --- Emits --------------

// --- State --------------
const reportStore = useReportStore();
const sociogramStore = useSociogramStore();
const { appVersion } = storeToRefs(useAppStore());

provide(APP_VERSION_KEY, appVersion);

// --- Computed -----------
const reportData = computed(() => ({
    appVersion: appVersion.value,
    sociogram: sociogramStore.$state,
    report: reportStore.$state,
}));

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div>
        <ReportDoc :report-data="reportData" />
        <ReportCommandBar :report-data="reportData" />
    </div>
</template>
