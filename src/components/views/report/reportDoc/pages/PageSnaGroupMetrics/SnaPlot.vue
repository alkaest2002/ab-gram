<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed, reactive, ref } from "vue";

//   -- From composables.
import { useNodeEmphasis } from "@/composables/report/useNodeEmphasis";
import { useSnaPlotWorker } from "@/composables/report/useSnaPlotWorker";
import { useSvgEmphasis } from "@/composables/report/useSvgEmphasis";

//   -- From relative.
import SnaCustomizePlotModal from "./SnaCustomizePlotModal.vue";

// --- Props --------------
const props = defineProps({
  // Initial SVG markup for the network plot. SnaPlot owns a local copy so the
  // worker can swap it in place after a regeneration without writing straight
  // back to the report store.
  initialSvg: { type: String, default: "" },
  // Accent hue shared by the plot, legend swatches and arrow glyphs.
  accentColor: { type: String, default: "" },
  // Preference type, selects the per-type legend text below.
  typeOfSna: { type: String, default: "likes" },
  // Members used to rebuild the graph during regeneration.
  members: { type: Array, default: () => [] },
  // Per-node metadata for the emphasis controls.
  nodeInfo: { type: Array, default: () => [] },
});

// --- Emits --------------
const emit = defineEmits(["regenerate-sna-plot"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Per-type legend text for the directed and mutual edge glyphs.
const SNA_PLOT_CONFIG = {
  likes: {
    directed: "Scelta non reciproca",
    mutual: "Scelta reciproca",
  },
  dislikes: {
    directed: "Rifiuto non reciproco",
    mutual: "Rifiuto reciproco",
  },
};

// The rendered SVG, owned locally so regeneration can swap it in place.
const svg = ref(props.initialSvg);

// Template ref for the SVG container, used by the emphasis composable.
const svgContainer = ref(null);

// Modal ref and transient regeneration error.
const customizeModal = ref(null);
const error = ref("");

// --- Composables --------
const nodeInfo = computed(() => props.nodeInfo);

// Single source of truth for the SVG configuration. The emphasis slice is
// owned by `useNodeEmphasis` (which also derives `dimmedNodes`); layout is a
// separate reactive slice. Layout defaults mirror the module-level defaults in
// `snaPlots.js` (SCALING_RATIO / GRAVITY).
const { emphasis, dimmedNodes, setState: setEmphasis } = useNodeEmphasis(nodeInfo);
const layout = reactive({ scalingRatio: 0.6, gravity: 1.1 });
const config = reactive({ emphasis, layout });

// Drives `.is-dimmed` class toggling on the injected SVG elements. The `svg`
// content is passed as a tracked dependency so the effect re-runs when
// `v-html` replaces the DOM after a worker regeneration.
useSvgEmphasis(svgContainer, dimmedNodes, svg);

const { isPlotRegenerating, regeneratePlot } = useSnaPlotWorker({
  onSuccess: (regeneratedSvg) => {
    const nextSvg = regeneratedSvg ?? svg.value;
    svg.value = nextSvg;

    // Bubbled up to `ReportGenerated`, which persists the regenerated plot
    // in the report store so it survives re-renders and print/export.
    emit("regenerate-sna-plot", {
      typeOfPreference: props.typeOfSna,
      accentColor: props.accentColor,
      svg: nextSvg,
    });
    customizeModal.value?.snaPlotModalForceClose();
  },
  onError: (message) => {
    error.value = message;
  },
});

// --- Computed -----------
const legend = computed(() => SNA_PLOT_CONFIG[props.typeOfSna] ?? SNA_PLOT_CONFIG.likes);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function openModal() {
  error.value = "";
  customizeModal.value?.snaPlotModalOpen();
}

function handleModalClose() {
  error.value = "";
}

// Apply an emphasis snapshot from the modal. No worker is involved: emphasis
// only flips the `.is-dimmed` classes via `useSvgEmphasis`.
function regenerateEmphasis(changes) {
  setEmphasis(changes);
}

// Apply the layout snapshot from the modal and rebuild the plot off the main
// thread with the new ForceAtlas2 settings.
function regenerateLayout(changes) {
  const settings = {
    scalingRatio: Number(changes.scalingRatio),
    gravity: Number(changes.gravity),
  };

  if (!Number.isFinite(settings.scalingRatio) || !Number.isFinite(settings.gravity)) {
    error.value = "Inserisci valori numerici validi.";
    return;
  }

  error.value = "";
  layout.scalingRatio = settings.scalingRatio;
  layout.gravity = settings.gravity;

  regeneratePlot({
    members: props.members,
    accentColor: props.accentColor,
    typeOfSna: props.typeOfSna,
    settings,
  });
}
</script>

<template>
  <div class="sna-plot border-b border-line pb-1">
    <div ref="svgContainer" class="plot-svg relative">
      <div class="h-full w-full" v-html="svg"></div>
      <button
        type="button"
        class="absolute bottom-2 right-2 z-10 print:hidden flex h-5 w-5 items-center justify-center rounded-full border border-line bg-canvas/90 text-sm leading-none text-muted shadow-sm transition-colors hover:text-ink"
        aria-label="Personalizza il grafico"
        title="Personalizza il grafico"
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
            <polyline
              points="11,1.5 16,6 11,10.5"
              fill="none"
              :stroke="accentColor"
              stroke-width="1"
            />
          </svg>
          <span class="font-mono text-[7.5pt] text-muted">{{ legend.directed }}</span>
        </span>
        <span class="inline-flex items-center gap-[1.5mm]">
          <span
            class="inline-block h-[1mm] w-[4.5mm] rounded-full"
            :style="{ backgroundColor: accentColor }"
          ></span>
          <span class="font-mono text-[7.5pt] text-muted">{{ legend.mutual }}</span>
        </span>
        <span class="inline-flex items-center gap-[1.5mm]">
          <span class="inline-block h-[2.5mm] w-[2.5mm] rounded-full bg-black"></span>
          <span class="font-mono text-[7.5pt] text-muted">Membro isolato</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Customization modal: teleported to <body> by the component so it escapes
       the fixed-height, overflow-hidden report page. -->
  <SnaCustomizePlotModal
    ref="customizeModal"
    :sna-plot-is-regenerating="isPlotRegenerating"
    :sna-plot-regeneration-error="error"
    :sna-plot-node-info="nodeInfo"
    :sna-plot-config="config"
    @sna-plot-modal-close="handleModalClose"
    @sna-plot-regenerate-emphasis="regenerateEmphasis"
    @sna-plot-regenerate-layout="regenerateLayout"
  />
</template>

<style scoped>
/* Plot band: 60% of the content cell. */
.sna-plot {
  flex: 0 0 60%;
  min-height: 0;
  display: flex;
  flex-direction: column;
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

/* De-emphasized (dimmed) nodes and edges: the `.is-dimmed` class is toggled by
   the `useSvgEmphasis` composable. Circles get a light gray and labels switch
   to a darker gray; edges (and their arrowheads) become fully transparent. */
.plot-svg :deep(circle.is-dimmed) {
  fill: #cecece;
  stroke: #cecece;
  stroke-width: 1;
}
.plot-svg :deep(line.is-dimmed) {
  opacity: 0;
}
.plot-svg :deep(text.is-dimmed) {
  fill: #333;
}
</style>
