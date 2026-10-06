<script setup>
// --- Vue ----------------
import { computed, ref } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import TextFileReader from "@/components/ui/TextFileReader.vue";
import StepLoadMembersResult from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembersResult.vue";
import StepLoadMembersListEditor from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembersListEditor.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { buildMembers, getMembersNameIssues, normalizeNames } from "@/utils/sociogram/memberHelpers";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart-app"]);

// --- State --------------
// Get the sociogram store and its state.
const sociogramStore = useSociogramStore();
const {
    maxMemberNameLength,
    maxMembersCount,
    hasMembers,
    members,
} = storeToRefs(sociogramStore);

const loadError = ref(null);
const loadedCount = ref(null);

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

function onFileSelected() {
    loadError.value = null;
    loadedCount.value = null;
}

function onFileRead({ lines }) {
    const normalizedNames = normalizeNames(lines).sort();
    const loadedMembers = buildMembers(normalizedNames);

    sociogramStore.initMembers(loadedMembers);
    loadedCount.value = loadedMembers.length;
}

function onFileReadError({ message }) {
    loadError.value = message;
}
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

        <TextFileReader
            :max-line-length="maxMemberNameLength"
            :max-lines="maxMembersCount"
            @file-selected="onFileSelected"
            @file-read="onFileRead"
            @file-read-error="onFileReadError"
        >
            <template #label>Carica il file</template>
            Il file deve contenere un elenco di nomi, uno per riga.
        </TextFileReader>

        <StepLoadMembersResult
            :error="loadError"
            :loaded-count="loadedCount"
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
        @sociogram-navigation-previous="goToStep('start')"
        @sociogram-navigation-next="goToStep('setPreferences')"
        @sociogram-navigation-restart="restart"
    />
</template>
