<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import BaseClickButton from "@/components/ui/BaseClickButton.vue";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["stop-generating-report"]);

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
  <div role="status" class="flex w-full max-w-xl flex-col items-center gap-6 text-center">
    <!-- Spinner: a single thin ring with a subtle accent sweep. -->
    <div
      class="size-12 shrink-0 animate-spin rounded-full bg-[conic-gradient(transparent,var(--color-accent))] mask-[radial-gradient(closest-side,transparent_calc(100%-3px),black_0)] motion-reduce:animate-none"
      aria-hidden="true"
    ></div>

    <div class="space-y-3">
      <p class="font-mono text-xs font-medium tracking-[0.14em] uppercase text-muted">Report</p>
      <h2 class="text-3xl">Generazione in corso</h2>
      <p class="mx-auto max-w-[46ch] text-base sm:text-[1.0625rem]">
        Il report è in fase di generazione. L'operazione può richiedere qualche istante.
      </p>
    </div>

    <BaseClickButton button-variant="outline" @click="emit('stop-generating-report')">
      Interrompi
    </BaseClickButton>

    <span class="sr-only">Generazione del report in corso</span>
  </div>
</template>
