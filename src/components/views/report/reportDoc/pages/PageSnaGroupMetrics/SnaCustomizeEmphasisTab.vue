<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed, reactive } from "vue";

//   -- From composables.
import { cloneEmphasisFilter, resolveDimmedNodes } from "@/composables/report/useNodeEmphasis";

//   -- From components.
import BaseClickButton from "@/components/ui/BaseClickButton.vue";
import BaseToggle from "@/components/ui/BaseToggle.vue";

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the emphasis controls.
  snaPlotIsRegenerating: { type: Boolean, default: false },
  // Per-node metadata for the clickable node circles.
  snaPlotNodeInfo: { type: Array, default: () => [] },
  // Current emphasis filter, owned by the parent.
  snaPlotEmphasisConfig: {
    type: Object,
    default: () => ({ typeOfFilter: "all-on", filterValue: null }),
  },
});

// --- Emits --------------
const emit = defineEmits(["sna-plot-regenerate-emphasis", "sna-plot-close-modal"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Local draft staged while the dialog is open. It is initialized from the
// committed config on mount (the modal remounts this tab on each open) and only
// committed to the parent on submit.
const draft = reactive(cloneEmphasisFilter(props.snaPlotEmphasisConfig));

// --- Composables --------

// --- Computed -----------
// Nodes to dim, derived from the current draft and node metadata.
const dimmedNodes = computed(() => resolveDimmedNodes(props.snaPlotNodeInfo, draft));

// Maximum in-degree across all nodes, used as the upper bound for the input.
const maxInDegree = computed(() =>
  props.snaPlotNodeInfo.reduce((max, n) => Math.max(max, n.inDegree), 0),
);

// The minimum in-degree threshold. Reading falls back to 0 when the current
// draft has no numeric value; writing switches the draft to `"minInDegree"`.
const minInDegree = computed({
  get: () => (typeof draft.filterValue === "number" ? draft.filterValue : 0),
  set: (value) => {
    draft.typeOfFilter = "minInDegree";
    draft.filterValue = Math.max(0, Math.floor(Number(value) || 0));
  },
});

// v-model: whether the "min in-degree" threshold filter is active. Turning it
// off falls back to showing every node.
const minInDegreeActive = computed({
  get: () => draft.typeOfFilter === "minInDegree",
  set: (value) => {
    draft.typeOfFilter = value ? "minInDegree" : "all-on";
    draft.filterValue = value ? minInDegree.value : null;
  },
});

// v-model: true when every node is emphasized. Toggling applies the matching
// all-on/all-off preset.
const allVisible = computed({
  get: () =>
    props.snaPlotNodeInfo.length > 0 &&
    dimmedNodes.value.size === 0 &&
    draft.typeOfFilter !== "minInDegree",
  set: (value) => {
    draft.typeOfFilter = value ? "all-on" : "all-off";
    draft.filterValue = null;
  },
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function toggleNode(id) {
  const nextDimmed = new Set(dimmedNodes.value);
  if (nextDimmed.has(id)) {
    nextDimmed.delete(id);
  } else {
    nextDimmed.add(id);
  }

  draft.typeOfFilter = "custom";
  draft.filterValue = [...nextDimmed];
}

function submit() {
  emit("sna-plot-regenerate-emphasis", cloneEmphasisFilter(draft));
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
              !dimmedNodes.has(node.id)
                ? 'border-transparent bg-[#404040] text-white'
                : 'border-[#d4d4d4] bg-white text-[#737373]'
            "
            :title="node.id"
            :aria-pressed="!dimmedNodes.has(node.id)"
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
      <BaseClickButton class="flex-1 px-3 py-1 text-[9pt]" button-variant="solid" @click="submit">
        Mostra grafico
      </BaseClickButton>
    </div>
  </div>
</template>
