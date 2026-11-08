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
  /** Whether the toggle is on. Bound with `v-model`. */
  modelValue: { type: Boolean, default: false },
  /** Where the label sits relative to the switch. */
  labelPosition: {
    type: String,
    default: "right",
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
  },
  /** Whether the toggle is disabled (non-interactive and dimmed). */
  disabled: { type: Boolean, default: false },
  /** Switch size. */
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md"].includes(value),
  },
});

// --- Emits --------------
const emit = defineEmits(["update:modelValue"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Layout classes written out in full so Tailwind sees them.
const layoutClasses = {
  top: "flex-col-reverse",
  bottom: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

// Track/thumb sizes, written out in full so Tailwind sees them.
const sizeClasses = {
  sm: "h-4 w-7 after:size-3",
  md: "h-5 w-9 after:size-4",
};

// --- Composables --------

// --- Computed -----------
// v-model: read the state from `modelValue` and write it back by emitting
// `update:modelValue`, so the parent stays the single source of truth.
const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <label
    class="inline-flex items-center gap-2"
    :class="[
      layoutClasses[labelPosition],
      disabled ? 'cursor-not-allowed! opacity-50' : 'cursor-pointer',
    ]"
  >
    <input v-model="checked" type="checkbox" class="peer sr-only" :disabled="disabled" />

    <span
      aria-hidden="true"
      class="relative inline-flex shrink-0 rounded-full bg-line transition-colors after:absolute after:inset-s-0.5 after:top-0.5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-ink peer-checked:after:translate-x-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent rtl:peer-checked:after:-translate-x-full"
      :class="sizeClasses[size]"
    ></span>

    <span class="select-none text-sm font-medium text-ink">
      <slot />
    </span>
  </label>
</template>
