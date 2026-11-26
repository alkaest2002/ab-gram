<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const sizes = {
  sm: "size-5",
  md: "size-10",
  lg: "size-12",
};

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div role="status" class="inline-flex flex-col items-center gap-4 text-center">
    <span
      aria-hidden="true"
      :class="sizes[size]"
      class="shrink-0 animate-spin rounded-full bg-[conic-gradient(transparent,#555)] mask-[radial-gradient(closest-side,transparent_calc(100%-2px),black_calc(100%-2px))] motion-reduce:[animation-duration:2s]"
    ></span>
    <slot><span class="sr-only">Caricamento in corso…</span></slot>
  </div>
</template>
