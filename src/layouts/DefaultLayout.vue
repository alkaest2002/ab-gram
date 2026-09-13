<script setup>
import { RouterView } from "vue-router";

import AppFooter from "@/components/layout/AppFooter.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import PageTransition from "@/components/ui/PageTransition.vue";
</script>

<template>
    <!-- min-h-dvh + flex-1 on main: every page covers the viewport and overflows when needed. -->
    <div class="flex min-h-dvh flex-col">

        <!-- Header -->
        <AppHeader />

        <!-- Content -->
        <main class="flex-1">
            <RouterView v-slot="{ Component }">
                <PageTransition>
                    <component :is="Component" />
                </PageTransition>
            </RouterView>
        </main>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>
