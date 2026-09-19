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

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart-app"]);

// --- State --------------
const sociogramStore = useSociogramStore();

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
        sociogramStore.resetMembers();
        for (const key of Object.keys(sociogramStore.$state)) {
            if (key in result.data) {
                sociogramStore.$state[key] = result.data[key];
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

            <div
                v-if="fileName"
                class="inline-flex max-w-full items-center gap-2 rounded-md border border-line px-2.5 py-1.5"
            >
                <svg
                    viewBox="0 0 24 24"
                    class="size-4 shrink-0 fill-none stroke-current stroke-[1.75] text-muted"
                    aria-hidden="true"
                >
                    <path
                        d="M7 3.5h7l4 4v13H7z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M14 3.5V8h4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <span class="truncate font-mono text-xs font-medium text-ink">
                    {{ fileName }}
                </span>
            </div>

            <div
                v-if="hasImported"
                class="flex items-start gap-3 rounded-lg border border-line p-3"
                role="status"
            >
                <span
                    class="grid size-8 shrink-0 place-items-center rounded-md border border-line text-accent"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-4 fill-none stroke-current stroke-[1.75]"
                    >
                        <path
                            d="M5 12.5l4.5 4.5L19 7.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </span>
                <div class="min-w-0 pt-0.5">
                    <p class="text-sm font-medium text-ink">Caricamento riuscito</p>
                    <p class="text-sm text-muted">{{ importedSummary }}.</p>
                </div>
            </div>

            <div
                v-if="importError"
                class="flex items-start gap-3 rounded-lg border border-line p-3"
                role="alert"
            >
                <span
                    class="grid size-8 shrink-0 place-items-center rounded-md border border-line text-reject"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-4 fill-none stroke-current stroke-[1.75]"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="13"
                            stroke-linecap="round"
                        />
                        <circle
                            cx="12"
                            cy="16"
                            r="0.5"
                            fill="currentColor"
                            stroke="none"
                        />
                    </svg>
                </span>
                <div class="min-w-0 pt-0.5">
                    <p class="text-sm font-medium text-ink">Caricamento non riuscito</p>
                    <p class="text-sm text-muted">{{ importError }}</p>
                </div>
            </div>
        </div>

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
