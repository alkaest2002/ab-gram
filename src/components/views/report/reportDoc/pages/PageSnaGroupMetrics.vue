<script setup>
// --- Imports ------------
//   -- From vue
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

//   -- From utils
import { createSnaPlotWorker } from "@/utils/worker";

//   -- From relative
import BasePage from "./BasePage.vue";

// --- Props --------------
const props = defineProps({
    typeOfSna: {
        type: String,
        required: true,
        validator: (value) => ["likes", "dislikes"].includes(value),
    },
    members: { type: Array, default: () => [] },
    snaPlot: { type: Object, default: null },
    snaMetrics: { type: Object, default: () => ({}) },
    morenoMetrics: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

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
        morenoIndexes: [
            { key: "cohesion", label: "Indice di coesione (tipo I)" },
            { key: "cohesionTypeII", label: "Indice di coesione (tipo II)" },
        ],
    },
    dislikes: {
        accentColor: "#dc2626",
        pageTitle: "Rete dei rifiuti",
        edgeLabel: "Totale rifiuti effettuati",
        mutualEdgeLabel: "Totale rifiuti reciproci effettuati",
        directedLegend: "Rifiuto non reciproco",
        mutualLegend: "Rifiuto reciproco",
        morenoIndexes: [
            { key: "conflict", label: "Indice di conflitto (tipo I)" },
            { key: "conflictTypeII", label: "Indice di conflitto (tipo II)" },
        ],
    },
};

const config = SNA_CONFIG[props.typeOfSna] ?? SNA_CONFIG.likes;

// Reuse the plot's own accent so the metric bars and legend stay in the same
// hue as the graph, falling back to the type-specific color otherwise.
const accentColor = props.snaPlot?.accentColor ?? config.accentColor;

// Plot regeneration state. The rendered SVG is kept locally so the worker can
// swap it in place; the change is local to this page and never writes back to
// the report store.
const svg = ref(props.snaPlot?.svg ?? "");
const isModalOpen = ref(false);
const isRegenerating = ref(false);
const error = ref("");

// ForceAtlas2 settings edited by the modal. These mirror the module-level
// defaults in `snaPlots.js` (SCALING_RATIO / GRAVITY).
const scalingRatio = ref(0.6);
const gravity = ref(1.1);

// The regeneration worker, kept so it can be terminated mid-flight.
let worker = null;

// Metric key -> display label and formatting kind. Counts are whole numbers;
// the four structural indices are proportions in [0, 1], shown as percentages
// with a small bar so the value reads at a glance. The two edge labels depend
// on the preference type, so the config is assembled from the selected type.
const METRIC_CONFIG = {
    numberOfNodes: { label: "Numero di membri nel gruppo", kind: "count" },
    numberOfEdges: { label: config.edgeLabel, kind: "count" },
    numberOfMutualEdges: { label: config.mutualEdgeLabel, kind: "count" },
    networkDensity: { label: "Densità della rete", kind: "ratio" },
    networkCentralization: { label: "Centralizzazione della rete", kind: "ratio" },
    networkReciprocity: { label: "Reciprocità delle rete", kind: "ratio" },
    networkTransitivity: { label: "Transitività della rete", kind: "ratio" },
};

const metricRows = (() => {
    const keys = props.snaMetrics?.metrics ?? [];
    const values = props.snaMetrics?.rawValuesById?.[0] ?? [];

    const rows = keys.map((key, index) => ({
        key,
        label: METRIC_CONFIG[key]?.label ?? key,
        kind: METRIC_CONFIG[key]?.kind ?? "count",
        value: values[index] ?? 0,
    }));

    // The Moreno group indices that complement this preference type (cohesion
    // for likes, conflict for dislikes, in both type I and type II) are
    // appended as final ratio rows.
    const morenoKeys = props.morenoMetrics?.metrics ?? [];
    const morenoValues = props.morenoMetrics?.rawValuesById?.[0] ?? [];

    for (const { key, label } of config.morenoIndexes) {
        const morenoIndex = morenoKeys.indexOf(key);
        if (morenoIndex !== -1) {
            rows.push({
                key,
                label,
                kind: "ratio",
                value: morenoValues[morenoIndex] ?? 0,
            });
        }
    }

    return rows;
})();

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------
// Lock page scroll while the regeneration modal is open.
watch(isModalOpen, (open) =>
    document.body.classList.toggle("overflow-hidden", open),
);

// --- Lifecycle ----------

// --- Methods ------------
function openModal() {
    error.value = "";
    isModalOpen.value = true;
}

function closeModal() {
    // Ignore close attempts while a regeneration is running: the user must
    // either let it finish or stop it explicitly.
    if (isRegenerating.value) return;
    isModalOpen.value = false;
    error.value = "";
}

