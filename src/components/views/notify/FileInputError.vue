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
    <BaseNotify to="/sociogram" replace>
        <template #title> Il file non può essere caricato </template>
        <template #text>
            Controlla che i dati archiviati siano validi, poi riprova.
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
