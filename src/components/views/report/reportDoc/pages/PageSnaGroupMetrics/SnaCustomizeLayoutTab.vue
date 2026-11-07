<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
  // Whether a regeneration is running: disables the inputs and swaps the
  // regenerate button for an interrupt button.
  regenerating: { type: Boolean, default: false },
  error: { type: String, default: "" },
  // ForceAtlas2 settings, bound two-way from the parent container.
  scalingRatio: { type: Number, default: 0.6 },
  gravity: { type: Number, default: 1.1 },
});

// --- Emits --------------
const emit = defineEmits(["update:scalingRatio", "update:gravity", "confirm", "stop", "close"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read each setting from its prop and write it back by emitting
// `update:*`, so the parent container stays the single source of truth.
const scalingRatio = computed({
  get: () => props.scalingRatio,
  set: (value) => emit("update:scalingRatio", Number(value) || 0),
});
const gravity = computed({
  get: () => props.gravity,
  set: (value) => emit("update:gravity", Number(value) || 0),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <form
    id="sna-tab-panel-layout"
    role="tabpanel"
    aria-labelledby="sna-tab-button-layout"
    class="mt-5 flex min-h-0 flex-1 flex-col"
    @submit.prevent="emit('confirm')"
  >
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="flex items-end gap-3">
        <label class="flex-1">
          <span class="text-[9pt] text-muted">Scaling ratio</span>
          <input
            v-model.number="scalingRatio"
            type="number"
            step="0.1"
            min="0"
            :disabled="regenerating"
            class="mt-1 w-full rounded border border-line bg-canvas px-2 py-1 text-[9pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
          />
        </label>
        <label class="flex-1">
          <span class="text-[9pt] text-muted">Gravity</span>
          <input
            v-model.number="gravity"
            type="number"
            step="0.1"
            min="0"
            :disabled="regenerating"
            class="mt-1 w-full rounded border border-line bg-canvas px-2 py-1 text-[9pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
          />
        </label>
      </div>

      <p v-if="error" class="mt-2 text-[8pt] text-reject">{{ error }}</p>
    </div>

    <div class="flex shrink-0 gap-3 pt-5">
      <button
        v-if="regenerating"
        type="button"
        class="flex-1 rounded py-2 text-[9pt] font-medium bg-reject text-white transition-opacity hover:opacity-90"
        @click="emit('stop')"
      >
        Interrompi
      </button>
      <template v-else>
        <button
          type="submit"
          class="flex-1 rounded py-2 text-[9pt] font-medium bg-ink text-white transition-opacity hover:opacity-90"
        >
          Rigenera grafico
        </button>
        <button
          type="button"
          class="flex-1 rounded py-2 text-[9pt] font-medium text-ink border border-line transition-colors hover:bg-line"
          @click="emit('close')"
        >
          Annulla
        </button>
      </template>
    </div>
  </form>
</template>
