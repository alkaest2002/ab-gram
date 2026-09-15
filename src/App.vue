<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";

import { useAppStore } from "@/stores/app";

import PageTransition from "@/components/ui/PageTransition.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import NotFoundLayout from "@/components/layouts/NotFoundLayout.vue";

// Register every layout here under the name stored in `app.layout`.
const layouts = {
    DefaultLayout,
    NotFoundLayout,
};

const appStore = useAppStore();

const currentLayout = computed(() => layouts[appStore.layout] ?? DefaultLayout);
</script>

<template>
    <component :is="currentLayout">
        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>
    </component>
</template>
