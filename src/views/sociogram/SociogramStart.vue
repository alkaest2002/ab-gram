<script setup>
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

import StepHeader from "@/components/specific/sociogram/StepHeader.vue";
import SociogramNavigation from "@/components/specific/sociogram/SociogramNavigation.vue";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

const { showPrevious, showNext, showRestart, goPrevious, goNext, restart } =
    useSociogramNavigation("start", true, emit);
</script>

<template>
    <section class="card space-y-5">
        <StepHeader
            eyebrow="Punto di partenza"
            title="È la prima volta che usi l'app?"
        >
            Se è la prima volta che usi l'app, ti consigliamo di leggere la
            documentazione.
        </StepHeader>

        <div class="flex flex-wrap gap-2">
            <router-link to="/docs" class="link text-sm"
                >Leggi la documentazione</router-link
            >
        </div>
    </section>

    <SociogramNavigation
        :show-previous="showPrevious"
        :show-next="showNext"
        :show-restart="showRestart"
        :enable-previous="true"
        :enable-next="true"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
