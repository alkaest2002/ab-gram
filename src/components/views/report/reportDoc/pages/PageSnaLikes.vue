<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BasePage from "./BasePage.vue";

// --- Composables --------

// --- Props --------------
const props = defineProps({
    reportData: { type: Object, required: true },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------
// The likes network plot (a single SVG, since `getSnaPlot` returns one entry
// per preference graph) and the matching group-level indices.
const plots = computed(() => props.reportData?.report?.snaLikesPlots ?? []);
const plot = computed(() => plots.value[0] ?? null);
const groupMetrics = computed(
    () => props.reportData?.report?.snaLikesGroupLevelMetrics ?? {},
);

// The plot is drawn with a hard-coded likes accent (`#0000FF` in analysisMain).
// Reusing it here keeps the metric bars and legend in the same hue as the graph.
const accentColor = computed(() => plot.value?.accentColor ?? "#2563eb");

// Metric key -> display label and formatting kind. Counts are whole numbers;
// the four structural indices are proportions in [0, 1], shown as percentages
// with a small bar so the value reads at a glance.
const METRIC_CONFIG = {
    numberOfNodes: { label: "Membri", kind: "count" },
    numberOfEdges: { label: "Scelte", kind: "count" },
    numberOfMutualEdges: { label: "Scelte reciproche", kind: "count" },
    networkDensity: { label: "Densità", kind: "ratio" },
    networkCentralization: { label: "Centralizzazione", kind: "ratio" },
    networkReciprocity: { label: "Reciprocità", kind: "ratio" },
    networkTransitivity: { label: "Transitività", kind: "ratio" },
};

const metricRows = computed(() => {
    const keys = groupMetrics.value?.metrics ?? [];
    const values = groupMetrics.value?.rawValuesById?.[0] ?? [];

    return keys.map((key, index) => ({
        key,
        label: METRIC_CONFIG[key]?.label ?? key,
        kind: METRIC_CONFIG[key]?.kind ?? "count",
        value: values[index] ?? 0,
    }));
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function formatValue(row) {
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
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt] leading-none">Rete delle scelte</h2>
        </template>

        <template #default>
            <!--
              The content cell holds another borderless table: the plot takes two
              thirds of the cell height, the stats the remaining third.
            -->
            <table v-if="plot" class="sna-table">
                <tr class="sna-row sna-row--plot">
                    <td class="sna-cell">
                        <table class="plot-table">
                            <tr class="plot-row plot-row--svg">
                                <td class="plot-cell plot-cell--svg" v-html="plot.svg"></td>
                            </tr>
                            <tr class="plot-row plot-row--legend">
                                <td class="plot-cell plot-cell--legend">
                                    <div class="flex flex-wrap gap-x-[5mm] gap-y-[1mm]">
                                        <span class="inline-flex items-center gap-[1.5mm]">
                                            <span
                                                class="inline-block h-[2.5mm] w-[2.5mm] rounded-full"
                                                :style="{ backgroundColor: accentColor }"
                                            ></span>
                                            <span class="font-mono text-[7.5pt] text-muted">Membro</span>
                                        </span>
                                        <span class="inline-flex items-center gap-[1.5mm]">
                                            <svg class="h-auto w-[4.5mm]" viewBox="0 0 22 12" aria-hidden="true">
                                                <line x1="1" y1="6" x2="15" y2="6" :stroke="accentColor" stroke-width="1" />
                                                <polyline points="11,1.5 16,6 11,10.5" fill="none" :stroke="accentColor" stroke-width="1" />
                                            </svg>
                                            <span class="font-mono text-[7.5pt] text-muted">Scelta non reciproca</span>
                                        </span>
                                        <span class="inline-flex items-center gap-[1.5mm]">
                                            <span
                                                class="inline-block h-[1mm] w-[4.5mm] rounded-full"
                                                :style="{ backgroundColor: accentColor }"
                                            ></span>
                                            <span class="font-mono text-[7.5pt] text-muted">Scelta reciproca</span>
                                        </span>
                                        <span class="inline-flex items-center gap-[1.5mm]">
                                            <span class="inline-block h-[2.5mm] w-[2.5mm] rounded-full bg-black"></span>
                                            <span class="font-mono text-[7.5pt] text-muted">Membro isolato</span>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr class="sna-row sna-row--stats">
                    <td class="sna-cell sna-cell--stats">
                        <div class="stats">
                            <table class="w-full text-left">
                                <tbody>
                                    <tr v-for="row in metricRows" :key="row.key" class="align-baseline">
                                        <td
                                            class="py-[0.75mm] pr-[4mm] font-mono text-[8pt] font-medium tracking-[0.08em] text-muted uppercase"
                                        >
                                            {{ row.label }}
                                        </td>
                                        <td class="py-[0.75mm] text-right">
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
                    </td>
                </tr>
            </table>
        </template>
    </BasePage>
</template>

<style scoped>
/* The content cell is split 2/3 – 1/3 by a nested borderless table. Percent
   row heights are reliable here because the cell has a definite height (the
   BasePage table reserves a fixed band for header/title/footer). */
.sna-table {
    width: 100%;
    height: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.sna-row--plot {
    height: 60%;
}
.sna-row--stats {
    height: 40%;
}

.sna-cell {
    padding: 0;
    vertical-align: top;
}

/* Vertically center the compact stats block in its (1/3) band. */
.sna-cell--stats {
    vertical-align: middle;
}

/* Inside the plot cell: the SVG fills everything except a thin legend strip. */
.plot-table {
    width: 100%;
    height: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.plot-row--svg {
    height: 100%;
}
.plot-row--legend {
    height: 6mm;
}

.plot-cell {
    padding: 0;
    vertical-align: top;
}
.plot-cell--legend {
    vertical-align: middle;
}

/* The SVG is injected via v-html, so it has no scoped attribute; :deep reaches
   it from the .plot-cell--svg wrapper. It fills the cell and the default
   `preserveAspectRatio="xMidYMid meet"` keeps the graph's aspect ratio. */
.plot-cell--svg :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
