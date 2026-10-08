<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import PiggyIcon from "@/components/ui/icons/PiggyIcon.vue";
import SmileyIcon from "@/components/ui/icons/SmileyIcon.vue";
import ShieldIcon from "@/components/ui/icons/ShieldIcon.vue";


// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const features = [
    {
        id: "free",
        title: "Gratuita",
        text: "Nessun costo nascosto. Chiediamo, al massimo, una donazione libera per sostenere i costi del servizio di hosting.",
    },
    {
        id: "easy",
        title: "Semplice",
        text: "Nessun software da installare o da configurare. Tutto avviene all'interno del tuo browser.",
    },
    {
        id: "privacy",
        title: "Privata",
        text: "I tuoi dati non vegono comunicati a terze parti. Sono convervati nella memoria RAM del tuo dispositivo.",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <section class="space-y-8 text-center">
        <header class="mx-auto max-w-2xl space-y-3">
            <p class="eyebrow">Perché AB-Grid</p>
            <h2>Tre impegni, zero eccezioni</h2>
        </header>

        <ul class="mx-auto w-full max-w-2xl">
            <li
                v-for="feature in features"
                :key="feature.id"
                class="flex flex-col items-center gap-2.5 border-t border-line py-7 last:border-b"
            >
                <span class="text-black" aria-hidden="true">
                    <PiggyIcon v-if="feature.id === 'free'" size="size-18" stroke-width="1" />
                    <SmileyIcon v-else-if="feature.id === 'easy'" size="size-18" stroke-width="1" />
                    <ShieldIcon v-else-if="feature.id === 'privacy'" size="size-18" stroke-width="1" />
                </span>

                <h3 class="text-xl tracking-[-0.01em] sm:text-2xl text-black">
                    {{ feature.title }}
                </h3>

                <p class="max-w-[52ch]">{{ feature.text }}</p>
            </li>
        </ul>
    </section>
</template>
