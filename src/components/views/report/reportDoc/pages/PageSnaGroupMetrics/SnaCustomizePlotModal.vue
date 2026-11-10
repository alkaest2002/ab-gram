<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed, ref, watch } from "vue";

//   -- From composables.
import { useDisclosure } from "@/composables/useDisclosure";
import { useNodeEmphasis } from "@/composables/report/useNodeEmphasis";

//   -- From relative.
import SnaCustomizeEmphasisTab from "./SnaCustomizeEmphasisTab.vue";
import SnaCustomizeLayoutTab from "./SnaCustomizeLayoutTab.vue";

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the form while the plot is
  // being rebuilt off the main thread.
  regenerating: { type: Boolean, default: false },
  error: { type: String, default: "" },
  // ForceAtlas2 settings, bound two-way from the parent container.
  scalingRatio: { type: Number, default: 0.6 },
  gravity: { type: Number, default: 1.1 },
  // Per-node metadata for the emphasis controls.
  nodeInfo: { type: Array, default: () => [] },
  // Current emphasis state, owned by the parent via useNodeEmphasis.
  activeFilter: { type: String, default: "all-on" },
  emphasizedNodes: { type: Set, default: () => new Set() },
  minInDegree: { type: Number, default: 0 },
});

// --- Emits --------------
const emit = defineEmits([
  "update:scalingRatio",
  "update:gravity",
  "close-sna-plot-modal",
  "regenerate-sna-plot-layout",
  "apply-sna-emphasis",
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

// Local draft of the ForceAtlas2 settings. Edits are staged here while the
// dialog is open and only committed to the parent on "Rigenera grafico", so
// cancelling leaves the applied settings untouched.
const draftScalingRatio = ref(props.scalingRatio);
const draftGravity = ref(props.gravity);

// Local draft of the emphasis state. A dedicated `useNodeEmphasis` instance
// stages the emphasis edits so they're committed to the parent only on
// "Mostra grafico", mirroring the layout draft above.
const draftEmphasis = useNodeEmphasis(computed(() => props.nodeInfo));

// --- Composables --------
// Own the open/closed state locally. The `canClose` guard keeps the dialog
// locked while a regeneration is running so it force-closes cleanly on success.
const {
  isOpen: snaPlotModalIsOpen,
  open: snaPlotModalOpen,
  close: snaPlotModalClose,
} = useDisclosure(false, {
  canClose: () => !props.regenerating,
});

// Force-close bypasses the guard: the parent calls it after a successful
// regeneration, where the `regenerating` prop may still read as `true` in the
// same tick the worker finishes.
const snaPlotModalForceClose = () => (snaPlotModalIsOpen.value = false);

// --- Watchers -----------
// Start each open on the first tab, so a previous session's selection never
// leaks into a new dialog, and reset the layout draft to the applied settings.
watch(snaPlotModalIsOpen, (isOpen) => {
  if (isOpen) {
    activeTab.value = "emphasize";
    draftScalingRatio.value = props.scalingRatio;
    draftGravity.value = props.gravity;
    draftEmphasis.setState({
      activeFilter: props.activeFilter,
      minInDegree: props.minInDegree,
      emphasizedNodes: props.emphasizedNodes,
    });
  }
});

// Notify the parent when the dialog actually closes, so it can reset its
// transient error state. `isOpen` only flips to false after `canClose` passes,
// so this never fires for a blocked close.
watch(snaPlotModalIsOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) emit("close-sna-plot-modal");
});

// --- Lifecycle ----------

// --- Methods ------------
// Stage an in-degree edit in the local emphasis draft.
const setDraftMinInDegree = (value) => {
  draftEmphasis.minInDegree.value = value;
};

// Commit the staged emphasis state to the parent, then close the dialog.
const applyEmphasis = () => {
  emit("apply-sna-emphasis", draftEmphasis.snapshot());
  snaPlotModalClose();
};

// Commit the staged layout settings to the parent, then start regeneration.
// Committing first keeps the parent's refs in sync before `confirmRegenerate`
// reads them, while still applying changes exactly once (on submit).
const applyLayoutAndRegenerate = () => {
  emit("update:scalingRatio", draftScalingRatio.value);
  emit("update:gravity", draftGravity.value);
  emit("regenerate-sna-plot-layout");
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
          :disabled="regenerating"
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
          :regenerating="regenerating"
          :node-info="nodeInfo"
          :active-filter="draftEmphasis.activeFilter.value"
          :emphasized-nodes="draftEmphasis.emphasizedNodes.value"
          :min-in-degree="draftEmphasis.minInDegree.value"
          @node-emphasis-apply-filter="draftEmphasis.applyFilter"
          @node-emphasis-toggle="draftEmphasis.toggleNode"
          @update:minInDegree="setDraftMinInDegree"
          @sna-plot-apply-emphasis="applyEmphasis"
          @sna-plot-close-modal="snaPlotModalClose"
        />

        <!-- ── Layout tab ─────────────────────────────────────────── -->
        <SnaCustomizeLayoutTab
          v-show="activeTab === 'layout'"
          :regenerating="regenerating"
          :error="error"
          v-model:scaling-ratio="draftScalingRatio"
          v-model:gravity="draftGravity"
          @sna-plot-regenerate-layout="applyLayoutAndRegenerate"
          @sna-plot-close-modal="snaPlotModalClose"
        />
      </div>
    </div>
  </Teleport>
</template>
