<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From stores
import { useSociogramStore } from "@/stores/sociogram";

//   -- From components
import WarningIcon from "@/components/ui/icons/WarningIcon.vue";
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";
import StartLoadMembers from "@/components/views/sociogram/steps/stepStart/StartLoadMembers.vue";
import StartImportProject from "@/components/views/sociogram/steps/stepStart/StartImportProject.vue";

//   -- From composables
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
]);

// --- Routers ------------

// --- Stores -------------
const sociogramStore = useSociogramStore();

// --- State --------------
const browsers = [
    { name: "Chrome", url: "https://www.google.com/chrome/" },
    { name: "Firefox", url: "https://www.mozilla.org/firefox/" },
    { name: "Edge", url: "https://www.microsoft.com/edge" },
    { name: "Safari", url: "https://www.apple.com/safari/" },
];

// --- Composables --------
const { goToStep } = useSociogramNavigation(emit);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
/**
 * Clear any previously loaded sociogram data, then move to the given step.
 * @param {string} step
 */
function startFromScratch(step) {
    sociogramStore.resetMembers();
    goToStep(step);
}
</script>

<template>
    <div class="space-y-3">
        <section class="card space-y-6">
            <StepHeader>
                <template #title>È la prima volta che usi l'app?</template>
                AB-Gram misura e visualizza le dinamiche relazionali dei gruppi
                sociali attraverso indici sociometrici e mappe visive.
            </StepHeader>

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <StartLoadMembers
                @sociogram-start-load-members="startFromScratch('loadMembers')"
            />

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <StartImportProject
                @sociogram-start-import-project="startFromScratch('importProject')"
                @sociogram-start-demo="goToStep('manageMembers')"
            />
        </section>

        <section
            class="rounded-lg border border-line bg-white text-muted p-5"
            role="note"
            aria-label="Avviso"
        >
            <p class="eyebrow flex items-center gap-1 text-muted">
                <WarningIcon size="size-3" /> Avviso
            </p>
            <p class="mt-1.5 text-sm leading-relaxed text-muted">
                I dati del sociogramma vengono salvati nella memoria RAM: al fine di evitare la perdita dei dati, ti
                consigliamo di
                <span class="font-medium"
                    >non aggiornare la pagina mentre stai lavorando, né di usare
                    i tasti back e forward del browser</span
                >. Potrai comunque "mettere in pausa" e riprendere un lavoro avviato e non concluso.
            </p>
            <p class="mt-3 text-sm leading-relaxed text-muted">
                L'app è stata testata con i seguenti browser:

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
