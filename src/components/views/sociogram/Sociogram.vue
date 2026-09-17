<script setup>
import { computed, ref } from "vue";
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

// UI state: the member to point the preferences carousel at when it opens.
// Set only by the report summary's "edit this member" cards; cleared on any
// other step navigation so a stale target can't re-apply later.
const memberIdToEdit = ref(null);

function changeComponent(componentName) {
  memberIdToEdit.value = null;
  currentComponentName.value = componentName;
}

function editMember(memberId) {
  memberIdToEdit.value = memberId;
  currentComponentName.value = "setPreferences";
}

// Pass the target id only to the preferences step; the other steps ignore it.
const stepProps = computed(() =>
  currentComponentName.value === "setPreferences"
    ? { targetMemberId: memberIdToEdit.value }
    : {},
);
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>
        <PageTransition>
            <div :key="currentComponentName">
                <keep-alive>
                    <component
                        :is="stateComponents[currentComponentName]"
                        v-bind="stepProps"
                        @sociogram-change-component="changeComponent"
                        @sociogram-edit-member="editMember"
                        @sociogram-restart="sociogramStore.resetMembers"
                    />
                </keep-alive>
            </div>
        </PageTransition>
    </div>
</template>
