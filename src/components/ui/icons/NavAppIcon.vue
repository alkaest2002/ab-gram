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
    class="shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2a3 3 0 1 0 0 6a3 3 0 1 0 0-6" />
    <path d="M6 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6" />
    <path d="M18 16a3 3 0 1 0 0 6a3 3 0 1 0 0-6" />
    <path d="M8.59 13.51l6.83 3.98" />
    <path d="M15.41 6.51l-6.82 3.98" />
  </svg>
</template>
