<script setup>
// --- Vue ----------------
import { computed, ref } from "vue";

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import TextFileReader from "@/components/ui/TextFileReader.vue";
import StepImportFromArchiveResult from "@/components/views/sociogram/steps/stepImportFromArchive/StepImportFromArchiveResult.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart-app"]);

// --- State --------------
const sociogramStore = useSociogramStore();

const importError = ref(null);
const importedCount = ref(null);

const { validate } = useSociogramValidateData();
const { goToStep, restart } = useSociogramNavigation(emit);

// --- Computed -----------
const hasImported = computed(() => importedCount.value !== null);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
// Base64-decode a UTF-8 string, mirroring `encodeBase64` in useSociogramDownloadArchive.
function decodeBase64(value) {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function onFileSelected() {
    importError.value = null;
    importedCount.value = null;
}

function onFileRead({ lines }) {
    try {
        const json = decodeBase64(lines.join("").trim());
        const parsed = JSON.parse(json);

        const result = validate(parsed);
        if (!result.valid) {
            importError.value = result.error;
            return;
        }

        // Replace the store state with the validated snapshot: reset first, then
        // copy each known state key out of the loaded json.
        sociogramStore.resetMembers();
        for (const key of Object.keys(sociogramStore.$state)) {
            if (key in result.data) {
                sociogramStore.$state[key] = result.data[key];
            }
        }

        importedCount.value = result.data.members.length;
    } catch {
        importError.value = "Il file non è un archivio sociogramma valido.";
    }
}

function onFileReadError({ message }) {
    importError.value = message;
}
</script>

<template>
    <section class="card space-y-6">
        <StepHeader
            eyebrow="Passaggio 1 di 3"
            title="Vuoi riprendere un progetto archiviato?"
        >
            Se hai già salvato un sociogramma, puoi ricaricarlo da un file
            archiviato. In alternativa prosegui per crearne uno nuovo.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <TextFileReader
            @file-selected="onFileSelected"
            @file-read="onFileRead"
            @file-read-error="onFileReadError"
        >
            <template #label>Importa da file</template>
            Il file deve contenere un archivio valido.
        </TextFileReader>

        <StepImportFromArchiveResult
            :error="importError"
            :imported-count="importedCount"
        />
    </section>

    <SociogramNavigation
        :enable-previous="true"
        :enable-next="hasImported"
        :enable-archive="hasImported"
        :enable-restart="hasImported"
        @sociogram-navigation-previous="goToStep('start')"
        @sociogram-navigation-next="goToStep('loadMembers')"
        @sociogram-navigation-restart="restart"
    />
</template>
