<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";
import ChromeIcon from "@/components/ui/icons/ChromeIcon.vue";
import EdgeIcon from "@/components/ui/icons/EdgeIcon.vue";
import FirefoxIcon from "@/components/ui/icons/FirefoxIcon.vue";
import SafariIcon from "@/components/ui/icons/SafariIcon.vue";
import WarningIcon from "@/components/ui/icons/WarningIcon.vue";
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart-app"]);

// --- State --------------
const sociogramStore = useSociogramStore();
const { goToStep } = useSociogramNavigation(emit);

const browsers = [
    { name: "Chrome", url: "https://www.google.com/chrome/", icon: ChromeIcon },
    { name: "Firefox", url: "https://www.mozilla.org/firefox/", icon: FirefoxIcon },
    { name: "Edge", url: "https://www.microsoft.com/edge", icon: EdgeIcon },
    { name: "Safari", url: "https://www.apple.com/safari/", icon: SafariIcon },
];

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
    <div class="space-y-6">
        <section class="card space-y-6">
            <StepHeader>
                <template #title>È la prima volta che usi l'app?</template>
                AB-Grid misura e visualizza le dinamiche relazionali dei gruppi sociali
                attraverso indici sociometrici e mappe visive.
            </StepHeader>

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <div class="space-y-1">
                <p class="eyebrow">Nuovo progetto</p>
                <h3>Carica una nuova lista di nomi</h3>
                <p class="text-sm">
                    Crea un nuovo sociogramma a partire da una lista di nomi.
                </p>
            </div>
            <BaseButton buttonVariant="solid" @click="startFromScratch('loadMembers')">
                Crea progetto
            </BaseButton>

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <div class="space-y-1">
                <p class="eyebrow">Progetto archiviato</p>
                <h3>Importa i dati archiviati</h3>
                <p class="text-sm">
                    Riprendi un progetto salvato in precedenza, esattamente da
                    dove lo avevi lasciato.
                </p>
            </div>
            <BaseButton
                buttonVariant="outline"
                @click="startFromScratch('importProject')"
            >
                Importa progetto
            </BaseButton>
        </section>

        <section
            class="rounded-lg border border-line bg-white p-5"
            role="note"
            aria-label="Avviso"
        >
            <p class="eyebrow flex items-center gap-1"> <WarningIcon size="size-3" /> Avviso</p>
            <p class="mt-1.5 text-sm leading-relaxed">
                I dati del sociogramma non vengono salvati nella cache del
                browser: ti consigliamo di non aggiornare la pagina mentre
                stai lavorando, né di usare i tasti back e forward del browser.
                Potrai comunque salvare e riprendere i lavori
                iniziati, anche se non ancora completati.
            </p>
            <p class="mt-3 text-sm leading-relaxed">
                L'app è stata testata con i seguenti browser:
            </p>
            <div class="mt-2 grid grid-cols-4 gap-2">
                <a
                    v-for="browser in browsers"
                    :key="browser.name"
                    :href="browser.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Apri il sito di ${browser.name}`"
                    class="flex flex-wrap flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-white p-3 text-center transition-colors hover:border-accent"
                >
                    <component :is="browser.icon" size="size-6" class="grayscale" />
                    <span class="text-xs font-medium">{{ browser.name }}</span>
                </a>
            </div>
        </section>
    </div>
</template>
