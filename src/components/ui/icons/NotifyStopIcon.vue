<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------
defineProps({
    size: { type: String, default: "size-5" },
    strokeWidth: { type: Number, default: 1.5 },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <svg viewBox="0 0 64 64" :class="size" class="shrink-0" aria-hidden="true">
        <circle
            cx="32"
            cy="32"
            r="23"
            :stroke-width="strokeWidth"
            class="fill-none stroke-muted"
        />
        <line
            x1="16"
            y1="16"
            x2="48"
            y2="48"
            :stroke-width="strokeWidth"
            class="stroke-muted"
            stroke-linecap="round"
        />
    </svg>
</template>
