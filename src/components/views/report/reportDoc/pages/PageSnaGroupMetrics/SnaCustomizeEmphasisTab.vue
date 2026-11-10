<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

//   -- From composables.
import {
  applyEmphasisFilter,
  setEmphasisMinInDegree,
  toggleEmphasizedNode,
} from "@/composables/report/useNodeEmphasis";

//   -- From components.
import BaseClickButton from "@/components/ui/BaseClickButton.vue";
import BaseToggle from "@/components/ui/BaseToggle.vue";

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the emphasis controls.
  snaPlotIsRegenerating: { type: Boolean, default: false },
  // Per-node metadata for the clickable node circles.
  snaPlotNodeInfo: { type: Array, default: () => [] },
  // Current emphasis customization, owned by the parent and bound via v-model.
  modelValue: {
    type: Object,
    default: () => ({ activeFilter: "all-on", minInDegree: 0, emphasizedNodes: new Set() }),
  },
});

// --- Emits --------------
const emit = defineEmits([
  "update:modelValue",
  "sna-plot-regenerate-emphasis",
  "sna-plot-close-modal",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read the minimum in-degree from the model and emit a new model,
// recomputing the emphasized set when the min-in-degree filter is active.
const minInDegree = computed({
  get: () => props.modelValue.minInDegree,
  set: (value) => {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    emit("update:modelValue", setEmphasisMinInDegree(props.snaPlotNodeInfo, props.modelValue, n));
  },
});

// Maximum in-degree across all nodes, used as the upper bound for the input.
const maxInDegree = computed(() =>
  props.snaPlotNodeInfo.reduce((max, n) => Math.max(max, n.inDegree), 0),
);

// v-model: true when every node is emphasized. Toggling applies the matching
// all-on/all-off preset.
const allVisible = computed({
  get: () =>
    props.snaPlotNodeInfo.length > 0 &&
    props.modelValue.emphasizedNodes.size === props.snaPlotNodeInfo.length &&
    props.modelValue.activeFilter !== "min-in-degree",
  set: (value) =>
    emit(
      "update:modelValue",
      applyEmphasisFilter(props.snaPlotNodeInfo, props.modelValue, value ? "all-on" : "all-off"),
    ),
});

// v-model: whether the "min in-degree" threshold filter is active. Turning it
// off falls back to showing every node.
const minInDegreeActive = computed({
  get: () => props.modelValue.activeFilter === "min-in-degree",
  set: (value) =>
    emit(
      "update:modelValue",
      applyEmphasisFilter(
        props.snaPlotNodeInfo,
        props.modelValue,
        value ? "min-in-degree" : "all-on",
      ),
    ),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function toggleNode(id) {
  emit("update:modelValue", toggleEmphasizedNode(props.modelValue, id));
}
</script>

<template>
  <div
    id="sna-tab-panel-emphasize"
    role="tabpanel"
    aria-labelledby="sna-tab-button-emphasize"
    class="mt-5 flex min-h-0 flex-1 flex-col"
  >
    <div class="min-h-0 flex-1 overflow-y-auto">
      <fieldset class="space-y-4" :disabled="snaPlotIsRegenerating">
        <legend class="sr-only">Evidenzia</legend>

        <!-- All-visible and in-degree toggles — all on one row ──── -->
        <div class="flex flex-wrap items-center gap-2">
          <BaseToggle
            v-model="allVisible"
            label-position="right"
            :disabled="snaPlotIsRegenerating"
            size="sm"
          >
            <span class="text-[9pt]">Tutti visibili</span>
          </BaseToggle>
          <BaseToggle
            v-model="minInDegreeActive"
            label-position="right"
            :disabled="snaPlotIsRegenerating"
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
            v-for="node in snaPlotNodeInfo"
            :key="node.id"
            type="button"
            class="inline-flex size-6 items-center justify-center rounded-full border text-[6.5pt] font-semibold leading-none transition-all hover:opacity-80"
            :class="
              modelValue.emphasizedNodes.has(node.id)
                ? 'border-transparent bg-[#404040] text-white'
                : 'border-[#d4d4d4] bg-white text-[#737373]'
            "
            :title="node.id"
            :aria-pressed="modelValue.emphasizedNodes.has(node.id)"
            @click="toggleNode(node.id)"
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
        @click="emit('sna-plot-close-modal')"
      >
        Annulla
      </BaseClickButton>
      <BaseClickButton
        class="flex-1 px-3 py-1 text-[9pt]"
        button-variant="solid"
        @click="emit('sna-plot-regenerate-emphasis')"
      >
        Mostra grafico
      </BaseClickButton>
    </div>
  </div>
</template>
