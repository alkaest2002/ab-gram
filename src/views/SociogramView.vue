<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import BaseButton from "@/components/ui/BaseButton.vue";
import PageTransition from "@/components/ui/PageTransition.vue";
import { useSociogramStore } from "@/stores/sociogram";

import SociogramStartView from "@/views/sociogram/SociogramStartView.vue";
import SociogramLoadMembersView from "@/views/sociogram/SociogramLoadMembersView.vue";
import SociogramSetPreferencesView from "@/views/sociogram/SociogramSetPreferencesView.vue";
import SociogramGenerateReportView from "@/views/sociogram/SociogramGenerateReportView.vue";

const sociogram = useSociogramStore();

// Reactive references to state/getters (Composition API equivalent of mapState).
const { currentSociogramStep, hasPreviousSociogramStep, hasNextSociogramStep } = storeToRefs(sociogram);

// The sub-components, indexed by `currentState`.
const stateComponents = {
    start: SociogramStartView,
    loadMembers: SociogramLoadMembersView,
    setPreferences: SociogramSetPreferencesView,
    generateReport: SociogramGenerateReportView,
};

const currentComponent = computed(() => stateComponents[currentSociogramStep.value]);

</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>

        <PageTransition>
            <component :is="currentComponent" :key="currentSociogramStep" />
        </PageTransition>

        <div class="flex flex-wrap gap-2 justify-between">

            <div class="flex flex-wrap gap-2">

                <BaseButton
                    variant="outline"
                    :disabled="!hasPreviousSociogramStep"
                    @click="sociogram.goToPreviousSociogramStep()"
                >
                    Indietro
                </BaseButton>

                <BaseButton
                    :disabled="!hasNextSociogramStep"
                    @click="sociogram.goToNextSociogramStep()"
                >
                    Avanti
                </BaseButton>
            </div>

            <BaseButton variant="outline" @click="sociogram.reset()">
                Ricomincia
            </BaseButton>
        </div>
    </div>
</template>
