<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
import { formatValue } from "@/analysis/common/statsHelpers";

defineProps({
  card: { type: Object, required: true },
});
</script>

<template>
  <div
    class="grid grid-cols-[minmax(0,1fr)_17mm_36mm_max-content] items-center gap-[3mm] min-h-[6.6mm] border-b border-line"
  >
    <div class="flex flex-1 items-center gap-[1.5mm] min-w-0">
      <span
        class="inline-flex h-[4.6mm] min-w-[6mm] shrink-0 items-center justify-center px-[1mm] border border-ink rounded font-mono text-[7pt] font-semibold leading-none text-ink"
        >{{ card.id }}</span
      >
      <span class="min-w-0 truncate text-[9pt] text-ink">{{ card.name }}</span>
    </div>

    <span
      class="flex items-center justify-center rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
    >
      <span class="font-mono text-[8pt] leading-none"
        >{{ formatValue(card.bonus) }}/{{ formatValue(card.malus) }}</span
      >
    </span>

    <span class="leading-[1.15] font-medium text-[9pt]" :class="card.statusClass">
      {{ card.statusLabel }}
    </span>

    <div class="grid grid-flow-col auto-cols-[6mm] place-items-center">
      <span
        v-for="metric in card.metrics"
        :key="metric.label"
        class="inline-flex items-center"
        role="img"
        :aria-label="`${metric.label}: ${metric.active ? 'nei primi tre' : 'non nei primi tre'}`"
      >
        <span
          class="h-[2.2mm] w-[2.2mm] shrink-0 rounded-full"
          :class="metric.active ? 'bg-accent' : 'bg-gray-300'"
        ></span>
      </span>
    </div>
  </div>
</template>
