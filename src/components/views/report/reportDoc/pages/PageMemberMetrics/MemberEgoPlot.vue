<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
    // Injected SVG markup for the member's ego network.
    svg: { type: String, default: "" },
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
    <div class="top-band flex flex-col">
        <div class="ego-svg min-h-0 flex-1 overflow-hidden" v-html="svg"></div>
    </div>
</template>

<style scoped>
/* Top band: 65% of the content cell. */
.top-band {
    flex: 0 0 65%;
    min-height: 0;
}

/* The SVG is injected via v-html, so it has no scoped attribute; :deep reaches
   it from the .ego-svg wrapper and lets it fill the band. */
.ego-svg :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
