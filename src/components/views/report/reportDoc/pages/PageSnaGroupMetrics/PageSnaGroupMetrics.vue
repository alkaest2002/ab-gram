<script setup>
// --- Imports ------------
//   -- From vue
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

//   -- From utils
import { createSnaPlotWorker } from "@/utils/worker";

//   -- From relative
import BasePage from "../BasePage.vue";
import SnaPlot from "./SnaPlot.vue";
import SnaRegenerateModal from "./SnaRegenerateModal.vue";
import SnaStats from "./SnaStats.vue";

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
                <SnaPlot
                    :svg="svg"
                    :accent-color="accentColor"
                    :directed-legend="config.directedLegend"
                    :mutual-legend="config.mutualLegend"
                    @open-modal="openModal"
                />
                <SnaStats :rows="metricRows" :accent-color="accentColor" />
            </div>

            <!-- Regeneration modal: teleported to <body> by the component so it
                 escapes the fixed-height, overflow-hidden report page. -->
            <SnaRegenerateModal
                :open="isModalOpen"
                :regenerating="isRegenerating"
                :error="error"
                v-model:scaling-ratio="scalingRatio"
                v-model:gravity="gravity"
                @close="closeModal"
                @stop="stopWorker"
                @confirm="confirmRegenerate"
            />
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
</style>
