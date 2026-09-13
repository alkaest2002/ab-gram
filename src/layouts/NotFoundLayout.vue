<script setup>
import { RouterView } from "vue-router";

import PageTransition from "@/components/ui/PageTransition.vue";
</script>

<template>
    <!-- Minimal chrome for error pages: no header or footer, just centered content. -->
    <main class="grid min-h-dvh place-items-center px-6">
        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>
    </main>
</template>
