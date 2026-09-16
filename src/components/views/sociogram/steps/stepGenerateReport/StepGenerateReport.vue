<script setup>
import { useAppStore } from "@/stores/app";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

const app = useAppStore();

const { goPrevious, goNext, restart } = useSociogramNavigation("generateReport", false, emit);
</script>

<template>
    <section class="card space-y-5">
        <StepHeader eyebrow="Passaggio 3 di 3" title="Genera il report">
            Il calcolo della rete e la sua rappresentazione grafica arriveranno
            qui.
        </StepHeader>

        <p>
            <span class="tag tag-off"
                >shouldLockUI: {{ app.shouldLockUi }}</span
            >
        </p>
    </section>

    <SociogramNavigation
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="true"
        :enable-next="false"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
