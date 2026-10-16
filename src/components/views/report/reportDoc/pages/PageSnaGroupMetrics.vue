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
    typeOfSna: {
        type: String,
        required: true,
        validator: (value) => ["likes", "dislikes"].includes(value),
    },
    snaPlot: { type: Object, default: null },
    snaMetrics: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- State --------------
// Per-type presentation details: the network plot is drawn with a hard-coded
// accent in `analysisMain` (`#0000FF` for likes, `#FF0000` for dislikes), so the
// fallback below only kicks in when the plot carries no accent of its own. The
// title, metric labels and legend follow the same likes/dislikes split.
const SNA_CONFIG = {
    likes: {
        accentColor: "#2563eb",
        pageTitle: "Rete delle scelte",
        edgeLabel: "Totale scelte effettuate",
        mutualEdgeLabel: "Totale scelte reciproche effettuate",
        directedLegend: "Scelta non reciproca",
        mutualLegend: "Scelta reciproca",
    },
    dislikes: {
        accentColor: "#dc2626",
        pageTitle: "Rete dei rifiuti",
        edgeLabel: "Totale rifiuti effettuati",
        mutualEdgeLabel: "Totale rifiuti reciproci effettuati",
        directedLegend: "Rifiuto non reciproco",
        mutualLegend: "Rifiuto reciproco",
    },
};

// --- Computed -----------
const config = computed(() => SNA_CONFIG[props.typeOfSna] ?? SNA_CONFIG.likes);

// Reuse the plot's own accent so the metric bars and legend stay in the same
// hue as the graph, falling back to the type-specific color otherwise.
const accentColor = computed(() => props.snaPlot?.accentColor ?? config.value.accentColor);

// Metric key -> display label and formatting kind. Counts are whole numbers;
// the four structural indices are proportions in [0, 1], shown as percentages
// with a small bar so the value reads at a glance. The two edge labels depend
// on the preference type, so the config is assembled reactively.
const METRIC_CONFIG = computed(() => ({
    numberOfNodes: { label: "Numero di membri nel gruppo", kind: "count" },
    numberOfEdges: { label: config.value.edgeLabel, kind: "count" },
    numberOfMutualEdges: { label: config.value.mutualEdgeLabel, kind: "count" },
    networkDensity: { label: "Densità della rete", kind: "ratio" },
    networkCentralization: { label: "Centralizzazione della rete", kind: "ratio" },
    networkReciprocity: { label: "Reciprocità delle rete", kind: "ratio" },
    networkTransitivity: { label: "Transitività della rete", kind: "ratio" },
}));

const metricRows = computed(() => {
    const keys = props.snaMetrics?.metrics ?? [];
    const values = props.snaMetrics?.rawValuesById?.[0] ?? [];

    return keys.map((key, index) => ({
        key,
        label: METRIC_CONFIG.value[key]?.label ?? key,
        kind: METRIC_CONFIG.value[key]?.kind ?? "count",
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
            <h2 class="text-[16pt] leading-none">{{ config.pageTitle }}</h2>
        </template>

        <template #default>
            <!--
              The content cell is split 2/3 – 1/3 with flexbox (no layout table):
              the plot band on top, the compact stats band below. Only the metric
              list at the bottom is a real table (genuinely tabular label/value
              rows).
            -->
            <div v-if="snaPlot" class="sna-layout">
                <div class="sna-plot border-b border-line pb-1">
                    <div class="plot-svg" v-html="snaPlot.svg"></div>
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
                                <span class="font-mono text-[7.5pt] text-muted">{{ config.directedLegend }}</span>
                            </span>
                            <span class="inline-flex items-center gap-[1.5mm]">
                                <span
                                    class="inline-block h-[1mm] w-[4.5mm] rounded-full"
                                    :style="{ backgroundColor: accentColor }"
                                ></span>
                                <span class="font-mono text-[7.5pt] text-muted">{{ config.mutualLegend }}</span>
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
                                    class="py-[2mm] pr-[4mm] font-mono text-[8pt] font-medium tracking-[0.08em] text-muted uppercase"
                                >
                                    {{ row.label }}
                                </td>
                                <td class="py-[2mm] text-right">
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
