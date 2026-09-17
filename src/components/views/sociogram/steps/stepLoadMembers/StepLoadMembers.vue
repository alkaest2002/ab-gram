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

// --- Utilities ----------
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";
import { getMembersNameIssues } from "@/utils/members";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

// --- State --------------
// Get the sociogram store and its state.
const sociogram = useSociogramStore();
const {
    maxMemberNameLength,
    maxMembersCount,
    hasMembers,
    membersCount,
    members,
} = storeToRefs(sociogram);

// --- Computed -----------
// Computed values.
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

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const { goNext, goPrevious, restart } = useSociogramNavigation(
    "loadMembers",
    canGoNext,
    emit,
);
</script>

<template>
    <section class="card space-y-6">

        <StepHeader eyebrow="Passaggio 1 di 3" title="Carica la lista dei nomi">
            Il file di testo deve contenere un nome per riga, puoi &mdash; se
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

            <StepLoadMembersListEditor
                :members="members"
                @update:member="sociogram.updateMember"
                @remove:member="sociogram.removeMember"
            />

            <div class="h-px w-full bg-line" aria-hidden="true"></div>

        </div>

        <div v-if="hasMembers">
            <div>
                <p class="eyebrow">Scarica l'elenco</p>
                <p class="mt-1 text-xs text-muted">
                    Puoi scaricare l'elenco aggiornato, se hai apportato delle modifiche.
                </p>
            </div>

            <a
                :href="membersFileHref"
                download="elenco_nomi.txt"
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
