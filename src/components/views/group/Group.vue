<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, ref } from "vue";

import { storeToRefs } from "pinia";

import { useGroupStore } from "@/stores/group";

import StepCreateProject from "@/components/views/group/steps/stepCreateProject/StepCreateProject.vue";
import StepImportProject from "@/components/views/group/steps/stepImportProject/StepImportProject.vue";
import StepLoadMembers from "@/components/views/group/steps/stepLoadMembers/StepLoadMembers.vue";
import StepManageMembers from "@/components/views/group/steps/stepManageMembers/StepManageMembers.vue";
import StepSetPreferences from "@/components/views/group/steps/stepSetPreferences/StepSetPreferences.vue";
import StepSummarizeData from "@/components/views/group/steps/stepSummarizeData/StepSummarizeData.vue";
import AppTransitionKeepAlive from "@/components/ui/AppTransitionKeepAlive.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------
const groupStore = useGroupStore();
const { membersStatus } = storeToRefs(groupStore);

// --- State --------------
const stateComponents = {
  createProject: StepCreateProject,
  importProject: StepImportProject,
  loadMembers: StepLoadMembers,
  manageMembers: StepManageMembers,
  setPreferences: StepSetPreferences,
  summarizeData: StepSummarizeData,
};

const currentComponentName = ref(
  membersStatus.value === "empty" ? "createProject" : "manageMembers",
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

// Only "group-edit-member" is emitted; binding it to every step
// makes Vue try to fall through the listener on the others (e.g. StepCreateProject,
// which renders a fragment root) and triggers a warning. Attach it conditionally.
const stepListeners = computed(() => {
  const listeners = {
    "group-go-to-step": changeComponent,
    "group-restart-app": groupStore.resetStore,
  };

  if (currentComponentName.value === "summarizeData") {
    listeners["group-edit-member"] = editMember;
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
      <AppTransitionKeepAlive :key="currentComponentName">
        <component
          :is="stateComponents[currentComponentName]"
          v-bind="stepProps"
          v-on="stepListeners"
        />
      </AppTransitionKeepAlive>
    </keep-alive>
  </div>
</template>
