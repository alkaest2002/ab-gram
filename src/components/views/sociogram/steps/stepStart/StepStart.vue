<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";
import WarningIcon from "@/components/ui/icons/WarningIcon.vue";
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
]);

// --- State --------------
const sociogramStore = useSociogramStore();
const { goToStep } = useSociogramNavigation(emit);

const browsers = [
    { name: "Chrome", url: "https://www.google.com/chrome/" },
    { name: "Firefox", url: "https://www.mozilla.org/firefox/" },
    { name: "Edge", url: "https://www.microsoft.com/edge" },
    { name: "Safari", url: "https://www.apple.com/safari/" },
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
                AB-Gram misura e visualizza le dinamiche relazionali dei gruppi
                sociali attraverso indici sociometrici e mappe visive.
            </StepHeader>

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <div class="space-y-1">
                <p class="eyebrow">Nuovo progetto</p>
                <h3>Carica una nuova lista di nomi</h3>
                <p class="text-sm">
                    Crea un nuovo sociogramma a partire da una lista di nomi.
                </p>
            </div>
            <BaseButton
                buttonVariant="solid"
                @click="startFromScratch('loadMembers')"
            >
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
            <p class="eyebrow flex items-center gap-1">
                <WarningIcon size="size-3" /> Avviso
            </p>
            <p class="mt-1.5 text-sm leading-relaxed">
                I dati del sociogramma vengono salvati nella memoria RAM: al fine di evitare la perdita dei dati, ti
                consigliamo di
                <span class="font-medium"
                    >non aggiornare la pagina mentre stai lavorando, né di usare
                    i tasti back e forward del browser</span
                >. Potrai comunque "mettere in pausa" e riprendere un lavoro avviato e non concluso.
            </p>
            <p class="mt-3 text-sm leading-relaxed">
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
