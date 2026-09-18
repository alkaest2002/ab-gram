<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Utilities ----------
import { useSociogramDownloadArchive } from "@/composables/sociogram/useSociogramDownloadArchive";

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
    "sociogram-step-previous",
    "sociogram-step-next",
    "sociogram-step-restart",
    "sociogram-step-archive",
]);

// --- State --------------
const { downloadArchive } = useSociogramDownloadArchive();

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="flex flex-wrap gap-2 justify-between mt-4">
        <div class="flex flex-wrap gap-2">
            <BaseButton
                v-show="showRestart"
                variant="outline"
                :disabled="!enableRestart"
                @click="$emit('sociogram-step-restart')"
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

            <BaseButton
                v-show="showArchive"
                variant="outline"
                :disabled="!enableArchive"
                @click="downloadArchive"
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
                    <rect x="2" y="3" width="20" height="5" rx="1" />
                    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                    <path d="M10 12h4" />
                </svg>
            </BaseButton>

            <BaseButton
                v-show="showPrevious"
                variant="outline"
                :disabled="!enablePrevious"
                @click="$emit('sociogram-step-previous')"
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
        </div>

        <BaseButton
            v-show="showNext"
            variant="outline"
            :disabled="!enableNext"
            @click="$emit('sociogram-step-next')"
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
    </div>
</template>
