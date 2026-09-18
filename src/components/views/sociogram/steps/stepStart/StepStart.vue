<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";

// --- Utilities ----------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const { goToStep } = useSociogramNavigation(emit);
</script>

<template>
    <div class="space-y-6">
        <section class="card space-y-6">
            <StepHeader title="È la prima volta che usi l'app?">
                ABGrid analizza le dinamiche relazionali del tuo gruppo — chi
                preferisce stare con chi, come si formano i sottogruppi, quali
                sono i ruoli chiave — e le restituisce come mappa visiva e
                numerica.
            </StepHeader>
        </section>

        <section class="card space-y-4">
            <div class="space-y-1">
                <p class="eyebrow">Nuovo progetto</p>
                <h3>Carica una nuova lista dei nomi</h3>
                <p class="text-sm">
                    Crea un nuovo sociogramma a partire da una lista di nomi.
                </p>
            </div>
            <BaseButton variant="solid" @click="goToStep('loadMembers')">
                Crea progetto
            </BaseButton>
        </section>

        <section class="card space-y-4">
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
                @click="goToStep('importFromArchive')"
            >
                Importa progetto
            </BaseButton>
        </section>
    </div>
</template>