function stopWorker() {
    if (worker) {
        worker.terminate();
        worker = null;
    }
    isRegenerating.value = false;
}

function confirmRegenerate() {
    if (isRegenerating.value) return;

    const settings = {
        scalingRatio: Number(scalingRatio.value),
        gravity: Number(gravity.value),
    };

    if (!Number.isFinite(settings.scalingRatio) || !Number.isFinite(settings.gravity)) {
        error.value = "Inserisci valori numerici validi.";
        return;
    }

    error.value = "";

    try {
        worker = createSnaPlotWorker();
    } catch (err) {
        console.error("Failed to create SNA plot worker:", err);
        error.value = "Impossibile avviare il worker.";
        return;
    }

    isRegenerating.value = true;

    worker.onmessage = (event) => {
        const { data } = event;
        stopWorker();

        if (data?.error) {
            error.value = data.error;
            return;
        }

        svg.value = data?.svg ?? svg.value;
        isModalOpen.value = false;
    };

    worker.onerror = () => {
        stopWorker();
        error.value = "Impossibile rigenerare il grafico.";
    };

    // Hand the worker a plain, non-reactive snapshot of the members so it can
    // be structured-cloned without dragging Vue proxies across the boundary.
    worker.postMessage({
        members: JSON.parse(JSON.stringify(props.members)),
        accentColor,
        config: {
            typeOfPreference: props.typeOfSna,
            settings,
        },
    });
}

function handleKeydown(event) {
    if (event.key === "Escape") closeModal();
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
    document.body.classList.remove("overflow-hidden");
    stopWorker();
});

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
            <h2 class="text-[16pt]">{{ config.pageTitle }}</h2>
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
                    <div class="plot-svg relative">
                        <div class="h-full w-full" v-html="svg"></div>
                        <button
                            type="button"
                            class="absolute bottom-2 right-2 z-10 print:hidden flex h-5 w-5 items-center justify-center rounded-full border border-line bg-canvas/90 text-sm leading-none text-muted shadow-sm transition-colors hover:text-ink"
                            aria-label="Rigenera il grafico"
                            title="Rigenera il grafico"
                            @click="openModal"
                        >
                            +
                        </button>
                    </div>
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

                <div class="sna-stats pt-1">
                    <table class="w-full text-left">
                        <tbody>
                            <tr v-for="row in metricRows" :key="row.key" class="align-baseline">
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
            </div>

            <!-- Regeneration modal, teleported to <body> so it escapes the
                 fixed-height, overflow-hidden report page that would clip it. -->
            <Teleport to="body">
                <div
                    v-if="isModalOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 print:hidden"
                    @click.self="closeModal"
                >
                    <div
                        class="w-full max-w-sm rounded-xl border border-line bg-canvas p-5 shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sna-regenerate-title"
                    >
                        <h3 id="sna-regenerate-title" class="font-display text-[13pt] font-bold text-ink">
                            Rigenera il grafico
                        </h3>
                        <p class="mt-1 text-[8.5pt] leading-snug text-muted">
                            Modifica i parametri di ForceAtlas2 e ricostruisci la disposizione dei nodi.
                        </p>

                        <form class="mt-4 space-y-3" @submit.prevent="confirmRegenerate">
                            <label class="block">
                                <span class="font-mono text-[8pt] font-medium tracking-[0.08em] uppercase text-muted">
                                    Scaling ratio
                                </span>
                                <input
                                    v-model.number="scalingRatio"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    :disabled="isRegenerating"
                                    class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-1.5 text-[10pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
                                />
                            </label>

                            <label class="block">
                                <span class="font-mono text-[8pt] font-medium tracking-[0.08em] uppercase text-muted">
                                    Gravity
                                </span>
                                <input
                                    v-model.number="gravity"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    :disabled="isRegenerating"
                                    class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-1.5 text-[10pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
                                />
                            </label>

                            <p v-if="error" class="text-[8.5pt] text-reject">{{ error }}</p>

                            <div class="flex justify-end gap-2 pt-1">
                                <button
                                    v-if="!isRegenerating"
                                    type="button"
                                    class="rounded-md px-3 py-1.5 text-[9pt] font-medium text-muted transition-colors hover:bg-line hover:text-ink"
                                    @click="closeModal"
                                >
                                    Annulla
                                </button>
                                <button
                                    v-if="isRegenerating"
                                    type="button"
                                    class="rounded-md bg-reject px-3 py-1.5 text-[9pt] font-medium text-white transition-opacity hover:opacity-90"
                                    @click="stopWorker"
                                >
                                    Interrompi
                                </button>
                                <button
                                    v-else
                                    type="submit"
                                    class="rounded-md bg-accent px-3 py-1.5 text-[9pt] font-medium text-white transition-opacity hover:opacity-90"
                                >
                                    Rigenera
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Teleport>
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
