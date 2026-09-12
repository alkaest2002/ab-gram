<script setup>
import { useAppStore } from "@/stores/app";
import StepHeader from "@/components/ui/StepHeader.vue";

const app = useAppStore();
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
</template>
