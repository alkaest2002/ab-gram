<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
import SociogramChoicesIcon from "../../ui/icons/SociogramChoicesIcon.vue";
import SociogramGroupIcon from "../../ui/icons/SociogramGroupIcon.vue";
import SociogramInterventionIcon from "../../ui/icons/SociogramInterventionIcon.vue";
import SociogramReportIcon from "../../ui/icons/SociogramReportIcon.vue";

const steps = [
  {
    title: "Gruppo",
    text: "Inserisci i membri del gruppo che intendi studiare.",
    icon: SociogramGroupIcon,
  },
  {
    title: "Scelte e rifiuti",
    text: "Indica le scelte e i rifiuti di tutti i membri del gruppo.",
    icon: SociogramChoicesIcon,
  },
  {
    title: "Report",
    text: "AB-Gram calcola, in automatico, indici grafici.",
    icon: SociogramReportIcon,
  },
  {
    title: "Intervento",
    text: "Usa il report per progettare attività educative mirate.",
    icon: SociogramInterventionIcon,
  },
];
</script>

<template>
  <div class="space-y-8 sm:space-y-10">
    <header class="mx-auto space-y-6">
      <p class="eyebrow">4 passaggi</p>
      <h2
        class="mx-auto max-w-[22ch] font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-bold tracking-[-0.035em] text-balance text-ink"
      >
        Dal gruppo
        <span class="block">
          <span></span>all’intervento{{ " " }}
          <span
            class="text-accent italic [text-shadow:0_0_0.35em_color-mix(in_oklab,currentColor_28%,transparent)]"
            >educativo</span
          >
        </span>
      </h2>
    </header>

    <ol class="mx-auto grid list-none grid-cols-1 gap-x-8 gap-y-8 p-0 pt-12 sm:grid-cols-2">
      <li
        v-for="(step, i) in steps"
        :key="step.title"
        class="relative flex flex-col items-center border border-slate-200 rounded-lg bg-slate-100 px-6 pt-3 pb-6"
      >
        <component
          :is="step.icon"
          size="mt-6 h-auto w-36 max-w-full sm:w-32 lg:w-40"
          :stroke-width="1.4"
        />

        <h3 class="mt-6 text-2xl font-semibold text-ink">{{ i + 1 }}. {{ step.title }}</h3>
        <p class="max-w-[28ch] text-sm">
          {{ step.text }}
        </p>
      </li>
    </ol>
  </div>
</template>
