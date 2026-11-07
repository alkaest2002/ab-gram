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
  type: { type: String, default: "button" },
  buttonVariant: {
    type: String,
    default: "solid",
    validator: (value) => ["solid", "outline", "red"].includes(value),
  },
});

// --- Emits --------------
const emit = defineEmits(["click"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Classes written out in full: Tailwind doesn't see ones built by interpolation.
const variantClasses = {
  solid: "btn-solid",
  outline: "btn-outline",
  red: "btn-red",
};

// --- Composables --------

// --- Computed -----------
const classes = computed(() => ["btn", variantClasses[props.buttonVariant]]);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <button :type="type" :class="classes" @click="emit('click', $event)">
    <slot name="icon" />
    <slot />
  </button>
</template>
