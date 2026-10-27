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
        <template #title> Dati incompleti </template>
        <template #text>
            Completa l'inserimento dei dati nel sociogramma prima di generare
            il report.
        </template>
        <template #buttonLabel> Torna al sociogramma </template>
    </BaseNotify>
</template>
