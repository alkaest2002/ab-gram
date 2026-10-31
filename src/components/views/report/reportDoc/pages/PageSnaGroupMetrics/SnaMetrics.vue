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
    // Accent color for the ratio bars.
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
        morenoIndexes: [
            { key: "cohesion", label: "Indice di coesione" },
        ],
    },
    dislikes: {
        edgeLabel: "Totale rifiuti (di cui reciproci)",
        morenoIndexes: [
            { key: "conflict", label: "Indice di conflitto" },
        ],
    },
};

// --- Composables --------

// --- Computed -----------
const rows = computed(() => {
    const typeConfig = TYPE_CONFIG[props.typeOfSna] ?? TYPE_CONFIG.likes;
    const keys = props.snaMetrics?.metrics ?? [];
    const values = props.snaMetrics?.rawValuesById?.[0] ?? [];

    const result = [];

    for (const key of keys) {
        const index = keys.indexOf(key);

        // Fold the mutual edge count into the total edge row as a single
        // combined entry, e.g. "Totale scelte (di cui reciproche) ... 10 (5)".
        if (key === "numberOfEdges") {
            const mutualIndex = keys.indexOf("numberOfMutualEdges");
            result.push({
                key,
                label: typeConfig.edgeLabel,
                kind: "countPair",
                value: {
                    total: values[index] ?? 0,
                    mutual: mutualIndex === -1 ? 0 : values[mutualIndex] ?? 0,
                },
            });
            continue;
        }

        if (key === "numberOfMutualEdges") {
            continue;
        }

        result.push({
            key,
            label: METRIC_CONFIG[key]?.label ?? key,
            kind: METRIC_CONFIG[key]?.kind ?? "count",
            value: values[index] ?? 0,
        });
    }

    // The Moreno group indices that complement this preference type (cohesion
    // for likes, conflict for dislikes, in both type I and type II) are
    // appended as final ratio rows.
    const morenoKeys = props.morenoMetrics?.metrics ?? [];
    const morenoValues = props.morenoMetrics?.rawValuesById?.[0] ?? [];

    for (const { key, label } of typeConfig.morenoIndexes) {
        const morenoIndex = morenoKeys.indexOf(key);
        if (morenoIndex !== -1) {
            result.push({
                key,
                label,
                kind: "ratio",
                value: morenoValues[morenoIndex] ?? 0,
            });
        }
    }

    return result;
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
                        <div class="font-display text-[12pt] font-bold text-ink whitespace-nowrap">
                            {{ formatValue(row) }}
                        </div>
                        <div
                            v-if="row.kind === 'ratio'"
                            class="mt-[0.75mm] h-0.5 w-full overflow-hidden rounded-full bg-line"
                        >
                            <div
                                class="h-full rounded-full"
                                :style="{ width: `${ratioPercent(row)}%`, backgroundColor: accentColor }"
                            ></div>
                        </div>
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
