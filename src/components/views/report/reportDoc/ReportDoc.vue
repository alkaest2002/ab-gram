<script setup>
// --- Vue ----------------
import { computed, provide, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import PageCover from "@/components/views/report/reportDoc/pages/PageCover.vue";
import PageListOfMembers from "@/components/views/report/reportDoc/pages/PageListOfMembers.vue";
import PageListOfPreferences from "@/components/views/report/reportDoc/pages/PageListOfPreferences.vue";
import PageSnaGroupMetrics from "@/components/views/report/reportDoc/pages/PageSnaGroupMetrics.vue";
import PageSnaComponents from "@/components/views/report/reportDoc/pages/PageSnaComponents.vue";
import PageEdgeTypes from "@/components/views/report/reportDoc/pages/PageEdgeTypes.vue";
import PageMemberMetrics from "@/components/views/report/reportDoc/pages/PageMemberMetrics.vue";
import PageGlossary from "@/components/views/report/reportDoc/pages/PageGlossary.vue";

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
// Moreno ego plots are keyed by member id; expose a lookup so each member page
// can pull its own plot without scanning the array in the template.
const egoPlotByMemberId = computed(() => {
    const plots = props.reportData?.analysisData?.morenoEgoGraphs ?? [];
    return Object.fromEntries(plots.map((plot) => [plot.memberId, plot]));
});

const members = computed(() => props.reportData?.membersData?.members ?? []);

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
        <PageListOfMembers :members-data="reportData.membersData" />
        <PageListOfPreferences :members-data="reportData.membersData" />
        <PageSnaGroupMetrics
            type-of-sna="likes"
            :sna-plot="reportData.analysisData?.snaLikesPlots?.[0] ?? null"
            :sna-metrics="reportData.analysisData?.snaLikesGroupLevelMetrics ?? {}"
            :moreno-metrics="reportData.analysisData?.morenoGroupLevelMetrics ?? {}"
        />
        <PageSnaComponents
            type-of-sna="likes"
            :components="reportData.analysisData?.snaLikesComponents ?? {}"
        />
        <PageSnaGroupMetrics
            v-if="!reportData.membersData.allMembersHaveNoDislikes"
            type-of-sna="dislikes"
            :sna-plot="reportData.analysisData?.snaDislikesPlots?.[0] ?? null"
            :sna-metrics="reportData.analysisData?.snaDislikesGroupLevelMetrics ?? {}"
            :moreno-metrics="reportData.analysisData?.morenoGroupLevelMetrics ?? {}"
        />
        <PageSnaComponents
            v-if="!reportData.membersData.allMembersHaveNoDislikes"
            type-of-sna="dislikes"
            :components="reportData.analysisData?.snaDislikesComponents ?? {}"
        />
        <PageEdgeTypes :edge-types="reportData.analysisData?.edgeTypes ?? {}" />
        <PageMemberMetrics
            v-for="member in members"
            :key="member.id"
            :member="member"
            :ego-plot="egoPlotByMemberId[member.id] ?? null"
            :moreno-metrics="reportData.analysisData?.morenoIndividualLevelMetrics ?? {}"
            :sna-metrics="reportData.analysisData?.snaLikesIndividualLevelMetric ?? {}"
            :edge-types="reportData.analysisData?.edgeTypes ?? {}"
            :components="reportData.analysisData?.snaLikesComponents ?? {}"
        />
        <PageGlossary />
    </div>
</template>
