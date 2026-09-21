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
        <template #title> Errore di validazione </template>
        <template #text>
            Controlla che i dati rispettino i requisiti e i vincoli richiesti,
            poi riprova
        </template>
        <template #buttonLabel> Consulta la documentazione </template>
    </BaseNotify>
</template>
