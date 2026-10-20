<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
    size: { type: String, default: "size-5" },
    strokeWidth: { type: Number, default: 1.5 },
    strokeClass: { type: String, default: "stroke-current" },
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
        xmlns="http://www.w3.org/2000/svg"
        :class="[size, strokeClass]"
        class="shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M15 10V9" />
        <path
            d="M7.084 14.302a5.12 5.12 0 009.833 0 .24.24 0 00-.235-.302H7.32a.24.24 0 00-.235.302"
        />
        <path d="M9 10V9" />
        <circle cx="12" cy="12" r="10" />
    </svg>
</template>
