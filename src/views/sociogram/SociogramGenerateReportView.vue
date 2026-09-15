<script setup>
import { useAppStore } from "@/stores/app";
import SociogramNavigation from "@/components/sociogram/SociogramNavigation.vue";
import StepHeader from "@/components/ui/StepHeader.vue";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

const emit = defineEmits(["sociogram-change-component"])

const app = useAppStore();

const { showPrevious, showNext, showRestart, goPrevious, goNext, restart } =
    useSociogramNavigation("generateReport", false, emit);
</script>

<template>
    <section class="card space-y-5">
        <StepHeader eyebrow="Passaggio 3 di 3" title="Genera il report">
            Il calcolo della rete e la sua rappresentazione grafica arriveranno
            qui.
        </StepHeader>

        <p>
            <span class="tag tag-off"
                >shouldLockUI: {{ app.shouldLockUI }}</span
            >
        </p>
    </section>

    <SociogramNavigation
        :show-previous="showPrevious"
        :show-next="showNext"
        :show-restart="showRestart"
        :enable-previous="true"
        :enable-next="false"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
