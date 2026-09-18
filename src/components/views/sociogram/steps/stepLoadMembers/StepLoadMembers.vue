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
import StepLoadMembersFileReader from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembersFileReader.vue";
import StepLoadMembersListEditor from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembersListEditor.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { getMembersNameIssues } from "@/utils/members";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

// --- State --------------
// Get the sociogram store and its state.
const sociogramStore = useSociogramStore();
const {
    maxMemberNameLength,
    maxMembersCount,
    hasMembers,
    members,
} = storeToRefs(sociogramStore);

// --- Computed -----------
// The load step can only advance when there are members, none of them are
// blank, and no two members share the same name.
const nameIssues = computed(() => getMembersNameIssues(members.value));
const hasLoaded = computed(
    () =>
        hasMembers.value &&
        nameIssues.value.emptyNamesCount === 0 &&
        nameIssues.value.duplicateNamesCount === 0,
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const { goToStep, restart } = useSociogramNavigation(emit);
</script>

<template>
    <section class="card space-y-6">

        <StepHeader eyebrow="Passaggio 1 di 3" title="Carica la lista dei nomi">
            Il file di testo deve contenere un elenco di nomi, non necessariamente in ordine alfabetico.
            Ogni nome &egrave; limitato a
            {{ sociogramStore.maxMemberNameLength }} caratteri;
            possono essere caricati al massimo
            {{ sociogramStore.maxMembersCount }} nomi.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <StepLoadMembersFileReader
            :max-row-length="maxMemberNameLength"
            :max-rows="maxMembersCount"
            v-model="members"
        />

        <div v-if="hasMembers" class="space-y-4">

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <StepLoadMembersListEditor
                :members="members"
                @sociogram-update-member="sociogramStore.updateMember"
                @sociogram-add-member="sociogramStore.addMember"
                @sociogram-remove-member="sociogramStore.removeMember"
            />

        </div>
    </section>

    <SociogramNavigation
        :enable-previous="true"
        :enable-next="hasLoaded"
        :enable-archive="hasLoaded"
        :enable-restart="hasLoaded"
        @sociogram-step-previous="goToStep('start')"
        @sociogram-step-next="goToStep('setPreferences')"
        @sociogram-step-restart="restart"
    />
</template>
