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
    title: "app gratuita",
    text: "Open source, licenza MIT, gratis per sempre",
  },
  {
    id: "easy",
    title: "app semplice",
    text: "Nessun account, niente da installare o configurare",
  },
  {
    id: "privacy",
    title: "app attenta alla privacy",
    text: "I dati restano memorizzati nel tuo dispositivo",
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
        <span class="block">
          <em
            class="text-accent [text-shadow:0_0_0.35em_color-mix(in_oklab,currentColor_28%,transparent)]"
            >manifesto</em
          >
          ideologico
        </span>
      </h2>
    </header>

    <ul class="mx-auto w-full">
      <li v-for="feature in features" :key="feature.id" class="flex flex-col items-center py-6">
        <span class="text-black" aria-hidden="true">
          <PiggyIcon
            v-if="feature.id === 'free'"
            size="size-18"
            :stroke-width="1"
            class="text-ink"
          />
          <SmileyIcon
            v-else-if="feature.id === 'easy'"
            size="size-18"
            :stroke-width="1"
            class="text-ink"
          />
          <ShieldIcon
            v-else-if="feature.id === 'privacy'"
            size="size-18"
            :stroke-width="1"
            class="text-ink"
          />
        </span>

        <h3 class="tracking-[-0.01em] text-xl text-ink">
          {{ feature.title }}
        </h3>

        <p class="max-w-[52ch]">{{ feature.text }}</p>
      </li>
    </ul>
  </div>
</template>
