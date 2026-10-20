<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
    open: { type: Boolean, default: false },
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
        :class="[size, strokeClass]"
        viewBox="0 0 24 24"
        fill="none"
        :stroke-width="strokeWidth"
        aria-hidden="true"
    >
        <path v-if="open" d="M6 6l12 12M18 6L6 18" />
        <path v-else d="M4 7h16M4 12h16M4 17h16" />
    </svg>
</template>
