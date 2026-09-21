<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";
import InvalidDataIcon from "@/components/ui/icons/InvalidDataIcon.vue";

// --- Composables --------

// --- Props --------------
defineProps({
    /** Where the button links to; passed down by the router. */
    to: { type: [String, Object], default: null },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BaseNotify :to="to">
        <template #icon>
            <InvalidDataIcon />
        </template>

        <template #text>
            <p class="eyebrow">Errore di validazione</p>
            <h1 class="text-balance">Ooops! Qualcosa è andato storto</h1>
            <p class="lede mx-auto">
                I dati sociometrici non sono corretti.
            </p>
            <p class="mx-auto max-w-[52ch] text-sm">
                Controlla che i dati rispettino i requisiti e i vincoli
                richiesti, poi riprova.
            </p>
            <p class="mx-auto max-w-[52ch] text-sm">
                Consulta la documentazione per i requisiti indispensabili. Se
                pensi che quest'errore sia un bug del software, contatta lo
                sviluppatore.
            </p>
        </template>

        <template #buttonLabel>
            Consulta la documentazione
        </template>
    </BaseNotify>
</template>
