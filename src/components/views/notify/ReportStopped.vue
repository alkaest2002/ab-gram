<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

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
        <template #title> Generazione interrotta </template>
        <template #text>
            I dati inseriti non sono andati persi. Puoi tornare al sociogramma e
            riprovare quando vuoi.
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
