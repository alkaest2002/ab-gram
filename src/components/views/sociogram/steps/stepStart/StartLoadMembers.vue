<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import BaseClickButton from "@/components/ui/BaseClickButton.vue";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-start-load-members"]);

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
  <div class="space-y-1">
    <p class="eyebrow">Nuovo progetto</p>
    <h3>Carica una nuova lista di nomi</h3>
    <p class="text-sm">Crea un nuovo progetto a partire da una lista di nomi.</p>
  </div>
  <BaseClickButton button-variant="solid" @click="emit('sociogram-start-load-members')">
    Crea progetto
  </BaseClickButton>
</template>
