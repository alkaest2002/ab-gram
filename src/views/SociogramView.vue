<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import PageTransition from "@/components/ui/PageTransition.vue";
import SociogramNavigation from "@/components/sociogram/SociogramNavigation.vue";
import { useSociogramStore, SOCIOGRAM_STEPS } from "@/stores/sociogram";

import SociogramStartView from "@/views/sociogram/SociogramStartView.vue";
import SociogramLoadMembersView from "@/views/sociogram/SociogramLoadMembersView.vue";
import SociogramSetPreferencesView from "@/views/sociogram/SociogramSetPreferencesView.vue";
import SociogramGenerateReportView from "@/views/sociogram/SociogramGenerateReportView.vue";

const sociogram = useSociogramStore();
const { currentSociogramStep, hasMembers } = storeToRefs(sociogram);

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

const currentComponentIndex = computed(() =>
    SOCIOGRAM_STEPS.indexOf(currentSociogramStep.value),
);

const hasPrevious = computed(() => currentComponentIndex.value > 0);
const hasNext = computed(() => currentComponentIndex.value < SOCIOGRAM_STEPS.length - 1);

// The members step can only be left once at least one member is loaded.
const canGoNext = computed(
    () =>
        hasNext.value &&
        (currentSociogramStep.value !== "loadMembers" || hasMembers.value),
);

function goToStep(index) {
    const step = SOCIOGRAM_STEPS[index];
    if (step) sociogram.setCurrentSociogramStep(step);
}

function goPrevious() {
    if (hasPrevious.value) goToStep(currentComponentIndex.value - 1);
}

function goNext() {
    if (canGoNext.value) goToStep(currentComponentIndex.value + 1);
}

function restart() {
    sociogram.reset();
}
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>
        <PageTransition>
            <div :key="currentSociogramStep">
                <component :is="currentComponent" />
                <SociogramNavigation
                    :show-previous="hasPrevious"
                    :show-next="hasNext"
                    :show-restart="currentComponentIndex > 0"
                    :enable-previous="true"
                    :enable-next="canGoNext"
                    :enable-restart="true"
                    @sociogram-step-previous="goPrevious"
                    @sociogram-step-next="goNext"
                    @sociogram-step-restart="restart"
                />
            </div>
        </PageTransition>
    </div>
</template>
