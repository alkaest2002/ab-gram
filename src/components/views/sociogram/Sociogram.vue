<script setup>
import { ref } from "vue";
import { useSociogramStore } from "@/stores/sociogram";
import { SOCIOGRAM_STEPS } from "@/composables/useSociogramNavigation";

import PageTransition from "@/components/ui/PageTransition.vue";
import StepStart from "@/components/views/sociogram/steps/stepStart/StepStart.vue";
import StepLoadMembers from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembers.vue";
import StepSetPreferences from "@/components/views/sociogram/steps/stepSetPreferences/StepSetPreferences.vue";
import StepGenerateReport from "@/components/views/sociogram/steps/stepGenerateReport/StepGenerateReport.vue";

const sociogramStore = useSociogramStore();

const stateComponents ={
    start: StepStart,
    loadMembers: StepLoadMembers,
    setPreferences: StepSetPreferences,
    generateReport: StepGenerateReport,
};

const currentComponentName = ref(SOCIOGRAM_STEPS[0]);

function changeComponent(componentName) {
  currentComponentName.value = componentName;
}
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>
        <PageTransition>
            <div :key="currentComponentName">
                <component
                    :is="stateComponents[currentComponentName]"
                    @sociogram-change-component="changeComponent"
                    @sociogram-restart="sociogramStore.resetMembers"
                />
            </div>
        </PageTransition>
    </div>
</template>
