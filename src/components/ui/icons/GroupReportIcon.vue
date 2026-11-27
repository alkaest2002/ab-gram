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
  <!-- Page outline adapted from Lucide’s file-chart-column. -->
  <svg
    :class="[size, strokeClass, fillClass]"
    viewBox="0 0 96 48"
    fill="none"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g transform="translate(4 0) scale(2)" :stroke-width="strokeWidth / 2">
      <path
        class="text-ink"
        d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z M14 2v5a1 1 0 0 0 1 1h5"
      />
      <path class="text-accent" d="M8 18v-1 M12 18v-6 M16 18v-3" />
    </g>
    <g transform="translate(44 0) scale(2)" :stroke-width="strokeWidth / 2">
      <path
        class="text-ink"
        d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z M14 2v5a1 1 0 0 0 1 1h5"
      />
      <path class="text-reject" d="M8 18v-5 M12 18v-2 M16 18v-4" />
    </g>
  </svg>
</template>
