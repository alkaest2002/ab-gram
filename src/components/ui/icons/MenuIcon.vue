<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
  size: { type: String, default: "size-5" },
  fillClass: { type: String, default: "fill-none" },
  strokeClass: { type: String, default: "stroke-current" },
  strokeWidth: { type: Number, default: 1.5 },
  open: { type: Boolean, default: false },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <svg
    :class="[size, strokeClass, fillClass]"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  >
    <path v-if="open" d="M6 6l12 12M18 6L6 18" />
    <path v-else d="M4 7h16M4 12h16M4 17h16" />
  </svg>
</template>
