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

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the emphasis controls.
  regenerating: { type: Boolean, default: false },
  // Per-node metadata for the clickable node circles.
  nodeInfo: { type: Array, default: () => [] },
  // Accent color used by the plot, drives the node circle previews.
  accentColor: { type: String, default: "" },
  // Current emphasis state, owned by the parent via useNodeEmphasis.
  activeFilter: { type: String, default: "all-on" },
  emphasizedNodes: { type: Set, default: () => new Set() },
  minInDegree: { type: Number, default: 1 },
});

// --- Emits --------------
const emit = defineEmits(["apply-filter", "toggle-node", "update:minInDegree", "close"]);

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

        <!-- Toggle presets + min in-degree — all on one row ──────── -->
        <div class="flex flex-wrap items-center gap-2">
          <BaseClickButton
            class="px-3 py-1 text-[9pt]"
            :button-variant="activeFilter === 'all-on' ? 'solid' : 'outline'"
            @click="emit('apply-filter', 'all-on')"
          >
            Tutti visibili
          </BaseClickButton>
          <BaseClickButton
            class="px-3 py-1 text-[9pt]"
            :button-variant="activeFilter === 'all-off' ? 'solid' : 'outline'"
            @click="emit('apply-filter', 'all-off')"
          >
            Tutti nascosti
          </BaseClickButton>
          <BaseClickButton
            class="px-3 py-1 text-[9pt]"
            :button-variant="activeFilter === 'min-in-degree' ? 'solid' : 'outline'"
            @click="emit('apply-filter', 'min-in-degree')"
          >
            Archi entranti ≥
          </BaseClickButton>
          <input
            v-model.number="minInDegree"
            type="number"
            min="0"
            :max="maxInDegree"
            step="1"
            class="w-14 rounded border border-line bg-canvas px-2 py-1 text-[9pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
            @focus="emit('apply-filter', 'min-in-degree')"
          />
        </div>

        <!-- (c) Clickable node circles ───────────────────────────── -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="node in nodeInfo"
            :key="node.id"
            type="button"
            class="inline-flex size-6 items-center justify-center rounded-full border border-transparent text-[6.5pt] font-semibold leading-none text-white transition-all hover:opacity-80"
            :class="
              emphasizedNodes.has(node.id) ? '' : 'bg-white! text-[#737373]! border-[#d4d4d4]!'
            "
            :style="{ backgroundColor: accentColor }"
            :title="node.id"
            :aria-pressed="emphasizedNodes.has(node.id)"
            @click="emit('toggle-node', node.id)"
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
        @click="emit('close')"
      >
        Annulla
      </BaseClickButton>
      <BaseClickButton
        class="flex-1 px-3 py-1 text-[9pt]"
        button-variant="solid"
        @click="emit('close')"
      >
        Mostra grafico
      </BaseClickButton>
    </div>
  </div>
</template>
