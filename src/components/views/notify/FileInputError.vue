<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";
import FileErrorIcon from "@/components/ui/icons/FileErrorIcon.vue";

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
            <FileErrorIcon />
        </template>

        <template #text>
            <p class="eyebrow">Errore file</p>
            <h1 class="text-balance">Il file non può essere caricato</h1>
            <p class="lede mx-auto">
                Il file selezionato non è un archivio sociogramma valido.
            </p>
            <p class="mx-auto max-w-[52ch] text-sm">
                Controlla che il file sia un archivio sociogramma valido e che
                non superi la dimensione massima consentita, poi riprova.
            </p>
        </template>

        <template #buttonLabel>
            Riprova
        </template>
    </BaseNotify>
</template>
