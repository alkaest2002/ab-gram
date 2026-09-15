<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import PageTransition from "@/components/ui/PageTransition.vue";
import { useSociogramStore } from "@/stores/sociogram";

import SociogramStartView from "@/views/sociogram/SociogramStartView.vue";
import SociogramLoadMembersView from "@/views/sociogram/SociogramLoadMembersView.vue";
import SociogramSetPreferencesView from "@/views/sociogram/SociogramSetPreferencesView.vue";
import SociogramGenerateReportView from "@/views/sociogram/SociogramGenerateReportView.vue";

const sociogram = useSociogramStore();
const { currentSociogramStep } = storeToRefs(sociogram);

// The sub-components, indexed by the current step.
const stateComponents = {
    start: SociogramStartView,
    loadMembers: SociogramLoadMembersView,
    setPreferences: SociogramSetPreferencesView,
    generateReport: SociogramGenerateReportView,
};

const currentComponent = computed(
    () => stateComponents[currentSociogramStep.value],
);
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>
        <PageTransition>
            <div :key="currentSociogramStep">
                <component :is="currentComponent" />
            </div>
        </PageTransition>
    </div>
</template>
