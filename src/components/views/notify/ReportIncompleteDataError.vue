<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
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
  <BaseNotify to="/group" replace>
    <template #title> Dati incompleti </template>
    <template #text>
      Completa l'inserimento dei dati del gruppo prima di generare il report.
    </template>
    <template #buttonLabel> Torna all'app </template>
  </BaseNotify>
</template>
