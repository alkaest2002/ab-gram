<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
    // Ratio value in [0, 1].
    value: { type: Number, default: 0 },
    // Accent color for the filled portion.
    accentColor: { type: String, default: "" },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
const percent = computed(() =>
    Math.max(0, Math.min(100, Number(props.value) * 100)),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="mt-[0.75mm] h-0.5 w-full overflow-hidden rounded-full bg-line">
        <div
            class="h-full rounded-full"
            :style="{ width: `${percent}%`, backgroundColor: accentColor }"
        ></div>
    </div>
</template>
