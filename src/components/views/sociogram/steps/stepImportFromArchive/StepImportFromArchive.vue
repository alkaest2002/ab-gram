<script setup>
// --- Vue ----------------
import { computed, ref } from "vue";

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";

// --- Utilities ----------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

// --- State --------------
const sociogram = useSociogramStore();

const fileInput = ref(null);
const fileName = ref("");
const isReading = ref(false);
const importError = ref(null);
const importedCount = ref(null);

const { validate } = useSociogramValidateData();

// --- Computed -----------
const hasImported = computed(() => importedCount.value !== null);

const importedSummary = computed(() => {
    if (importedCount.value === null) return "";
    const label = importedCount.value === 1 ? "membro importato" : "membri importati";
    return `${importedCount.value} ${label}`;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const { goToStep, restart } = useSociogramNavigation(emit);

function pick() {
    fileInput.value?.click();
}

// Base64-decode a UTF-8 string, mirroring `encodeBase64` in useSociogramDownloadArchive.
function decodeBase64(value) {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

async function onFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    fileName.value = file?.name ?? "";
    importError.value = null;
    importedCount.value = null;

    if (!file) return;

    isReading.value = true;

    try {
        const base64 = (await file.text()).trim();
        const json = decodeBase64(base64);
        const parsed = JSON.parse(json);

        const result = validate(parsed);
        if (!result.valid) {
            importError.value = result.error;
            return;
        }

        // Replace the store state with the validated snapshot: reset first, then
        // copy each known state key out of the loaded json.
        sociogram.resetMembers();
        for (const key of Object.keys(sociogram.$state)) {
            if (key in result.data) {
                sociogram.$state[key] = result.data[key];
            }
        }

        importedCount.value = result.data.members.length;
    } catch {
        importError.value = "Il file non è un archivio sociogramma valido.";
    } finally {
        isReading.value = false;
        // Reset the input so selecting the same file again fires `change` again.
        if (fileInput.value) fileInput.value.value = "";
    }
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

        <div class="space-y-3">
            <input
                ref="fileInput"
                type="file"
                accept=".txt,text/plain"
                class="sr-only"
                aria-label="Carica un file di archivio sociogramma"
                @change="onFileChange"
            />

            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="eyebrow">Importa da file</p>
                    <p class="mt-1 text-sm text-muted">
                        Il file deve contenere un archivio valido.
                    </p>
                </div>

                <BaseButton variant="solid" :disabled="isReading" @click="pick">
                    {{ isReading ? "Lettura…" : "Scegli file" }}
                </BaseButton>
            </div>

            <p v-if="fileName" class="text-sm text-muted">
                File selezionato: {{ fileName }}
            </p>

            <p v-if="hasImported" class="text-sm text-accent" role="status">
                {{ importedSummary }}.
            </p>

            <p v-if="importError" class="text-sm text-reject" role="alert">
                {{ importError }}
            </p>
        </div>

    </section>

    <SociogramNavigation
        :enable-previous="true"
        :enable-next="hasImported"
        @sociogram-step-previous="goToStep('start')"
        @sociogram-step-next="goToStep('generateReport')"
        @sociogram-step-restart="restart"
    />
</template>
