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
    viewBox="0 0 96 48"
    fill="none"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g class="text-ink">
      <path d="M41 9h-7a3 3 0 0 0-3 3v28a3 3 0 0 0 3 3h28a3 3 0 0 0 3-3V12a3 3 0 0 0-3-3h-7" />
      <rect x="41" y="5" width="14" height="8" rx="3" />
      <path d="M47 21h9m-9 6h9m-9 6h6" />
    </g>
    <path class="text-accent" d="m40 21 1.5 1.5 3-3m-4.5 7.5 1.5 1.5 3-3m-4.5 7.5 1.5 1.5 3-3" />
  </svg>
</template>
