<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/views/notify/BaseNotify.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BaseNotify to="/">
        <template #title> Pagina non trovata </template>
        <template #text>
            L'indirizzo richiesto non esiste o è stato spostato.
        </template>
        <template #buttonLabel> Torna alla home </template>
    </BaseNotify>
</template>
