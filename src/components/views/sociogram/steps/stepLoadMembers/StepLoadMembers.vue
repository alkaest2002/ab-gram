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
const {
    maxMemberNameLength,
    maxMembersCount,
    hasMembers,
    membersCount,
    members,
} = storeToRefs(sociogram);

// Flag for editor mode and member list state.
const isEditing = ref(false);

// Computed values.
const editorMode = computed(() => (isEditing.value ? "edit" : "view"));
const membersCountLabel = computed(() =>
    membersCount.value === 1
        ? "1 nome caricato"
        : `${membersCount.value} nomi caricati`,
);

// Data URL for downloading the loaded names, one per line.
const membersFileHref = computed(() => {
    const content = members.value.map((member) => member.name).join("\n");
    return `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
});

// The load step can only advance when there are members, none of them are
// blank, and no two members share the same name.
const nameIssues = computed(() => getMembersNameIssues(members.value));
const canGoNext = computed(
    () =>
        hasMembers.value &&
        nameIssues.value.emptyNamesCount === 0 &&
        nameIssues.value.duplicateNamesCount === 0,
);

const { goNext, goPrevious, restart } = useSociogramNavigation(
    "loadMembers",
    canGoNext,
    emit,
);

// Toggle the editing mode.
function toggleEditing() {
    isEditing.value = !isEditing.value;
}
</script>

<template>
    <section class="card space-y-6">

        <StepHeader eyebrow="Passaggio 1 di 3" title="Carica i membri">
            Carica un file di testo con un nome per riga, puoi &mdash; se
            necessario &mdash; modificare l'elenco prima di proseguire.
            Ogni nome &egrave; limitato a
            {{ sociogram.maxMemberNameLength }} caratteri;
            possono essere caricati al massimo
            {{ sociogram.maxMembersCount }} nomi.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <StepLoadMembersFileReader
            :max-row-length="maxMemberNameLength"
            :max-rows="maxMembersCount"
            v-model="members"
        />

        <div v-if="hasMembers" class="space-y-4">

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

            <div class="flex flex-wrap items-center justify-between gap-3">

                <BaseButton
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

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

        </div>

        <div v-if="hasMembers">
            <div>
                <p class="eyebrow">Elenco membri</p>
                <p class="mt-1 text-xs text-muted">
                    Puoi scaricare il file aggiornato, se hai apportato delle modifiche ai dati caricati.
                </p>
            </div>

            <a
                :href="membersFileHref"
                download="membri.txt"
                class="badge mt-3 mb-3 font-xs px-3"
            >
                elenco (.txt)
            </a>
        </div>

    </section>

    <SociogramNavigation
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
