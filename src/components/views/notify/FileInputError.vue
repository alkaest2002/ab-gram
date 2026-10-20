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
    <BaseNotify to="/sociogram">
        <template #title> Il file non può essere caricato </template>
        <template #text>
            Controlla che il dati archiviati siano validi, poi riprova.
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
