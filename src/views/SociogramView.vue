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
const { currentState, hasPreviousState, hasNextState } = storeToRefs(sociogram);

// The sub-components, indexed by `currentState`.
const stateComponents = {
    start: SociogramStartView,
    loadMembers: SociogramLoadMembersView,
    setPreferences: SociogramSetPreferencesView,
    generateReport: SociogramGenerateReportView,
};

const currentComponent = computed(() => stateComponents[currentState.value]);
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>

        <PageTransition>
            <component :is="currentComponent" :key="currentState" />
        </PageTransition>

        <div class="flex flex-wrap gap-2">
            <BaseButton variant="soft" @click="sociogram.reset()">
                Ricomincia
            </BaseButton>

            <BaseButton
                variant="soft"
                :disabled="!hasPreviousState"
                @click="sociogram.goToPreviousState()"
            >
                Indietro
            </BaseButton>

            <BaseButton
                :disabled="!hasNextState"
                @click="sociogram.goToNextState()"
            >
                Avanti
            </BaseButton>
        </div>
    </div>
</template>
