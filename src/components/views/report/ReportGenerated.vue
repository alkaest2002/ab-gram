<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useReportStore } from "@/stores/report";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import ReportCommandBar from "@/components/views/report/ReportCommandBar.vue";
import ReportDoc from "@/components/views/report/reportDoc/ReportDoc.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const reportStore = useReportStore();
const sociogramStore = useSociogramStore();
const { status } = storeToRefs(reportStore);

// --- Computed -----------
const reportData = computed(() => ({
    sociogram: sociogramStore.$state,
    report: reportStore.$state,
}));

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div>
        <ReportDoc v-if="status === 'generated'" :report-data="reportData" />

        <ReportCommandBar v-if="status === 'generated'" :report-data="reportData" />
    </div>
</template>
