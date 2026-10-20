<script setup>
// --- Imports ------------
//   -- From components
import BaseNotify from "@/components/views/notify/BaseNotify.vue";

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
    <BaseNotify to="/docs">
        <template #title> Errore di validazione </template>
        <template #text>
            Controlla che i dati rispettino i requisiti e i vincoli richiesti,
            poi riprova.
        </template>
        <template #buttonLabel> Consulta la documentazione </template>
    </BaseNotify>
</template>
