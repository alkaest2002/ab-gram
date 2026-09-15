<script setup>
import { ref } from "vue";
import { useSociogramStore } from "@/stores/sociogram";
import { SOCIOGRAM_STEPS } from "@/composables/useSociogramNavigation";

import PageTransition from "@/components/common/ui/PageTransition.vue";
import SociogramStart from "@/views/sociogram/SociogramStart.vue";
import SociogramLoadMembers from "@/views/sociogram/SociogramLoadMembers.vue";
import SociogramSetPreferences from "@/views/sociogram/SociogramSetPreferences.vue";
import SociogramGenerateReport from "@/views/sociogram/SociogramGenerateReport.vue";

const sociogramStore = useSociogramStore();

const stateComponents ={
    start: SociogramStart,
    loadMembers: SociogramLoadMembers,
    setPreferences: SociogramSetPreferences,
    generateReport: SociogramGenerateReport,
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
