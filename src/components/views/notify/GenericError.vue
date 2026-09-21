<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";
import WarningIcon from "@/components/ui/icons/WarningIcon.vue";

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
            <WarningIcon />
        </template>

        <template #text>
            <p class="eyebrow">Errore</p>
            <h1 class="text-balance">Ooops! Qualcosa è andato storto</h1>
            <p class="lede mx-auto">
                Si è verificato un problema imprevisto.
            </p>
            <p class="mx-auto max-w-[52ch] text-sm">
                Riprova tra poco. Se il problema persiste, segnalalo a chi
                gestisce l'applicazione.
            </p>
        </template>

        <template #buttonLabel>
            Torna alla home
        </template>
    </BaseNotify>
</template>
