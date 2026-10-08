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
    <svg
        viewBox="0 0 64 64"
        :class="size"
        class="shrink-0"
        aria-hidden="true"
    >
        <path
            d="M32 8 59 55 H5 Z"
            :stroke-width="strokeWidth"
            class="fill-none stroke-reject"
            stroke-linejoin="round"
        />
        <path
            d="M32 27v14"
            :stroke-width="strokeWidth"
            class="stroke-reject"
            stroke-linecap="round"
        />
        <circle cx="32" cy="49" r="1.6" class="fill-reject" />
    </svg>
</template>
