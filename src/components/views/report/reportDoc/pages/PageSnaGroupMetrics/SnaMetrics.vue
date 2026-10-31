<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
    // Raw group-level metrics, shaped like `getGroupLevelMetrics` (metrics and
    // `rawValuesById`). Only the first row is read: a group has one graph.
    snaMetrics: { type: Object, default: () => ({}) },
    // Raw complementary Moreno metrics, shaped like `getGroupLevelMetrics`.
    morenoMetrics: { type: Object, default: () => ({}) },
    // Preference type, selects the per-type labels below.
    typeOfSna: { type: String, default: "likes" },
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

    // Fixed display order: counts first, then the structural ratios, the
    // complementary Moreno index, and finally the two degree box plots.
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
        boxplotRow("outDegree", "Grado uscente", OUT_DEGREE_KEYS),
        boxplotRow("inDegree", "Grado entrante", IN_DEGREE_KEYS),
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

function ratioPercent(row) {
    if (row.kind !== "ratio") return 0;
    return Math.max(0, Math.min(100, Number(row.value) * 100));
}

// Box-plot geometry from the four summary statistics. Only min/max/median/IQR
// are available, so Q1 and Q3 are reconstructed symmetrically around the median
// (median ± IQR/2); the numbers are shown explicitly next to the plot.
function boxplotGeometry(value) {
    const min = Number(value?.min ?? 0);
    const max = Number(value?.max ?? 0);
    const median = Number(value?.median ?? 0);
    const iqr = Number(value?.iqr ?? 0);
    const span = max - min;

    if (span === 0) {
        return { q1Pct: 50, q3Pct: 50, medianPct: 50 };
    }

    const pct = (v) => ((v - min) / span) * 100;
    const q1 = Math.max(min, median - iqr / 2);
    const q3 = Math.min(max, median + iqr / 2);
    return {
        q1Pct: pct(q1),
        q3Pct: pct(q3),
        medianPct: pct(median),
    };
}

function boxStyle(row) {
    const { q1Pct, q3Pct } = boxplotGeometry(row.value);
    return {
        left: `${q1Pct}%`,
        width: `${q3Pct - q1Pct}%`,
    };
}

function medianStyle(row) {
    const { medianPct } = boxplotGeometry(row.value);
    return { left: `${medianPct}%` };
}

function formatBoxCount(value) {
    return String(Math.round(Number(value ?? 0)));
}

function formatBoxDecimal(value) {
    const n = Number(value ?? 0);
    if (Number.isInteger(n)) return String(n);
    return String(Number(n.toFixed(2))).replace(".", ",");
}
</script>

<template>
    <div class="sna-stats pt-1">
        <table class="w-full text-left">
            <tbody>
                <tr v-for="row in rows" :key="row.key" class="align-baseline">
                    <td
                        class="py-[1.5mm] pr-[4mm] font-mono text-[8pt] font-medium tracking-[0.08em] text-muted uppercase"
                    >
                        {{ row.label }}
                    </td>
                    <td class="py-[1.5mm] text-right">
                        <template v-if="row.kind === 'boxplot'">
                            <div class="boxplot">
                                <div class="boxplot-track">
                                    <div class="boxplot-line bg-ink"></div>
                                    <div class="boxplot-box border-ink bg-ink" :style="boxStyle(row)"></div>
                                    <div class="boxplot-median bg-white" :style="medianStyle(row)"></div>
                                </div>
                                <div class="boxplot-values text-ink">
                                    <span>min {{ formatBoxCount(row.value.min) }}</span>
                                    <span>med {{ formatBoxCount(row.value.median) }}</span>
                                    <span>max {{ formatBoxCount(row.value.max) }}</span>
                                    <span>IQR {{ formatBoxDecimal(row.value.iqr) }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="font-display text-[12pt] font-bold text-ink whitespace-nowrap">
                                {{ formatValue(row) }}
                            </div>
                            <div
                                v-if="row.kind === 'ratio'"
                                class="mt-[0.75mm] h-0.5 w-full overflow-hidden rounded-full bg-line"
                            >
                                <div
                                    class="h-full rounded-full bg-ink"
                                    :style="{ width: `${ratioPercent(row)}%` }"
                                ></div>
                            </div>
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

/* Degree box plot: a full-range whisker (min→max), an IQR box and a median
   tick, with the four numbers listed underneath. */
.boxplot {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1mm;
}
.boxplot-track {
    position: relative;
    width: 24mm;
    height: 4mm;
}
.boxplot-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
}
.boxplot-box {
    position: absolute;
    top: 1mm;
    bottom: 1mm;
    border-width: 1px;
    border-style: solid;
}
.boxplot-median {
    position: absolute;
    top: 1mm;
    bottom: 1mm;
    width: 1.5px;
}
.boxplot-values {
    display: flex;
    gap: 2.5mm;
    font-size: 7pt;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
</style>
