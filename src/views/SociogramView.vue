<script setup>
import { RouterLink, RouterView } from "vue-router";

import PageTransition from "@/components/ui/PageTransition.vue";
import { sociogramRoutes } from "@/router";

const steps = sociogramRoutes;
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>

        <nav class="step-nav" aria-label="Passaggi dell'app">
            <RouterLink
                v-for="step in steps"
                :key="step.name"
                :to="{ name: step.name }"
                class="step-link"
                active-class="is-ancestor"
                exact-active-class="is-active"
            >
                {{ step.meta.title }}
            </RouterLink>
        </nav>

        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>
    </div>
</template>
