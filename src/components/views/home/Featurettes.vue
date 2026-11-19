<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import PiggyIcon from "@/components/ui/icons/PiggyIcon.vue";
import SmileyIcon from "@/components/ui/icons/SmileyIcon.vue";
import ShieldIcon from "@/components/ui/icons/ShieldIcon.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const features = [
  {
    id: "free",
    title: "App gratuita",
    text: "Gratis per sempre, nessun costo nascosto",
  },
  {
    id: "easy",
    title: "App semplice",
    text: "Niente da installare, né da configurare",
  },
  {
    id: "privacy",
    title: "App attenta alla privacy",
    text: "I tuoi dati restano sul tuo dispositivo",
  },
];

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div class="space-y-8 text-center sm:space-y-10">
    <header class="mx-auto space-y-6">
      <p class="eyebrow">Perché AB-Gram</p>
      <h2
        class="mx-auto max-w-[22ch] font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-ink"
      >
        Un breve
        <span class="block"><em class="text-accent">manifesto</em> ideologico</span>
      </h2>
    </header>

    <ul class="mx-auto w-full">
      <li
        v-for="feature in features"
        :key="feature.id"
        class="flex flex-col items-center gap-3 border-t border-line py-8 last:border-b sm:py-10"
      >
        <span class="text-black" aria-hidden="true">
          <PiggyIcon v-if="feature.id === 'free'" size="size-18" :stroke-width="1" />
          <SmileyIcon v-else-if="feature.id === 'easy'" size="size-18" :stroke-width="1" />
          <ShieldIcon v-else-if="feature.id === 'privacy'" size="size-18" :stroke-width="1" />
        </span>

        <h3 class="tracking-[-0.01em] text-xl text-black">
          {{ feature.title }}
        </h3>

        <p class="max-w-[52ch]">{{ feature.text }}</p>
      </li>
    </ul>
  </div>
</template>
