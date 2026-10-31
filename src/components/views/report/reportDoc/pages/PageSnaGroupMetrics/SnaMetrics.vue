<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From relative
import MetricBoxPlot from "./MetricBoxPlot.vue";
import MetricProgressBar from "./MetricProgressBar.vue";

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
// Metric key -> display label and formatting kind. Counts are whole numbers;
// the four structural indices are proportions in [0, 1], shown as percentages
// with a small bar so the value reads at a glance.
const METRIC_CONFIG = {
    numberOfNodes: { label: "Numero di membri nel gruppo", kind: "count" },
    networkDensity: { label: "Densità della rete", kind: "ratio" },
    networkCentralization: { label: "Centralizzazione della rete", kind: "ratio" },
    networkReciprocity: { label: "Reciprocità della rete", kind: "ratio" },
    networkTransitivity: { label: "Transitività della rete", kind: "ratio" },
};

// Per-type labels: the combined edge row and the Moreno indices appended below
// it (cohesion for likes, conflict for dislikes).
const TYPE_CONFIG = {
    likes: {
        edgeLabel: "Totale scelte (di cui reciproche)",
        morenoIndex: "Indice di coesione" ,
    },
    dislikes: {
        edgeLabel: "Totale rifiuti (di cui reciproci)",
        morenoIndex: "Indice di conflitto",
    },
};

// Degree distribution keys, folded into a single box-plot row per direction.
const OUT_DEGREE_KEYS = ["minOutDegree", "maxOutDegree", "medianOutDegree", "IQROutDegree"];
const IN_DEGREE_KEYS = ["minInDegree", "maxInDegree", "medianInDegree", "IQRInDegree"];

// --- Composables --------

// --- Computed -----------
const rows = computed(() => {
    const typeConfig = TYPE_CONFIG[props.typeOfSna] ?? TYPE_CONFIG.likes;
    const keys = props.snaMetrics?.metrics ?? [];
    const values = props.snaMetrics?.rawValuesById?.[0] ?? [];

    const valueOf = (key) => {
        const index = keys.indexOf(key);
        return index === -1 ? 0 : values[index] ?? 0;
    };

    const metricRow = (key) => ({
        key,
        label: METRIC_CONFIG[key]?.label ?? key,
        kind: METRIC_CONFIG[key]?.kind ?? "count",
        value: valueOf(key),
    });

    const boxplotRow = (key, label, fields) => ({
        key,
        label,
        kind: "boxplot",
        value: {
            min: valueOf(fields[0]),
            max: valueOf(fields[1]),
            median: valueOf(fields[2]),
            iqr: valueOf(fields[3]),
        },
    });

    const morenoValue = props.typeOfSna === "likes"
        ? props.morenoMetrics?.rawValuesById?.[0][0] ?? 0
        : props.morenoMetrics?.rawValuesById?.[0][2] ?? 0;

    // Fixed display order: counts and degree ties first, then the structural
    // ratios and the complementary Moreno index.
    return [
        metricRow("numberOfNodes"),
        {
            key: "numberOfEdges",
            label: typeConfig.edgeLabel,
            kind: "countPair",
            value: {
                total: valueOf("numberOfEdges"),
                mutual: valueOf("numberOfMutualEdges"),
            },
        },
        boxplotRow("outDegree", "Legami uscenti", OUT_DEGREE_KEYS),
        boxplotRow("inDegree", "Legami entranti", IN_DEGREE_KEYS),
        metricRow("networkDensity"),
        metricRow("networkCentralization"),
        metricRow("networkTransitivity"),
        metricRow("networkReciprocity"),
        {
            key: "morenoIndex",
            label: typeConfig.morenoIndex,
            kind: "ratio",
            value: morenoValue,
        },
    ];
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
