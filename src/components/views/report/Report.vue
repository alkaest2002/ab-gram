<script setup>
// --- Vue ----------------
import { computed, onBeforeMount } from "vue";

// --- Routers ------------
import { useRouter } from "vue-router";

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useReportStore } from "@/stores/report";

// --- Components ---------
import ReportLoading from "@/components/views/report/ReportLoading.vue";
import ReportPlaceholder from "@/components/views/report/ReportPlaceholder.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const router = useRouter();
const reportStore = useReportStore();
const { status } = storeToRefs(reportStore);

// --- Computed -----------
// One component per generation status.
const statusComponents = {
    generating: ReportLoading,
    generated: ReportPlaceholder,
};

const currentComponent = computed(() => statusComponents[status.value] ?? null);

// --- Watchers -----------

// --- Lifecycle ----------
// With no data in the store there is nothing to report: leave before mounting
// and hand the user over to the notify view.
onBeforeMount(() => {
    if (status.value === "idle") {
        router.replace({ name: "reportNoDataError" });
    }
});

// --- Methods ------------
</script>

<template>
    <component :is="currentComponent" v-if="currentComponent" />
</template>
