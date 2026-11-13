<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From utils.
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
// The metric chips are listed in a fixed reading order (not the dataframe column
// order). The first twelve are Moreno's individual sociometric indices, the last
// six the SNA centrality block. Each entry maps a short label to the real metric
// key so a chip can read "gp 10 (1/10)" while the data is keyed "gp"/"PageRank".
const MORENO_METRICS_CONFIG = [
  [
    { label: "GP", key: "gp", source: "moreno" },
    { label: "RP", key: "rp", source: "moreno" },
    { label: "MP", key: "mp", source: "moreno" },
    { label: "GR", key: "gr", source: "moreno" },
    { label: "RR", key: "rr", source: "moreno" },
    { label: "MR", key: "mr", source: "moreno" },
  ],
  [
    { label: "IM", key: "im", source: "moreno" },
    { label: "BL", key: "bl", source: "moreno" },
    { label: "EI", key: "ei", source: "moreno" },
    { label: "OR", key: "or", source: "moreno" },
    { label: "AI", key: "ai", source: "moreno" },
    { label: "II", key: "ii", source: "moreno" },
  ],
  [
    { label: "DG", key: "inDegreeCentrality", source: "sna" },
    { label: "PK", key: "PageRank", source: "sna" },
    { label: "CL", key: "closenessCentrality", source: "sna" },
    { label: "BT", key: "betweennessCentrality", source: "sna" },
    { label: "HA", key: "hitsAuthority", source: "sna" },
    { label: "HU", key: "hitsHub", source: "sna" },
  ],
];

// Metric chips grouped by row (Moreno indices then SNA centralities). Each row
// holds six chips so the page lays out exactly six metrics per line.
const metricChips = MORENO_METRICS_CONFIG.map((row) =>
  row.map(({ label, key, source }) => buildChip(label, key, source)),
);

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
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
      <div v-for="(row, rowIndex) in metricChips" :key="rowIndex" class="flex gap-[1mm]">
        <span
          v-for="chip in row"
          :key="chip.label"
          class="flex flex-1 items-center justify-between gap-[1mm] rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
        >
          <span class="flex min-w-0 items-center gap-[1mm]">
            <span class="font-mono text-[9pt] font-medium text-muted">{{ chip.label }}</span>
            <span class="font-mono text-[7.5pt] font-semibold">{{ formatValue(chip.raw) }}</span>
          </span>
          <span class="flex bg-gray-200 px-[2mm] py-[.5mm] rounded">
            <span class="flex grow justify-center items-center gap-2">
              <span class="font-mono text-[9pt] font-bold leading-none">{{ chip.rank }}</span>
              <span class="font-mono text-[7pt] leading-none text-muted">{{ chip.maxRank }}</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>
