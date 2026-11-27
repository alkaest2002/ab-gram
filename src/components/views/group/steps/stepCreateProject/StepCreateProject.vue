<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { useGroupStore } from "@/stores/group";

import WarningIcon from "@/components/ui/icons/WarningIcon.vue";
import StepHeader from "@/components/views/group/common/StepHeader.vue";
import CreateProjectLoadMembers from "@/components/views/group/steps/stepCreateProject/CreateProjectLoadMembers.vue";
import CreateProjectImportProject from "@/components/views/group/steps/stepCreateProject/CreateProjectImportProject.vue";

import { useGroupNavigation } from "@/composables/groups/useGroupNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["group-go-to-step", "group-restart-app"]);

// --- Routers ------------

// --- Stores -------------
const groupStore = useGroupStore();

// --- State --------------
const browsers = [
  { name: "Chrome", url: "https://www.google.com/chrome/" },
  { name: "Firefox", url: "https://www.mozilla.org/firefox/" },
  { name: "Edge", url: "https://www.microsoft.com/edge" },
  { name: "Safari", url: "https://www.apple.com/safari/" },
];

// --- Composables --------
const { goToStep } = useGroupNavigation(emit);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
/**
 * Clear any previously loaded group data, then move to the given step.
 * @param {string} step
 */
function startFromScratch(step) {
  groupStore.resetMembers();
  goToStep(step);
}
</script>

<template>
  <div class="space-y-3">
    <section class="card space-y-6">
      <StepHeader>
        <template #title>È la prima volta che usi l'app?</template>
        AB-Gram misura e visualizza le dinamiche relazionali dei gruppi sociali attraverso indici
        numerici e mappe visive.
      </StepHeader>

      <div class="h-px w-full bg-line" aria-hidden="true"></div>

      <CreateProjectLoadMembers @group-start-load-members="startFromScratch('loadMembers')" />

      <div class="h-px w-full bg-line" aria-hidden="true"></div>

      <CreateProjectImportProject
        @group-start-import-project="startFromScratch('importProject')"
        @group-start-demo="goToStep('manageMembers')"
      />
    </section>

    <section
      class="rounded-lg border border-line bg-white text-muted p-5"
      role="note"
      aria-label="Avviso"
    >
      <p class="eyebrow flex items-center gap-1 text-muted">Avviso</p>
      <p class="mt-1.5 text-sm leading-relaxed text-muted">
        I dati AB-Gram vengono salvati nella memoria RAM: per evitare di perderli, ti consigliamo di
        <span class="font-medium"
          >non aggiornare la pagina e non usare i tasti Indietro e Avanti del browser</span
        >, mentre lavori. Se necessario, puoi comunque mettere in pausa il progetto e riprenderlo in
        un secondo momento.
      </p>
      <p class="mt-3 text-sm leading-relaxed text-muted">
        L’app è stata testata sui seguenti browser per desktop:

        <a
          v-for="browser in browsers"
          :key="browser.name"
          :href="browser.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Apri il sito di ${browser.name}`"
          class="mx-1 text-sm text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          {{ browser.name }}
        </a>
      </p>
    </section>
  </div>
</template>
