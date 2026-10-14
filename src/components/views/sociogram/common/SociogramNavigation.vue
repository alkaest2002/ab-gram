<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseTooltip from "@/components/ui/BaseTooltip.vue";

// --- Composables --------
import { useDownload } from "@/composables/useDownload";
const { downloadJson } = useDownload();

// --- Props --------------
defineProps({
    showPrevious: { type: Boolean, default: true },
    showNext: { type: Boolean, default: true },
    showRestart: { type: Boolean, default: true },
    showArchive: { type: Boolean, default: true },
    enablePrevious: { type: Boolean, default: false },
    enableNext: { type: Boolean, default: false },
    enableRestart: { type: Boolean, default: false },
    enableArchive: { type: Boolean, default: false },
});

// --- Emits --------------
defineEmits([
    "sociogram-navigation-archive",
    "sociogram-navigation-next",
    "sociogram-navigation-previous",
    "sociogram-navigation-restart",
]);

// --- State --------------
const sociogramStore = useSociogramStore();

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------

const handleDownload = () => {
    const jsonData = sociogramStore.$state;
    downloadJson(jsonData, "sociogram-data", "text/encoded", true, true);
};
</script>

<template>
    <div class="flex flex-wrap gap-2 justify-between mt-4">
        <div class="flex flex-wrap gap-2">
            <BaseTooltip v-show="showRestart" label="Ricomincia da capo">
                <BaseButton
                    buttonVariant="outline"
                    :disabled="!enableRestart"
                    aria-label="Ricomincia da capo"
                    @click="$emit('sociogram-navigation-restart')"
                >
                    <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                        <path d="M21 3v6h-6" />
                    </svg>
                </BaseButton>
            </BaseTooltip>

            <BaseTooltip v-show="showArchive" label="Scarica archivio">
                <BaseButton
                    buttonVariant="outline"
                    :disabled="!enableArchive"
                    aria-label="Scarica archivio"
                    @click="handleDownload"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 15V3" />
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="m7 10 5 5 5-5" />
                    </svg>
                </BaseButton>
            </BaseTooltip>

            <BaseTooltip v-show="showPrevious" label="Passaggio precedente">
                <BaseButton
                    buttonVariant="outline"
                    :disabled="!enablePrevious"
                    @click="$emit('sociogram-navigation-previous')"
                >
                    <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Indietro
                </BaseButton>
            </BaseTooltip>
        </div>

        <BaseTooltip v-show="showNext" label="Passaggio successivo">
            <BaseButton
                buttonVariant="outline"
                :disabled="!enableNext"
                @click="$emit('sociogram-navigation-next')"
            >
                <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="M9 6l6 6-6 6" />
                </svg>
                Avanti
            </BaseButton>
        </BaseTooltip>
    </div>
</template>
