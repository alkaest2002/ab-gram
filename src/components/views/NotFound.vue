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
    <BaseNotify to="/">
        <template #title> Pagina non trovata </template>
        <template #text>
            L'indirizzo richiesto non esiste o è stato spostato.
        </template>
        <template #buttonLabel> Torna alla home </template>
    </BaseNotify>
</template>
