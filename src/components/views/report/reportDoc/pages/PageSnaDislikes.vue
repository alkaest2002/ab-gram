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
// The dislikes network plot (a single SVG, since `getSnaPlot` returns one entry
// per preference graph) and the matching group-level indices.
const plots = computed(() => props.reportData?.report?.snaDislikesPlots ?? []);
const plot = computed(() => plots.value[0] ?? null);
const groupMetrics = computed(
    () => props.reportData?.report?.snaDislikesGroupLevelMetrics ?? {},
);

// The plot is drawn with a hard-coded dislikes accent (`#FF0000` in analysisMain).
// Reusing it here keeps the metric bars and legend in the same hue as the graph.
const accentColor = computed(() => plot.value?.accentColor ?? "#dc2626");

// Metric key -> display label and formatting kind. Counts are whole numbers;
// the four structural indices are proportions in [0, 1], shown as percentages
// with a small bar so the value reads at a glance.
const METRIC_CONFIG = {
    numberOfNodes: { label: "Numero di membri nel gruppo", kind: "count" },
    numberOfEdges: { label: "Totale rifiuti effettuati", kind: "count" },
    numberOfMutualEdges: { label: "Totale rifiuti reciproci effettuati", kind: "count" },
    networkDensity: { label: "Densità della rete", kind: "ratio" },
    networkCentralization: { label: "Centralizzazione della rete", kind: "ratio" },
    networkReciprocity: { label: "Reciprocità delle rete", kind: "ratio" },
    networkTransitivity: { label: "Transitività della rete", kind: "ratio" },
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
            <h2 class="text-[16pt] leading-none">Rete dei rifiuti</h2>
        </template>

        <template #default>
            <!--
              The content cell is split 2/3 – 1/3 with flexbox (no layout table):
              the plot band on top, the compact stats band below. Only the metric
              list at the bottom is a real table (genuinely tabular label/value
              rows).
            -->
            <div v-if="plot" class="sna-layout">
                <div class="sna-plot border-b border-line pb-1">
                    <div class="plot-svg" v-html="plot.svg"></div>
                    <div class="plot-legend">
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
                                <span class="font-mono text-[7.5pt] text-muted">Rifiuto non reciproco</span>
                            </span>
                            <span class="inline-flex items-center gap-[1.5mm]">
                                <span
                                    class="inline-block h-[1mm] w-[4.5mm] rounded-full"
                                    :style="{ backgroundColor: accentColor }"
                                ></span>
                                <span class="font-mono text-[7.5pt] text-muted">Rifiuto reciproco</span>
                            </span>
                            <span class="inline-flex items-center gap-[1.5mm]">
                                <span class="inline-block h-[2.5mm] w-[2.5mm] rounded-full bg-black"></span>
                                <span class="font-mono text-[7.5pt] text-muted">Membro isolato</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="sna-stats pt-3">
                    <table class="w-full text-left">
                        <tbody>
                            <tr v-for="row in metricRows" :key="row.key" class="align-baseline">
                                <td
                                    class="py-[0.75mm] pr-[4mm] font-mono text-[8pt] font-medium tracking-[0.08em] text-muted uppercase"
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
            </div>
        </template>
    </BasePage>
</template>

<style scoped>
/* The content cell is split 2/3 – 1/3 with flexbox. Flex and percentage heights
   work here because the content cell has a definite height (see BasePage). */
.sna-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Plot band: 60% of the content cell. */
.sna-plot {
    flex: 0 0 60%;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

/* Stats band: 40% of the content cell, vertically centered. */
.sna-stats {
    flex: 0 0 40%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* The SVG fills the plot band minus the thin legend strip. */
.plot-svg {
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
}
.plot-legend {
    flex: 0 0 6mm;
    display: flex;
    align-items: center;
}

/* The SVG is injected via v-html, so it has no scoped attribute; :deep reaches
   it from the .plot-svg wrapper. It fills the wrapper and the default
   `preserveAspectRatio="xMidYMid meet"` keeps the graph's aspect ratio. */
.plot-svg :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
