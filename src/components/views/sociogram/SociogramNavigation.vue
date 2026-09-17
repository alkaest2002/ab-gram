<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Utilities ----------

// --- Props --------------
defineProps({
    showPrevious: { type: Boolean, default: false },
    showNext: { type: Boolean, default: false },
    showRestart: { type: Boolean, default: false },
    enableRestart: { type: Boolean, default: false },
    enablePrevious: { type: Boolean, default: false },
    enableNext: { type: Boolean, default: false },
});

// --- Emits --------------
defineEmits([
    "sociogram-step-previous",
    "sociogram-step-next",
    "sociogram-step-restart",
]);

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="flex flex-wrap gap-2 justify-between mt-4">
        <div class="flex flex-wrap gap-2">
            <BaseButton
                variant="outline"
                :disabled="!enableRestart"
                @click="$emit('sociogram-step-restart')"
            >
                Ricomincia
            </BaseButton>
            <BaseButton
                v-show="showPrevious"
                variant="outline"
                :disabled="!enablePrevious"
                @click="$emit('sociogram-step-previous')"
                >Indietro
            </BaseButton>
        </div>
        <BaseButton
            v-show="showNext"
            variant="outline"
            :disabled="!enableNext"
            @click="$emit('sociogram-step-next')"
            >Avanti
        </BaseButton>
    </div>
</template>
