<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------
defineProps({
    eyebrow: { type: String },
    title: { type: String, required: true },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <header class="space-y-2.5">
        <p class="eyebrow" v-if="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p><slot /></p>
    </header>
</template>
