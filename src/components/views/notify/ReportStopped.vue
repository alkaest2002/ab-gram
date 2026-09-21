<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";

// --- Composables --------

// --- Props --------------
defineProps({
    /** Where the button links to; passed down by the router. */
    to: { type: [String, Object], default: null },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BaseNotify :to="to">
        <template #title>Generazione interrotta</template>
        <template>
            I dati inseriti non sono andati persi. Puoi tornare al sociogramma e
            riprovare quando vuoi
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
