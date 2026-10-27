<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From pinia
import { storeToRefs } from "pinia";

//   -- From stores
import { useSociogramStore } from "@/stores/sociogram";

//   -- From components
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/common/SociogramNavigation.vue";

//   -- From composables
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

//   -- From utils
import { getMembersNameIssues } from "@/utils/sociogram/memberHelpers";

//   -- From relative
import LoadMembersListEditor from "./LoadMembersListEditor.vue";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
]);

// --- Routers ------------

// --- Stores -------------
const sociogramStore = useSociogramStore();
const { members, membersCount } = storeToRefs(sociogramStore);

// --- State --------------

// --- Composables --------
const { goToStep, restart } = useSociogramNavigation(emit);

// --- Computed -----------
// The group list can only advance when there is at least one member, none of
// them are blank, and no two members share the same name.
const nameIssues = computed(() => getMembersNameIssues(members.value));
const canGoNext = computed(
    () =>
        membersCount.value > 0 &&
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
            <template #title>Gestisci i membri del gruppo</template>
            Controlla i nominativi caricati: puoi modificarli, rimuoverli o
            aggiungerne di nuovi prima di proseguire.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <LoadMembersListEditor
            :members="members"
            @sociogram-update-member="sociogramStore.updateMember"
            @sociogram-add-member="sociogramStore.addMember"
            @sociogram-remove-member="sociogramStore.removeMember"
        />
    </section>

    <SociogramNavigation
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-archive="canGoNext"
        :enable-restart="canGoNext"
        @sociogram-navigation-previous="goToStep('start')"
        @sociogram-navigation-next="goToStep('setPreferences')"
        @sociogram-navigation-restart="restart"
    />
</template>
