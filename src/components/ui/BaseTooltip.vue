<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
    /** Text shown inside the tooltip. */
    label: { type: String, required: true },
    /** Which side of the trigger the tooltip appears on. */
    placement: {
        type: String,
        default: "top",
        validator: (value) => ["top", "bottom"].includes(value),
    },
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
    <span class="group relative inline-flex">
        <slot />
        <span
            aria-hidden="true"
            class="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 font-mono text-[0.6rem] font-medium text-canvas opacity-0 shadow-md transition-opacity duration-150 group-hover:delay-600 group-hover:opacity-100 group-focus-within:opacity-100"
            :class="placement === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5'"
        >
            {{ label }}
        </span>
    </span>
</template>
