<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { useId } from "vue";

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
const markerId = useId();

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
    <defs>
      <marker
        :id="`${markerId}-choice`"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="4.5"
        markerHeight="4.5"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-accent)" stroke="none" />
      </marker>
      <marker
        :id="`${markerId}-reject`"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="4.5"
        markerHeight="4.5"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-reject)" stroke="none" />
      </marker>
    </defs>
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
    <path
      d="M35.25 29.84 41.8 19.64"
      stroke="var(--color-accent)"
      stroke-linecap="butt"
      :marker-end="`url(#${markerId}-choice)`"
    />
    <path
      d="M53.25 18.16 59.8 28.36"
      stroke="var(--color-reject)"
      stroke-dasharray="2.5 3"
      stroke-linecap="butt"
      :marker-end="`url(#${markerId}-reject)`"
    />
  </svg>
</template>
