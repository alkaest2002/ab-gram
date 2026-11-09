<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed, ref } from "vue";

//   -- From composables.
import { useNodeEmphasis } from "@/composables/report/useNodeEmphasis";
import { useSnaPlotWorker } from "@/composables/report/useSnaPlotWorker";

//   -- From relative.
import BasePage from "../BasePage.vue";
import SnaPlot from "./SnaPlot.vue";
import SnaCustomizePlotModal from "./SnaCustomizePlotModal.vue";
import SnaMetrics from "./SnaMetrics.vue";

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
  nodeInfo: { type: Array, default: () => [] },
});

// --- Emits --------------
const emit = defineEmits(["regenerate-sna-plot"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Per-type page details: the network plot is drawn with a hard-coded accent in
// `analysisMain` (`#0000FF` for likes, `#FF0000` for dislikes), so the fallback
// below only kicks in when the plot carries no accent of its own. Metric labels
// and legend text live in their respective child components.
const SNA_CONFIG = {
  likes: {
    accentColor: "#2563eb",
    pageTitle: "Rete delle scelte",
  },
  dislikes: {
    accentColor: "#dc2626",
    pageTitle: "Rete dei rifiuti",
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
const customizeModal = ref(null);
const error = ref("");

// ForceAtlas2 settings edited by the modal. These mirror the module-level
// defaults in `snaPlots.js` (SCALING_RATIO / GRAVITY).
const scalingRatio = ref(0.6);
const gravity = ref(1.1);

// --- Composables --------
const nodeInfo = computed(() => props.nodeInfo);
const emphasis = useNodeEmphasis(nodeInfo);

const {
  isRegenerating,
  regenerate,
  stop: stopWorker,
} = useSnaPlotWorker({
  onSuccess: (regeneratedSvg) => {
    const nextSvg = regeneratedSvg ?? svg.value;
    svg.value = nextSvg;

    // Bubbled up to `ReportGenerated`, which persists the regenerated plot
    // in the report store so it survives re-renders and print/export.
    emit("regenerate-sna-plot", {
      typeOfPreference: props.typeOfSna,
      accentColor,
      svg: nextSvg,
    });
    customizeModal.value?.forceClose();
  },
  onError: (message) => {
    error.value = message;
  },
});

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function openModal() {
  error.value = "";
  customizeModal.value?.open();
}

function handleModalClose() {
  error.value = "";
}

function confirmRegenerate() {
  const settings = {
    scalingRatio: Number(scalingRatio.value),
    gravity: Number(gravity.value),
  };

  if (!Number.isFinite(settings.scalingRatio) || !Number.isFinite(settings.gravity)) {
    error.value = "Inserisci valori numerici validi.";
    return;
  }

  error.value = "";

  regenerate({
    members: props.members,
    accentColor,
    typeOfSna: props.typeOfSna,
    settings,
  });
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
        <SnaPlot
          :svg="svg"
          :accent-color="accentColor"
          :type-of-sna="typeOfSna"
          :dimmed-nodes="emphasis.dimmedNodes.value"
          @open-sna-plot-modal="openModal"
        />
        <SnaMetrics
          :sna-metrics="snaMetrics"
          :moreno-metrics="morenoMetrics"
          :type-of-sna="typeOfSna"
          :accent-color="accentColor"
        />
      </div>

      <!-- Customization modal: teleported to <body> by the component so it
                 escapes the fixed-height, overflow-hidden report page. -->
      <SnaCustomizePlotModal
        ref="customizeModal"
        :regenerating="isRegenerating"
        :error="error"
        :node-info="nodeInfo"
        :active-filter="emphasis.activeFilter.value"
        :emphasized-nodes="emphasis.emphasizedNodes.value"
        v-model:scaling-ratio="scalingRatio"
        v-model:gravity="gravity"
        v-model:min-in-degree="emphasis.minInDegree.value"
        @close-sna-plot-modal="handleModalClose"
        @stop-sna-plot-regeneration="stopWorker"
        @confirm-sna-plot-regeneration="confirmRegenerate"
        @node-emphasis-apply-filter="emphasis.applyFilter"
        @node-emphasis-toggle-node="emphasis.toggleNode"
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
