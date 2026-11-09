<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

//   -- From components.
import BaseClickButton from "@/components/ui/BaseClickButton.vue";
import BaseToggle from "@/components/ui/BaseToggle.vue";

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the emphasis controls.
  regenerating: { type: Boolean, default: false },
  // Per-node metadata for the clickable node circles.
  nodeInfo: { type: Array, default: () => [] },
  // Current emphasis state, owned by the parent via useNodeEmphasis.
  activeFilter: { type: String, default: "all-on" },
  emphasizedNodes: { type: Set, default: () => new Set() },
  minInDegree: { type: Number, default: 0 },
});

// --- Emits --------------
const emit = defineEmits([
  "node-emphasis-apply-filter",
  "node-emphasis-toggle-node",
  "update:minInDegree",
  "close-sna-plot-modal",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read the minimum in-degree from the prop and write it back by
// emitting `update:minInDegree`, keeping the parent the single source of truth.
const minInDegree = computed({
  get: () => props.minInDegree,
  set: (value) => {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    emit("update:minInDegree", n);
  },
});

// Maximum in-degree across all nodes, used as the upper bound for the input.
const maxInDegree = computed(() => props.nodeInfo.reduce((max, n) => Math.max(max, n.inDegree), 0));

// v-model: true when every node is emphasized. Toggling applies the matching
// all-on/all-off preset, so the switch stays the single source of truth for the
// "everything visible" state no matter how it was reached.
const allVisible = computed({
  get: () =>
    props.nodeInfo.length > 0 &&
    props.emphasizedNodes.size === props.nodeInfo.length &&
    props.activeFilter !== "min-in-degree",
  set: (value) => emit("node-emphasis-apply-filter", value ? "all-on" : "all-off"),
});

// v-model: whether the "min in-degree" threshold filter is active. Turning it
// off falls back to showing every node.
const minInDegreeActive = computed({
  get: () => props.activeFilter === "min-in-degree",
  set: (value) => emit("node-emphasis-apply-filter", value ? "min-in-degree" : "all-on"),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div
    id="sna-tab-panel-emphasize"
    role="tabpanel"
    aria-labelledby="sna-tab-button-emphasize"
    class="mt-5 flex min-h-0 flex-1 flex-col"
  >
    <div class="min-h-0 flex-1 overflow-y-auto">
      <fieldset class="space-y-4" :disabled="regenerating">
        <legend class="sr-only">Evidenzia</legend>

        <!-- All-visible and in-degree toggles — all on one row ──── -->
        <div class="flex flex-wrap items-center gap-2">
          <BaseToggle
            v-model="allVisible"
            label-position="right"
            :disabled="regenerating"
            size="sm"
          >
            <span class="text-[9pt]">Tutti visibili</span>
          </BaseToggle>
          <BaseToggle
            v-model="minInDegreeActive"
            label-position="right"
            :disabled="regenerating"
            size="sm"
          >
            <span class="text-[9pt]">Archi entranti ≥</span>
          </BaseToggle>
          <input
            v-model.number="minInDegree"
            type="number"
            min="0"
            :max="maxInDegree"
            step="1"
            :disabled="!minInDegreeActive"
            class="w-14 rounded border border-line bg-canvas px-2 py-1 text-[9pt] text-ink outline-none transition-colors focus:border-ink disabled:opacity-50"
          />
        </div>

        <!-- (c) Clickable node circles ───────────────────────────── -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="node in nodeInfo"
            :key="node.id"
            type="button"
            class="inline-flex size-6 items-center justify-center rounded-full border text-[6.5pt] font-semibold leading-none transition-all hover:opacity-80"
            :class="
              emphasizedNodes.has(node.id)
                ? 'border-transparent bg-[#404040] text-white'
                : 'border-[#d4d4d4] bg-white text-[#737373]'
            "
            :title="node.id"
            :aria-pressed="emphasizedNodes.has(node.id)"
            @click="emit('node-emphasis-toggle-node', node.id)"
          >
            {{ node.id }}
          </button>
        </div>
      </fieldset>
    </div>

    <div class="flex shrink-0 gap-3 pt-5">
      <BaseClickButton
        class="flex-1 px-3 py-1 text-[9pt]"
        button-variant="outline"
        @click="emit('close-sna-plot-modal')"
      >
        Annulla
      </BaseClickButton>
      <BaseClickButton
        class="flex-1 px-3 py-1 text-[9pt]"
        button-variant="solid"
        @click="emit('close-sna-plot-modal')"
      >
        Mostra grafico
      </BaseClickButton>
    </div>
  </div>
</template>
