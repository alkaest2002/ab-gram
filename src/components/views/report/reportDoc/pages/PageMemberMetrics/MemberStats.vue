<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import MemberStatsMetrics from "./MemberStatsMetrics.vue";
import MemberStatsEdges from "./MemberStatsEdges.vue";
import MemberStatsStructures from "./MemberStatsStructures.vue";
import MemberStatsStatus from "./MemberStatsStatus.vue";

// --- Props --------------
const props = defineProps({
    // The id of the member these stats belong to, used to look up their row in
    // each metric object's `ids` array.
    memberId: { type: [String, Number], default: null },
    // Individual-level Moreno metrics (likes + dislikes combined).
    morenoMetrics: { type: Object, default: () => ({}) },
    // Individual-level SNA metrics for the choice ("likes") network.
    snaMetrics: { type: Object, default: () => ({}) },
    // `getEdgeTypes` result, exposing `memberInEdges`.
    edgeTypes: { type: Object, default: () => ({}) },
    // `getSnaStructures` result for the choice ("likes") network, exposing the
    // component lists per category.
    likesComponents: { type: Object, default: () => ({}) },
    // `getSnaStructures` result for the rejection ("dislikes") network, exposing
    // the component lists per category.
    dislikesComponents: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="bottom-band flex flex-col gap-y-[4mm]">
        <!-- Row 1: metrics. -->
        <MemberStatsMetrics
            :member-id="props.memberId"
            :moreno-metrics="props.morenoMetrics"
            :sna-metrics="props.snaMetrics"
        />

        <!-- Row 2: edge types. -->
        <MemberStatsEdges
            :member-id="props.memberId"
            :edge-types="props.edgeTypes"
        />

        <!-- Row 3: component categories. -->
        <MemberStatsStructures
            :member-id="props.memberId"
            :likes-components="props.likesComponents"
            :dislikes-components="props.dislikesComponents"
        />

        <!-- Row 4: sociometric status. -->
        <MemberStatsStatus
            :member-id="props.memberId"
            :moreno-metrics="props.morenoMetrics"
        />
    </div>
</template>

<style scoped>
/* Bottom band: fills the content cell below the 62% ego plot. */
.bottom-band {
    flex: 1 1 0;
    min-height: 0;
}
</style>
