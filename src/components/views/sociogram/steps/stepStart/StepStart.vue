<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";
import WarningIcon from "@/components/ui/icons/WarningIcon.vue";
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart-app"]);

// --- State --------------
const sociogramStore = useSociogramStore();
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
    <div class="space-y-6">
        <section class="card space-y-6">
            <StepHeader title="È la prima volta che usi l'app?">
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
            <BaseButton variant="solid" @click="startFromScratch('loadMembers')">
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
                variant="outline"
                @click="startFromScratch('importFromArchive')"
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
        </section>
    </div>
</template>
