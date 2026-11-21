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
    <g transform="translate(48 10)" class="text-ink">
      <circle r="9" />
      <g transform="scale(1.25)" fill="currentColor" stroke="none">
        <circle cy="-2.5" r="2.5" />
        <path d="M-5 4.5a5 4 0 0 1 10 0Z" />
      </g>
    </g>
    <g transform="translate(30 38)" class="text-ink">
      <circle r="9" />
      <g transform="scale(1.25)" fill="currentColor" stroke="none">
        <circle cy="-2.5" r="2.5" />
        <path d="M-5 4.5a5 4 0 0 1 10 0Z" />
      </g>
    </g>
    <g transform="translate(66 38)" class="text-ink">
      <circle r="9" />
      <g transform="scale(1.25)" fill="currentColor" stroke="none">
        <circle cy="-2.5" r="2.5" />
        <path d="M-5 4.5a5 4 0 0 1 10 0Z" />
      </g>
    </g>
    <path class="text-accent" d="M34.87 30.43 43.13 17.57 m-5.54 2.65 5.54-2.65.16 6.14" />
    <g class="text-reject">
      <path d="M52.87 17.57 61.13 30.43" stroke-dasharray="2.5 3" />
      <path d="m55.59 27.78 5.54 2.65.16-6.14" />
    </g>
  </svg>
</template>
