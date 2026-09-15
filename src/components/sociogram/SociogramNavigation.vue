<script setup>
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps({
    showPrevious: { type: Boolean, default: false },
    showNext: { type: Boolean, default: false },
    showRestart: { type: Boolean, default: false },
    enableRestart: { type: Boolean, default: false },
    enablePrevious: { type: Boolean, default: false },
    enableNext: { type: Boolean, default: false },
});

defineEmits([
    "sociogram-step-previous",
    "sociogram-step-next",
    "sociogram-step-restart",
]);
</script>

<template>
    <div class="flex flex-wrap gap-2 justify-between mt-4">
        <div class="flex flex-wrap gap-2">
            <BaseButton
                v-show="showPrevious"
                variant="outline"
                :disabled="!enablePrevious"
                @click="$emit('sociogram-step-previous')"
                >Indietro
            </BaseButton>
            <BaseButton
                v-show="showNext"
                variant="outline"
                :disabled="!enableNext"
                @click="$emit('sociogram-step-next')"
                >Avanti
            </BaseButton>
        </div>
        <BaseButton
            v-show="showRestart"
            variant="outline"
            :disabled="!enableRestart"
            @click="$emit('sociogram-step-restart')"
        >
            Ricomincia
        </BaseButton>
    </div>
</template>
