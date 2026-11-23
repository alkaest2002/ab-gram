<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed } from "vue";
import {
  formatValue,
  memberIndexIn,
  metricIndexOf,
  readRank,
  readMaxRank,
} from "@/analysis/common/statsHelpers";

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
  // structure lists per category.
  likesStructures: { type: Object, default: () => ({}) },
  // `getSnaStructures` result for the rejection ("dislikes") network, exposing
  // the structure lists per category.
  dislikesStructures: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
const coreNumber = computed(() => {
  const metrics = props.snaMetrics;
  const row = memberIndexIn(props.memberId, metrics);
  const column = metricIndexOf(metrics, "coreNumber");
  const raw = metrics?.rawValuesById?.[row]?.[column];
  if (raw == null) return null;
  return { raw, rank: readRank(metrics, row, column), maxRank: readMaxRank(metrics, column) };
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div class="bottom-band flex flex-col gap-y-[2mm]">
    <!-- Row 1: metrics. -->
    <MemberStatsMetrics
      :member-id="props.memberId"
      :moreno-metrics="props.morenoMetrics"
      :sna-metrics="props.snaMetrics"
    />

    <!-- Row 2: edge types. -->
    <MemberStatsEdges :member-id="props.memberId" :edge-types="props.edgeTypes" />

    <!-- Row 3: structure categories. -->
    <MemberStatsStructures
      :member-id="props.memberId"
      :likes-structures="props.likesStructures"
      :dislikes-structures="props.dislikesStructures"
    />

    <!-- Row 4: sociometric status and coreness. -->
    <div class="flex items-start gap-[4mm] mt-1">
      <MemberStatsStatus
        class="flex-1"
        :member-id="props.memberId"
        :moreno-metrics="props.morenoMetrics"
      />
      <section v-if="coreNumber != null" class="shrink-0">
        <h3
          class="mb-[2mm] border-b border-line pb-[0.5mm] font-mono text-[9pt] font-bold uppercase tracking-[0.08em]"
        >
          CRN
        </h3>
        <p
          class="flex items-center justify-between gap-[5mm] rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm] font-mono"
        >
          <span class="text-[7.5pt] font-semibold">{{ formatValue(coreNumber.raw) }}</span>
          <span
            class="flex items-center justify-center gap-2 rounded bg-gray-200 px-[2mm] py-[.5mm]"
          >
            <span class="text-[9pt] font-bold leading-none">{{
              formatValue(coreNumber.rank)
            }}</span>
            <span class="text-[7pt] leading-none text-muted">{{
              formatValue(coreNumber.maxRank)
            }}</span>
          </span>
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Bottom band: fills the content cell below the 62% ego plot. */
.bottom-band {
  flex: 1 1 0;
  min-height: 0;
}
</style>
