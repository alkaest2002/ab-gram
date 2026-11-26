<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import AppSpinner from "@/components/ui/AppSpinner.vue";
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
  <div class="flex w-full max-w-xl flex-col items-center gap-6 text-center">
    <AppSpinner>
      <div class="space-y-3">
        <p class="font-mono text-xs font-medium tracking-[0.14em] uppercase text-muted">Report</p>
        <h2 class="text-3xl">Generazione in corso</h2>
        <p class="mx-auto max-w-[46ch] text-base sm:text-[1.0625rem]">
          Il report è in fase di generazione. L'operazione può richiedere qualche istante.
        </p>
      </div>
    </AppSpinner>

    <BaseClickButton button-variant="outline" @click="emit('stop-generating-report')">
      Interrompi
    </BaseClickButton>
  </div>
</template>
