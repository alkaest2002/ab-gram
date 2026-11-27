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
    <template #title> Generazione interrotta </template>
    <template #text>
      I dati inseriti non sono andati persi. Puoi tornare all'app e riprovare quando vuoi.
    </template>
    <template #buttonLabel> Torna all'app </template>
  </BaseNotify>
</template>
