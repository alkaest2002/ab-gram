<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed } from "vue";

import { storeToRefs } from "pinia";

import { useGroupStore } from "@/stores/group";

import StepHeader from "@/components/views/group/common/StepHeader.vue";
import StepsNavigation from "@/components/views/group/common/stepsNavigation.vue";

import { useGroupNavigation } from "@/composables/groups/useGroupNavigation";

import { getMembersNameIssues } from "@/utils/group/memberHelpers";

import LoadMembersListEditor from "./LoadMembersListEditor.vue";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["group-go-to-step", "group-restart-app"]);

// --- Routers ------------

// --- Stores -------------
const groupStore = useGroupStore();
const { members, membersCount } = storeToRefs(groupStore);

// --- State --------------

// --- Composables --------
const { goToStep, restart } = useGroupNavigation(emit);

// --- Computed -----------
// The group list can only advance when the minimum member count is met, none of
// the names are blank, and no two members share the same name.
const nameIssues = computed(() => getMembersNameIssues(members.value));
const canGoNext = computed(
  () =>
    membersCount.value >= groupStore.minMembersCount &&
    nameIssues.value.emptyNamesCount === 0 &&
    nameIssues.value.duplicateNamesCount === 0,
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <section class="card space-y-6">
    <StepHeader>
      <template #eyebrow>Passaggio 2 di 4</template>
      <template #title>Gestisci il gruppo</template>
      Controlla i nominativi caricati: puoi modificarli, rimuoverli o aggiungerne di nuovi prima di
      proseguire.
    </StepHeader>

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <LoadMembersListEditor
      :members="members"
      @group-update-member="groupStore.updateMember"
      @group-add-member="groupStore.addMember"
      @group-remove-member="groupStore.removeMember"
    />
  </section>

  <StepsNavigation
    :enable-previous="true"
    :enable-next="canGoNext"
    :enable-archive="canGoNext"
    :enable-restart="canGoNext"
    @group-navigation-previous="goToStep('createProject')"
    @group-navigation-next="goToStep('setPreferences')"
    @group-navigation-restart="restart"
  />
</template>
