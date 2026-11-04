<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import BaseNotify from "@/components/views/notify/BaseNotify.vue";

//   -- From composables.
import { useDownload } from "@/composables/useDownload";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------
const { download } = useDownload();

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function downloadErrors(errors) {
  download(errors.join("\n"), "sociogram-validation-errors", "text/plain");
}
</script>

<template>
  <BaseNotify to="/docs">
    <template #title> Errore di validazione </template>
    <template #text="{ notifyData }">
      Controlla che i dati rispettino i requisiti e i vincoli richiesti, poi riprova.
      <button
        v-if="notifyData && notifyData.length"
        type="button"
        class="mt-3 block text-accent underline underline-offset-4 hover:text-accent/80"
        @click="downloadErrors(notifyData)"
      >
        Scarica l'elenco degli errori
      </button>
    </template>
    <template #buttonLabel> Consulta la documentazione </template>
  </BaseNotify>
</template>
