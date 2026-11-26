<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
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
    <template #icon>
      <svg
        class="size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </template>
    Crea progetto
  </BaseClickButton>
</template>
