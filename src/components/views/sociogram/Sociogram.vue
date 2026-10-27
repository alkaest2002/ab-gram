<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed, ref } from "vue";

//   -- From pinia
import { storeToRefs } from "pinia";

//   -- From stores
import { useSociogramStore } from "@/stores/sociogram";

//   -- From components
import StepStart from "@/components/views/sociogram/steps/stepStart/StepStart.vue";
import StepImportProject from "@/components/views/sociogram/steps/stepImportProject/StepImportProject.vue";
import StepLoadMembers from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembers.vue";
import ManageMembers from "@/components/views/sociogram/steps/stepManageMembers/StepManageMembers.vue";
import StepSetPreferences from "@/components/views/sociogram/steps/stepSetPreferences/StepSetPreferences.vue";
import StepGenerateReport from "@/components/views/sociogram/steps/stepGenerateReport/StepGenerateReport.vue";
import AppKeepAliveTransition from "@/components/ui/AppKeepAliveTransition.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------
const sociogramStore = useSociogramStore();
const { membersStatus } = storeToRefs(sociogramStore);

// --- State --------------
const stateComponents = {
    start: StepStart,
    importProject: StepImportProject,
    loadMembers: StepLoadMembers,
    manageMembers: ManageMembers,
    setPreferences: StepSetPreferences,
    generateReport: StepGenerateReport,
};

const currentComponentName = ref(
    membersStatus.value === "empty"
        ? "start"
        : membersStatus.value === "partially-loaded"
          ? "manageMembers"
          : "generateReport",
);

// UI state: the member to point the preferences carousel at when it opens.
// Set only by the report summary's "edit this member" cards; cleared on any
// other step navigation so a stale target can't re-apply later.
const memberIdToEdit = ref(null);

// --- Composables --------

// --- Computed -----------
// Pass the target id only to the preferences step; the other steps ignore it.
const stepProps = computed(() => {
    if (currentComponentName.value === "setPreferences") {
        return { targetMemberId: memberIdToEdit.value };
    }
    return {};
});

// Only "sociogram-edit-member" is emitted; binding it to every step
// makes Vue try to fall through the listener on the others (e.g. StepStart,
// which renders a fragment root) and triggers a warning. Attach it conditionally.
const stepListeners = computed(() => {
    const listeners = {
        "sociogram-change-component": changeComponent,
        "sociogram-restart-app": sociogramStore.resetMembers,
    };

    if (currentComponentName.value === "generateReport") {
        listeners["sociogram-edit-member"] = editMember;
    }

    return listeners;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function changeComponent(componentName) {
    memberIdToEdit.value = null;
    currentComponentName.value = componentName;
}

function editMember(memberId) {
    memberIdToEdit.value = memberId;
    currentComponentName.value = "setPreferences";
}
</script>

<template>
    <div class="page">
        <keep-alive>
            <AppKeepAliveTransition :key="currentComponentName">
                <component
                    :is="stateComponents[currentComponentName]"
                    v-bind="stepProps"
                    v-on="stepListeners"
                />
            </AppKeepAliveTransition>
        </keep-alive>
    </div>
</template>
