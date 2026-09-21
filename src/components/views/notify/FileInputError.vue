<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";

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
    <BaseNotify to="/sociogram">
        <template #title> Il file non può essere caricato </template>
        <template #text>
            Controlla che il file-archivio sia un sociogramma valido, poi
            riprova.
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
