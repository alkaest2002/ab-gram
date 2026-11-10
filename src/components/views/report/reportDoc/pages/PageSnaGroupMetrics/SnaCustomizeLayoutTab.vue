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
  // Whether a regeneration is running: disables the inputs while the plot is
  // being rebuilt off the main thread.
  regenerating: { type: Boolean, default: false },
  error: { type: String, default: "" },
  // Current layout customization, owned by the parent and bound via v-model.
  modelValue: {
    type: Object,
    default: () => ({ scalingRatio: 0.6, gravity: 1.1 }),
  },
});

// --- Emits --------------
const emit = defineEmits([
  "update:modelValue",
  "sna-plot-regenerate-layout",
  "sna-plot-close-modal",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read each setting from the model and emit a new model on change.
const scalingRatio = computed({
  get: () => props.modelValue.scalingRatio,
  set: (value) =>
    emit("update:modelValue", { ...props.modelValue, scalingRatio: Number(value) || 0 }),
});
const gravity = computed({
  get: () => props.modelValue.gravity,
  set: (value) => emit("update:modelValue", { ...props.modelValue, gravity: Number(value) || 0 }),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const handleClose = () => {
  emit("sna-plot-close-modal");
};
</script>

<template>
  <form
    id="sna-tab-panel-layout"
    role="tabpanel"
    aria-labelledby="sna-tab-button-layout"
    class="mt-5 flex min-h-0 flex-1 flex-col"
    @submit.prevent="emit('sna-plot-regenerate-layout')"
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
            class="mt-1 w-full rounded border border-line bg-canvas px-2 py-1 text-[9pt] text-ink outline-none transition-colors focus:border-ink disabled:opacity-50"
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
            class="mt-1 w-full rounded border border-line bg-canvas px-2 py-1 text-[9pt] text-ink outline-none transition-colors focus:border-ink disabled:opacity-50"
          />
        </label>
      </div>
      <p v-if="error" class="mt-2 text-[8pt] text-reject">{{ error }}</p>
    </div>

    <div class="flex shrink-0 gap-3 pt-5">
      <BaseClickButton
        class="flex-1 px-3 py-1 text-[9pt]"
        buttonVariant="outline"
        @click="handleClose"
      >
        Annulla
      </BaseClickButton>
      <BaseClickButton class="flex-1 px-3 py-1 text-[9pt]" type="submit" buttonVariant="solid">
        Rigenera grafico
      </BaseClickButton>
    </div>
  </form>
</template>
