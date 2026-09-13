<script setup>
import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/ui/StepHeader.vue";
import { useSociogramStore } from "@/stores/sociogram";

const sociogram = useSociogramStore();
</script>

<template>
    <section class="card space-y-5">
        <StepHeader
            eyebrow="Punto di partenza"
            title="È la prima volta che usi l'app?"
        >
            Se è la prima volta che usi l'app, ti consigliamo di leggere la documentazione.
        </StepHeader>

        <div class="flex flex-wrap gap-2">
            <BaseButton variant="soft" to="/docs"
                >Leggi la documentazione</BaseButton
            >
        </div>
    </section>
</template>
