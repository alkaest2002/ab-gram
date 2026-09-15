<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { useSociogramStore } from "@/stores/sociogram";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";
import { getMembersNameIssues } from "@/utils/members";

import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import StepLoadMembersFileReader from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembersFileReader.vue";
import StepLoadMembersListEditor from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembersListEditor.vue";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

// Get the sociogram store and its state.
const sociogram = useSociogramStore();
const { hasMembers, membersCount, members } = storeToRefs(sociogram);

// Flag for editor mode and member list state.
const isEditing = ref(false);

// Computed values.
const editorMode = computed(() => (isEditing.value ? "edit" : "view"));
const membersCountLabel = computed(() =>
    membersCount.value === 1
        ? "1 nome caricato"
        : `${membersCount.value} nomi caricati`,
);

// The load step can only advance when there are members, none of them are
// blank, and no two members share the same name.
const nameIssues = computed(() => getMembersNameIssues(members.value));
const canGoNext = computed(
    () =>
        hasMembers.value &&
        nameIssues.value.emptyNamesCount === 0 &&
        nameIssues.value.duplicateNamesCount === 0,
);

const { showPrevious, showNext, showRestart, goPrevious, goNext, restart } =
    useSociogramNavigation("loadMembers", canGoNext, emit);

// Toggle the editing mode.
function toggleEditing() {
    isEditing.value = !isEditing.value;
}
</script>

<template>
    <section class="card space-y-6">
        <StepHeader eyebrow="Passaggio 1 di 3" title="Carica i membri">
            Carica un file di testo con un nome per riga, poi &mdash; se
            necessario &mdash; rivedi o modifica l'elenco prima di proseguire.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <StepLoadMembersFileReader v-model="members" />

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <div class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="eyebrow">Elenco membri</p>
                    <p
                        v-if="membersCount > 0"
                        class="mt-1 font-mono text-xs text-muted"
                    >
                        {{ membersCountLabel }}
                    </p>
                </div>

                <BaseButton
                    v-if="hasMembers"
                    variant="outline"
                    @click="toggleEditing"
                >
                    {{ isEditing ? "Fine modifica" : "Modifica nomi" }}
                </BaseButton>
            </div>

            <StepLoadMembersListEditor
                :members="members"
                :mode="editorMode"
                @update:member="sociogram.updateMember"
                @remove:member="sociogram.removeMember"
            />
        </div>
    </section>

    <SociogramNavigation
        :show-previous="showPrevious"
        :show-next="showNext"
        :show-restart="showRestart"
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
