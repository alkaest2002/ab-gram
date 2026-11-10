<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { ref, watch } from "vue";

//   -- From composables.
import { useDisclosure } from "@/composables/useDisclosure";
import { cloneEmphasis } from "@/composables/report/useNodeEmphasis";

//   -- From relative.
import SnaCustomizeEmphasisTab from "./SnaCustomizeEmphasisTab.vue";
import SnaCustomizeLayoutTab from "./SnaCustomizeLayoutTab.vue";

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the form while the plot is
  // being rebuilt off the main thread.
  snaPlotIsRegenerating: { type: Boolean, default: false },
  snaPlotRegenerationError: { type: String, default: "" },
  // Per-node metadata for the emphasis controls.
  snaPlotNodeInfo: { type: Array, default: () => [] },
  // Current SVG configuration snapshot, owned by SnaPlot.
  snaPlotConfig: {
    type: Object,
    default: () => ({
      emphasis: { activeFilter: "all-on", minInDegree: 0, emphasizedNodes: new Set() },
      layout: { scalingRatio: 0.6, gravity: 1.1 },
    }),
  },
});

// --- Emits --------------
const emit = defineEmits([
  "sna-plot-modal-close",
  "sna-plot-regenerate-emphasis",
  "sna-plot-regenerate-layout",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Tabs shown inside the customization dialog. Each tab maps to one of the two
// sections that used to be stacked: emphasis and layout regeneration.
const tabs = [
  { id: "emphasize", label: "Evidenzia" },
  { id: "layout", label: "Disposizione" },
];

const activeTab = ref("emphasize");

// Local drafts, staged while the dialog is open and only committed to the
// parent on submit, so cancelling leaves the applied configuration untouched.
const draftEmphasis = ref(cloneEmphasis(props.snaPlotConfig.emphasis));
const draftLayout = ref({ ...props.snaPlotConfig.layout });

// --- Composables --------
// Own the open/closed state locally. The `canClose` guard keeps the dialog
// locked while a regeneration is running so it force-closes cleanly on success.
const {
  isOpen: snaPlotModalIsOpen,
  open: snaPlotModalOpen,
  close: snaPlotModalClose,
} = useDisclosure(false, {
  canClose: () => !props.snaPlotIsRegenerating,
});

// Force-close bypasses the guard: the parent calls it after a successful
// regeneration, where the `snaPlotIsRegenerating` prop may still read as `true` in the
// same tick the worker finishes.
const snaPlotModalForceClose = () => (snaPlotModalIsOpen.value = false);

// --- Watchers -----------
// Start each open on the first tab, so a previous session's selection never
// leaks into a new dialog, and reset both drafts to the applied configuration.
watch(snaPlotModalIsOpen, (isOpen) => {
  if (isOpen) {
    activeTab.value = "emphasize";
    draftEmphasis.value = cloneEmphasis(props.snaPlotConfig.emphasis);
    draftLayout.value = { ...props.snaPlotConfig.layout };
  }
});

// Notify the parent when the dialog actually closes, so it can reset its
// transient error state. `isOpen` only flips to false after `canClose` passes,
// so this never fires for a blocked close.
watch(snaPlotModalIsOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) emit("sna-plot-modal-close");
});

// --- Lifecycle ----------

// --- Methods ------------
// Commit the staged emphasis state and close the dialog. Emphasis is applied
// synchronously by the parent (no worker), so there's no success callback to
// wait for before closing.
const regenerateEmphasis = () => {
  emit("sna-plot-regenerate-emphasis", cloneEmphasis(draftEmphasis.value));
  snaPlotModalClose();
};

// Commit the staged layout settings and ask the parent to regenerate. The
// dialog stays open while the worker runs, then is force-closed on success.
const regenerateLayout = () => {
  emit("sna-plot-regenerate-layout", { ...draftLayout.value });
};

// Expose the open/close methods to the parent.
defineExpose({ snaPlotModalOpen, snaPlotModalForceClose });
</script>

<template>
  <!-- Teleported to <body> so it escapes the fixed-height, overflow-hidden
         report page that would otherwise clip it. -->
  <Teleport to="body">
    <div
      v-if="snaPlotModalIsOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 print:hidden"
      @click.self="snaPlotModalClose"
    >
      <div
        class="relative flex h-90 w-full max-w-lg flex-col overflow-hidden rounded-xl border border-line bg-canvas p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sna-customize-title"
      >
        <!-- ── Close: pinned to the top-right corner of the dialog ── -->
        <button
          type="button"
          class="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink disabled:opacity-50"
          aria-label="Chiudi"
          title="Chiudi"
          :disabled="snaPlotIsRegenerating"
          @click="snaPlotModalClose"
        >
          <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- ── Header: title ─────────────────────────────────────── -->
        <div class="pr-10">
          <h3 id="sna-customize-title" class="font-display text-[11pt] font-bold text-ink">
            Personalizza il grafico
          </h3>
          <p class="mt-1.5 text-[9pt] leading-snug text-muted">
            Metti in evidenza una parte della rete o rigenera la disposizione dei nodi.
          </p>
        </div>

        <!-- ── Tabs ───────────────────────────────────────────────── -->
        <div
          role="tablist"
          aria-label="Sezioni di personalizzazione"
          class="mt-5 flex shrink-0 gap-2 border-b border-line"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :id="`sna-tab-button-${tab.id}`"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`sna-tab-panel-${tab.id}`"
            class="-mb-px border-b-2 px-3 py-1 text-[8pt] font-medium transition-colors"
            :class="
              activeTab === tab.id
                ? 'border-ink text-ink'
                : 'border-transparent text-muted hover:text-ink'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- ── Emphasis tab ───────────────────────────────────────── -->
        <SnaCustomizeEmphasisTab
          v-show="activeTab === 'emphasize'"
          v-model="draftEmphasis"
          :regenerating="snaPlotIsRegenerating"
          :node-info="snaPlotNodeInfo"
          @sna-plot-regenerate-emphasis="regenerateEmphasis"
          @sna-plot-close-modal="snaPlotModalClose"
        />

        <!-- ── Layout tab ─────────────────────────────────────────── -->
        <SnaCustomizeLayoutTab
          v-show="activeTab === 'layout'"
          v-model="draftLayout"
          :regenerating="snaPlotIsRegenerating"
          :error="snaPlotRegenerationError"
          @sna-plot-regenerate-layout="regenerateLayout"
          @sna-plot-close-modal="snaPlotModalClose"
        />
      </div>
    </div>
  </Teleport>
</template>
