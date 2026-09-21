<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseNotify from "@/components/ui/BaseNotify.vue";
import StopIcon from "@/components/ui/icons/StopIcon.vue";

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
            <StopIcon />
        </template>

        <template #text>
            <p class="eyebrow">Report</p>
            <h1 class="text-balance">Generazione interrotta</h1>
            <p class="lede mx-auto">
                Hai interrotto la generazione del report.
            </p>
            <p class="mx-auto max-w-[52ch] text-sm">
                I dati inseriti non sono andati persi. Puoi tornare al
                sociogramma e riprovare quando vuoi.
            </p>
        </template>

        <template #buttonLabel>
            Torna al sociogramma
        </template>
    </BaseNotify>
</template>
