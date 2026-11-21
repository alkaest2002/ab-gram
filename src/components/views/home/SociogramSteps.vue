<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const steps = [
  {
    title: "Gruppo",
    text: "Inserisci i membri del gruppo che intendi studiare.",
  },
  {
    title: "Scelte e rifiuti",
    text: "Indica le scelte e i rifiuti di tutti i membri del gruppo.",
  },
  {
    title: "Report",
    text: "AB-Gram calcola, in automatico, indici grafici.",
  },
  {
    title: "Intervento",
    text: "Usa il report per progettare attività educative mirate.",
    followUp: true,
  },
];

const avatarPositions = [
  { x: 48, y: 10 },
  { x: 30, y: 38 },
  { x: 66, y: 38 },
];

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
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
          all’intervento{{ " " }}
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
        class="relative flex flex-col items-center rounded-lg border border-line bg-white px-6 pt-0 pb-3"
      >
        <!-- Mini graph: the step as the sociogram would draw it. -->
        <svg
          class="mt-6 h-auto w-36 max-w-full sm:w-32 lg:w-40"
          viewBox="0 0 96 48"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <g v-if="i < 2 || step.followUp" class="text-ink">
            <g v-for="{ x, y } in avatarPositions" :key="x" :transform="`translate(${x} ${y})`">
              <circle r="9" />
              <g transform="scale(1.25)" fill="currentColor" stroke="none">
                <circle cy="-2.5" r="2.5" />
                <path d="M-5 4.5a5 4 0 0 1 10 0Z" />
              </g>
            </g>
          </g>

          <!-- 2 · Scelte e rifiuti: a choice and a rejection -->
          <g v-if="i === 1">
            <g class="text-accent">
              <path d="M34.87 30.43 43.13 17.57" />
              <path d="m37.59 20.22 5.54-2.65.16 6.14" />
            </g>
            <g class="text-reject">
              <!-- Rejections are drawn dashed, matching the report's
                                 `edge-reject` convention; only the arrowhead stays solid. -->
              <path d="M52.87 17.57 61.13 30.43" stroke-dasharray="2.5 3" />
              <path d="m55.59 27.78 5.54 2.65.16-6.14" />
            </g>
          </g>

          <!-- Report page outline adapted from Lucide's file-chart-column. -->
          <g v-else-if="i === 2" stroke-width="0.7">
            <g
              v-for="(color, page) in ['text-accent', 'text-reject']"
              :key="color"
              :transform="`translate(${4 + page * 40} 0) scale(2)`"
            >
              <g class="text-ink">
                <path
                  d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
                />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
              </g>
              <path
                :class="color"
                :d="page === 0 ? 'M8 18v-1 M12 18v-6 M16 18v-3' : 'M8 18v-5 M12 18v-2 M16 18v-4'"
              />
            </g>
          </g>
          <g v-else-if="step.followUp" class="text-accent">
            <path d="M34.87 30.43 43.13 17.57M52.87 17.57 61.13 30.43M39 38h18" />
          </g>
        </svg>

        <h3 class="mt-6 text-2xl font-semibold text-ink">{{ i + 1 }}. {{ step.title }}</h3>
        <p class="max-w-[28ch] text-sm">
          {{ step.text }}
        </p>
      </li>
    </ol>
  </div>
</template>
