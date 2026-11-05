<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

//   -- From relative.
import MetricBoxPlot from "./SnaMetricsBoxPlot.vue";
import MetricProgressBar from "./SnaMetricsProgressBar.vue";

// --- Props --------------
const props = defineProps({
  // Raw group-level metrics, shaped like `getGroupLevelMetrics` (metrics and
  // `rawValuesById`). Only the first row is read: a group has one graph.
  snaMetrics: { type: Object, default: () => ({}) },
  // Raw complementary Moreno metrics, shaped like `getGroupLevelMetrics`.
  morenoMetrics: { type: Object, default: () => ({}) },
  // Preference type, selects the per-type labels below.
  typeOfSna: { type: String, default: "likes" },
  // Accent color for the progress bars.
  accentColor: { type: String, default: "" },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Single source of truth for the stats table, in fixed display order. Counts
// are whole numbers; the four structural indices are proportions in [0, 1],
// shown as percentages with a small bar. Type-specific labels and the Moreno
// column are resolved from the active `typeOfSna`; box-plot rows carry the five
// column keys that make up one box.
const SNA_METRICS_CONFIG = [
  { key: "numberOfNodes", label: "Numero di membri nel gruppo", kind: "count" },
  {
    key: "numberOfEdges",
    kind: "countPair",
    label: {
      likes: "Totale scelte (di cui reciproche)",
      dislikes: "Totale rifiuti (di cui reciproci)",
    },
  },
  {
    key: "outDegree",
    label: "Legami uscenti",
    kind: "boxplot",
    fields: ["minOutDegree", "Q1OutDegree", "medianOutDegree", "Q3OutDegree", "maxOutDegree"],
  },
  {
    key: "inDegree",
    label: "Legami entranti",
    kind: "boxplot",
    fields: ["minInDegree", "Q1InDegree", "medianInDegree", "Q3InDegree", "maxInDegree"],
  },
  { key: "networkDensity", label: "Densità della rete", kind: "ratio" },
  { key: "networkCentralization", label: "Centralizzazione della rete", kind: "ratio" },
  { key: "networkTransitivity", label: "Transitività della rete", kind: "ratio" },
  { key: "networkReciprocity", label: "Reciprocità della rete", kind: "ratio" },
  {
    key: "morenoIndex",
    kind: "ratio",
    label: {
      likes: "Indice di coesione",
      dislikes: "Indice di conflitto",
    },
    column: { likes: 0, dislikes: 2 },
  },
];

// --- Composables --------

// --- Computed -----------
const rows = computed(() => {
  const type = props.typeOfSna === "dislikes" ? "dislikes" : "likes";
  const keys = props.snaMetrics?.metrics ?? [];
  const values = props.snaMetrics?.rawValuesById?.[0] ?? [];

  const valueOf = (key) => {
    const index = keys.indexOf(key);
    return index === -1 ? 0 : (values[index] ?? 0);
  };

  const labelOf = (config) =>
    typeof config.label === "object" ? (config.label[type] ?? "") : config.label;

  return SNA_METRICS_CONFIG.map((config) => {
    if (config.kind === "countPair") {
      return {
        key: config.key,
        label: labelOf(config),
        kind: config.kind,
        value: {
          total: valueOf("numberOfEdges"),
          mutual: valueOf("numberOfMutualEdges"),
        },
      };
    }

    if (config.kind === "boxplot") {
      return {
        key: config.key,
        label: config.label,
        kind: config.kind,
        value: {
          min: valueOf(config.fields[0]),
          q1: valueOf(config.fields[1]),
          median: valueOf(config.fields[2]),
          q3: valueOf(config.fields[3]),
          max: valueOf(config.fields[4]),
        },
      };
    }

    const value =
      config.key === "morenoIndex"
        ? (props.morenoMetrics?.rawValuesById?.[0]?.[config.column[type]] ?? 0)
        : valueOf(config.key);

    return {
      key: config.key,
      label: labelOf(config),
      kind: config.kind,
      value,
    };
  });
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function formatValue(row) {
  if (row.kind === "countPair") {
    const total = Math.round(Number(row.value?.total ?? 0));
    const mutual = Math.round(Number(row.value?.mutual ?? 0));
    return `${total} (${mutual})`;
  }

  if (row.kind === "ratio") {
    // One decimal, Italian comma separator (e.g. 0.214 -> "21,4%").
    const percent = (Number(row.value) * 100).toFixed(1).replace(".", ",");
    return `${percent}%`;
  }

  return String(Math.round(Number(row.value)));
}
</script>

<template>
  <div class="sna-stats pt-1">
    <table class="w-full text-left">
      <tbody>
        <tr v-for="row in rows" :key="row.key" class="align-baseline">
          <td
            class="py-[1.3mm] pr-[4mm] font-mono text-[8pt] font-medium tracking-[0.08em] text-muted uppercase"
          >
            {{ row.label }}
          </td>
          <td class="py-[1.3mm] text-right">
            <MetricBoxPlot v-if="row.kind === 'boxplot'" :value="row.value" />
            <template v-else>
              <div class="font-display text-[12pt] font-bold text-ink whitespace-nowrap">
                {{ formatValue(row) }}
              </div>
              <MetricProgressBar
                v-if="row.kind === 'ratio'"
                :value="row.value"
                :accent-color="accentColor"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Stats band: 40% of the content cell, vertically centered. */
.sna-stats {
  flex: 0 0 40%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
