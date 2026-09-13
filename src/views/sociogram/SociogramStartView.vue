<script setup>
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
            <router-link to="/docs" class="link text-sm">Leggi la documentazione</router-link>
        </div>
    </section>
</template>
