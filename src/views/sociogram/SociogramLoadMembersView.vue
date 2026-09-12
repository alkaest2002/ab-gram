<script setup>
import { useSociogramStore } from "@/stores/sociogram";
import StepHeader from "@/components/ui/StepHeader.vue";

// Store connected but still empty: member input will go here.
const sociogram = useSociogramStore();
</script>

<template>
    <section class="card space-y-5">
        <StepHeader eyebrow="Passaggio 1 di 3" title="Carica i membri">
            Il modulo di inserimento dei nomi del gruppo non è ancora attivo.
        </StepHeader>

        <p class="flex flex-wrap gap-2">
            <span class="tag"
                >membersNames: {{ sociogram.membersNames.length }}</span
            >
            <span class="tag tag-off"
                >membersCount: {{ sociogram.membersCount }}</span
            >
        </p>
    </section>
</template>
