<script setup>
import { storeToRefs } from "pinia";

import BaseButton from "@/components/ui/BaseButton.vue";
import { useSociogramStore } from "@/stores/sociogram";

const sociogram = useSociogramStore();

const { hasPreviousSociogramStep, hasNextSociogramStep } = storeToRefs(sociogram);
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <BaseButton
            variant="outline"
            :disabled="!hasPreviousSociogramStep"
            @click="sociogram.goToPreviousSociogramStep()"
        >
            Indietro
        </BaseButton>

        <BaseButton
            :disabled="!hasNextSociogramStep"
            @click="sociogram.goToNextSociogramStep()"
        >
            Avanti
        </BaseButton>
    </div>
</template>
