<script setup>
import { computed } from "vue";

import StepHeader from "@/components/specific/sociogram/StepHeader.vue";
import SociogramNavigation from "@/components/specific/sociogram/SociogramNavigation.vue";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);
// TODO: replace this with the real preferences validation (e.g. every member
// has provided their likes/dislikes) once collection is wired up.
const canGoNext = computed(() => true);

const { showPrevious, showNext, showRestart, goPrevious, goNext, restart } =
    useSociogramNavigation("setPreferences", canGoNext, emit);
</script>

<template>
    <section class="card space-y-5">
        <StepHeader eyebrow="Passaggio 2 di 3" title="Imposta le preferenze">
            Qui ogni membro indicherà le proprie preferenze positive
            (<code>likes</code>) e negative (<code>dislikes</code>).
        </StepHeader>

        <p class="text-sm text-muted">
            Nessuna logica di raccolta è ancora collegata.
        </p>
    </section>

    <SociogramNavigation
        :show-previous="showPrevious"
        :show-next="showNext"
        :show-restart="showRestart"
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
