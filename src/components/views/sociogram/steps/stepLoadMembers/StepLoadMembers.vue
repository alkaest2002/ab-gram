<script setup>
// --- Vue ----------------
import { computed, ref } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/common/SociogramNavigation.vue";
import TextFileReader from "@/components/ui/TextFileReader.vue";
import LoadMembersResult from "@/components/views/sociogram/steps/stepLoadMembers/LoadMembersResult.vue";
import LoadMembersOrderNamesRadioGroup from "@/components/views/sociogram/steps/stepLoadMembers/LoadMembersOrderNamesRadioGroup.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import {
    buildMembers,
    normalizeNames,
    orderNames,
} from "@/utils/sociogram/memberHelpers";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
]);

// --- State --------------
// Get the sociogram store and its state.
const sociogramStore = useSociogramStore();
const { maxMemberNameLength, maxMembersCount, membersCount } =
    storeToRefs(sociogramStore);

const loadFileName = ref("");
const loadError = ref(null);
const loadedCount = ref(null);

// How imported names are ordered: "as-is" keeps the file order,
// "alphabetical" sorts them lexicographically, "shuffle" randomizes them.
const orderMode = ref("as-is");

const { goToStep, restart } = useSociogramNavigation(emit);

// --- Computed -----------
// The load step only needs at least one member to advance. Blank or duplicated
// names are reviewed and fixed in the following "manage members" step.
const hasLoaded = computed(() => membersCount.value > 0);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function onFileSelected({ filename }) {
    loadFileName.value = filename;
    loadError.value = null;
    loadedCount.value = null;
}

function onFileRead({ lines }) {
    const normalizedNames = normalizeNames(lines);
    const orderedNames = orderNames(normalizedNames, orderMode.value);

    const loadedMembers = buildMembers(orderedNames);

    sociogramStore.initMembers(loadedMembers);
    loadedCount.value = loadedMembers.length;
}

function onFileReadError({ message }) {
    loadError.value = message;
}
</script>

<template>
    <section class="card space-y-6">
        <StepHeader eyebrow="Passaggio 1 di 4" title="Carica l'elenco dei nominativi">
            Il file di testo deve contenere un elenco di nominativi, per un massimo di {{ sociogramStore.maxMembersCount }}. Ogni nominativo &egrave; limitato a {{ sociogramStore.maxMemberNameLength }} caratteri.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <LoadMembersOrderNamesRadioGroup v-model="orderMode" />

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <TextFileReader
            :max-line-length="maxMemberNameLength"
            :max-lines="maxMembersCount"
            @file-selected="onFileSelected"
            @file-read="onFileRead"
            @file-read-error="onFileReadError"
        >
            <template #label>{{ membersCount > 0 ? "Carica un altro file" : "Carica il file" }}</template>
            Elenco dei nominativi (es., Rossi Mario), uno per riga.
        </TextFileReader>

        <LoadMembersResult
            :filename="loadFileName"
            :error="loadError"
            :loaded-count="loadedCount"
        />
    </section>

    <SociogramNavigation
        :enable-previous="true"
        :enable-next="hasLoaded"
        :enable-archive="hasLoaded"
        :enable-restart="hasLoaded"
        @sociogram-navigation-previous="goToStep('start')"
        @sociogram-navigation-next="goToStep('manageMembers')"
        @sociogram-navigation-restart="restart"
    />
</template>
