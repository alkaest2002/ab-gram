<script setup>
// --- Imports ------------

// --- Props --------------

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
    <header class="space-y-2.5">
        <p class="eyebrow" v-if="$slots.eyebrow"><slot name="eyebrow" /></p>
        <h2><slot name="title" /></h2>
        <p v-if="$slots.default"><slot /></p>
    </header>
</template>
