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
  // Whether a regeneration is running: disables the form and swaps the
  // cancel/submit buttons for an interrupt button.
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
  minInDegree: { type: Number, default: 1 },
});

// --- Emits --------------
const emit = defineEmits([
  "update:scalingRatio",
  "update:gravity",
  "update:minInDegree",
  "close",
  "stop",
  "confirm",
  "apply-filter",
  "toggle-node",
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
// locked while a regeneration is running (the user must stop it explicitly).
const { isOpen, open, close } = useDisclosure(false, {
  canClose: () => !props.regenerating,
});

// Force-close bypasses the guard: the parent calls it after a successful
// regeneration, where the `regenerating` prop may still read as `true` in the
// same tick the worker finishes.
const forceClose = () => (isOpen.value = false);

// --- Watchers -----------
// Start each open on the first tab, so a previous session's selection never
// leaks into a new dialog.
watch(isOpen, (open) => {
  if (open) activeTab.value = "emphasize";
});

// While a regeneration is running, the only available action is "Interrompi",
// which lives on the layout tab — jump there so it stays reachable.
watch(
  () => props.regenerating,
  (regenerating) => {
    if (regenerating) activeTab.value = "layout";
  },
);

// Notify the parent when the dialog actually closes, so it can reset its
// transient error state. `isOpen` only flips to false after `canClose` passes,
// so this never fires for a blocked close.
watch(isOpen, (open, wasOpen) => {
  if (wasOpen && !open) emit("close");
});

// --- Lifecycle ----------

// --- Methods ------------
// Expose the open/close methods to the parent.
defineExpose({ open, forceClose });
</script>

<template>
  <!-- Teleported to <body> so it escapes the fixed-height, overflow-hidden
         report page that would otherwise clip it. -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 print:hidden"
      @click.self="close"
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
          @click="close"
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
          :active-filter="activeFilter"
          :emphasized-nodes="emphasizedNodes"
          :min-in-degree="minInDegree"
          @apply-filter="emit('apply-filter', $event)"
          @toggle-node="emit('toggle-node', $event)"
          @update:min-in-degree="emit('update:minInDegree', $event)"
          @close="close"
        />

        <!-- ── Layout tab ─────────────────────────────────────────── -->
        <SnaCustomizeLayoutTab
          v-show="activeTab === 'layout'"
          :regenerating="regenerating"
          :error="error"
          :scaling-ratio="scalingRatio"
          :gravity="gravity"
          @update:scaling-ratio="emit('update:scalingRatio', $event)"
          @update:gravity="emit('update:gravity', $event)"
          @confirm="emit('confirm')"
          @stop="emit('stop')"
          @close="close"
        />
      </div>
    </div>
  </Teleport>
</template>
