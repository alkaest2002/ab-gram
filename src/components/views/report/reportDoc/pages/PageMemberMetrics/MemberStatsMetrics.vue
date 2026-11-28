<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { MEMBER_METRICS } from "@/utils/report/memberMetricRows.js";
import {
  memberIndexIn,
  metricIndexOf,
  readRaw,
  readRank,
  readMaxRank,
  formatValue,
} from "@/analysis/common/statsHelpers";

// --- Props --------------
const props = defineProps({
  // The id of the member these stats belong to, used to look up their row in
  // each metric object's `ids` array.
  memberId: { type: [String, Number], default: null },
  // Individual-level Moreno metrics (likes + dislikes combined).
  morenoMetrics: { type: Object, default: () => ({}) },
  // Individual-level SNA metrics for the choice ("likes") network.
  snaMetrics: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Metric chips grouped by row (Moreno indices then SNA centralities). Each row
// holds six chips so the page lays out exactly six metrics per line.
const metricChips = chunk(MEMBER_METRICS, 6).map((row) =>
  row.map(({ label, key, source }) => buildChip(label, key, source)),
);

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function buildChip(label, key, source) {
  const metrics = source === "moreno" ? props.morenoMetrics : props.snaMetrics;
  const memberIndex = memberIndexIn(props.memberId, metrics);
  const metricIndex = metricIndexOf(metrics, key);

  return {
    label,
    raw: readRaw(metrics, memberIndex, metricIndex),
    rank: readRank(metrics, memberIndex, metricIndex),
    maxRank: readMaxRank(metrics, metricIndex),
  };
}
</script>

<template>
  <section class="min-w-0">
    <header class="mb-[2mm] border-b border-line pb-[0.5mm]">
      <h3 class="font-mono text-[10pt] font-bold uppercase tracking-[0.08em]">Metriche</h3>
    </header>

    <div class="flex flex-col gap-[1mm]">
      <div
        v-for="(row, rowIndex) in metricChips"
        :key="rowIndex"
        class="grid grid-cols-6 gap-[1mm]"
      >
        <span
          v-for="chip in row"
          :key="chip.label"
          class="flex items-center justify-between gap-[1mm] rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
        >
          <span class="flex min-w-0 items-center gap-[1mm]">
            <span class="font-mono text-[9pt] font-medium text-muted">{{ chip.label }}</span>
            <span class="font-mono text-[7.5pt] font-semibold">{{ formatValue(chip.raw) }}</span>
          </span>
          <span class="flex bg-gray-200 px-[2mm] py-[.5mm] rounded">
            <span class="flex grow justify-center items-center gap-2">
              <span class="font-mono text-[9pt] font-bold leading-none">{{
                formatValue(chip.rank)
              }}</span>
              <span class="font-mono text-[7pt] leading-none text-muted">{{
                formatValue(chip.maxRank)
              }}</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>
