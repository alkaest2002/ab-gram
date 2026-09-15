<script setup>
import { ref } from "vue";
import { useSociogramStore } from "@/stores/sociogram";
import { SOCIOGRAM_STEPS } from "@/composables/useSociogramNavigation";

import PageTransition from "@/components/common/ui/PageTransition.vue";

import SociogramStartView from "@/views/sociogram/SociogramStartView.vue";
import SociogramLoadMembersView from "@/views/sociogram/SociogramLoadMembersView.vue";
import SociogramSetPreferencesView from "@/views/sociogram/SociogramSetPreferencesView.vue";
import SociogramGenerateReportView from "@/views/sociogram/SociogramGenerateReportView.vue";

const sociogramStore = useSociogramStore();

const stateComponents ={
    start: SociogramStartView,
    loadMembers: SociogramLoadMembersView,
    setPreferences: SociogramSetPreferencesView,
    generateReport: SociogramGenerateReportView,
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
