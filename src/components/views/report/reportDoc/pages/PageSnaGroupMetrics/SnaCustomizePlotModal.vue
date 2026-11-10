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
      emphasis: { typeOfFilter: "all-on", filterValue: null },
      layout: { scalingRatio: 0.6, gravity: 1.1 },
    }),
  },
});

// --- Emits --------------
const emit = defineEmits([
  "sna-plot-close-modal",
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
// leaks into a new dialog. Both tab drafts reset when their tabs remount.
watch(snaPlotModalIsOpen, (isOpen) => {
  if (isOpen) {
    activeTab.value = "emphasize";
  }
});

// Notify the parent when the dialog actually closes, so it can reset its
// transient error state. `isOpen` only flips to false after `canClose` passes,
// so this never fires for a blocked close.
watch(snaPlotModalIsOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) emit("sna-plot-close-modal");
});

// --- Lifecycle ----------

// --- Methods ------------
// Commit the emphasis filter and close the dialog. Emphasis is applied
// synchronously by the parent (no worker), so there's no success callback to
// wait for before closing.
const regenerateEmphasis = (filter) => {
  emit("sna-plot-regenerate-emphasis", filter);
  snaPlotModalClose();
};

// Ask the parent to regenerate with the submitted layout settings. The dialog
// stays open while the worker runs, then is force-closed on success.
const regenerateLayout = (layoutConfig) => {
  emit("sna-plot-regenerate-layout", layoutConfig);
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
          :sna-plot-emphasis-config="snaPlotConfig.emphasis"
          :sna-plot-is-regenerating="snaPlotIsRegenerating"
          :sna-plot-node-info="snaPlotNodeInfo"
          @sna-plot-regenerate-emphasis="regenerateEmphasis"
          @sna-plot-close-modal="snaPlotModalClose"
        />

        <!-- ── Layout tab ─────────────────────────────────────────── -->
        <SnaCustomizeLayoutTab
          v-show="activeTab === 'layout'"
          :sna-plot-layout-config="snaPlotConfig.layout"
          :sna-plot-is-regenerating="snaPlotIsRegenerating"
          :sna-plot-regeneration-error="snaPlotRegenerationError"
          @sna-plot-regenerate-layout="regenerateLayout"
          @sna-plot-close-modal="snaPlotModalClose"
        />
      </div>
    </div>
  </Teleport>
</template>
