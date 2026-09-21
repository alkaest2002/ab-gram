<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";
import EmptyDocumentIcon from "@/components/ui/icons/EmptyDocumentIcon.vue";

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
            <EmptyDocumentIcon />
        </template>

        <template #text>
            <p class="eyebrow">Report</p>
            <h1 class="text-balance">Nessun dato da elaborare</h1>
            <p class="lede mx-auto">
                Non ci sono ancora dati per generare il report.
            </p>
            <p class="mx-auto max-w-[52ch] text-sm">
                Inserisci preferenze e rifiuti dei membri del gruppo, poi torna
                qui per generare il report.
            </p>
        </template>

        <template #buttonLabel>
            Inserisci i dati
        </template>
    </BaseNotify>
</template>
