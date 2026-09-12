<script setup>
import StepHeader from "@/components/ui/StepHeader.vue";
</script>

<template>
    <section class="card space-y-5">
        <StepHeader eyebrow="Passaggio 2 di 3" title="Imposta le preferenze">
            Qui ogni membro indicherà le proprie preferenze positive
            (<code>likes</code>) e negative (<code>dislikes</code>).
        </StepHeader>

        <p class="text-sm text-muted">
            Nessuna logica di raccolta è ancora collegata.
        </p>
    </section>
</template>
