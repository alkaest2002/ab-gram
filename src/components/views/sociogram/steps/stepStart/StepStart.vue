<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";

// --- Utilities ----------
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

// --- State --------------
/**
 * The three wizard steps, in order: the start screen is the one place where the
 * whole path is laid out before the user commits to it.
 */
const steps = [
    {
        label: "Carica i nomi",
        text: "Un nome per riga; correggi l'elenco prima di continuare.",
    },
    {
        label: "Preferenze e rifiuti",
        text: "Indica chi sceglie chi, una persona alla volta.",
    },
    {
        label: "Report",
        text: "Il grafo e gli indici sociometrici della tua rete.",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const { goNext, goPrevious, restart } = useSociogramNavigation("start", true, emit);

// Zero-padded mono index: 01, 02, 03.
const stepNumber = (index) => String(index + 1).padStart(2, "0");
</script>

<template>
    <section class="card space-y-6">
        <StepHeader
            eyebrow="Punto di partenza"
            title="È la prima volta che usi l'app?"
        >
            ABGrid analizza le dinamiche relazionali del tuo gruppo — chi
            preferisce stare con chi, come si formano i sottogruppi, quali sono i
            ruoli chiave — e le restituisce come mappa visiva e numerica.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <div class="space-y-4">
            <p class="eyebrow">Come funziona</p>
            <ol class="grid gap-4">
                <li
                    v-for="(step, i) in steps"
                    :key="step.label"
                    class="flex items-start gap-4"
                >
                    <span
                        class="w-9 shrink-0 pt-0.5 font-mono text-[0.8125rem] font-medium tracking-[0.08em] text-muted"
                        aria-hidden="true"
                        >{{ stepNumber(i) }}</span
                    >
                    <div class="space-y-1">
                        <h3>{{ step.label }}</h3>
                        <p class="text-sm">{{ step.text }}</p>
                    </div>
                </li>
            </ol>
        </div>

        <aside class="rounded-lg border border-line p-4">
            <p class="eyebrow">Analisi locale</p>
            <p class="mt-2 text-sm">
                Non raccogliamo i dati: li inserisci tu, restano sul dispositivo
                e il calcolo avviene nel browser. Ideale per ricerche, classi e
                indagini organizzative, dove la privacy dei partecipanti è
                fondamentale.
            </p>
        </aside>

        <div class="flex flex-wrap items-center gap-4">
            <router-link to="/docs" class="link text-sm"
                >Leggi la documentazione</router-link
            >
        </div>
    </section>

    <SociogramNavigation
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="false"
        :enable-restart="false"
        :enable-next="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
