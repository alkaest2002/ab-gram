<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import LoadMembersListEditor from "./LoadMembersListEditor.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { getMembersNameIssues } from "@/utils/sociogram/memberHelpers";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
]);

// --- State --------------
const sociogramStore = useSociogramStore();
const { members, membersCount } = storeToRefs(sociogramStore);

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
        <StepHeader eyebrow="Passaggio 2 di 4" title="Gestisci i membri del gruppo">
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
