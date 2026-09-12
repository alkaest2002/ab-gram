<script setup>
import BaseButton from "@/components/ui/BaseButton.vue";
import StepHeader from "@/components/ui/StepHeader.vue";
</script>

<template>
    <section class="card space-y-5">
        <StepHeader
            eyebrow="Punto di partenza"
            title="Da dove vuoi cominciare?"
        >
            Due strade per lo stesso risultato: leggere prima come funziona,
            oppure entrare subito nel primo passaggio.
        </StepHeader>

        <div class="flex flex-wrap gap-2">
            <BaseButton variant="soft" to="/docs"
                >Leggi la documentazione</BaseButton
            >
            <BaseButton :to="{ name: 'load-members' }"
                >Vai al primo passaggio</BaseButton
            >
        </div>
    </section>
</template>
