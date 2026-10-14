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
    strokeColor: { type: String, default: "currentColor" },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <svg
        :class="size"
        class="shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="strokeColor"
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
