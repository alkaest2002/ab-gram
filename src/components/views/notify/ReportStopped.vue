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
        <template #title>Generazione interrotta</template>
        <template>
            I dati inseriti non sono andati persi. Puoi tornare al sociogramma e
            riprovare quando vuoi
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
