<script setup>
import { computed } from "vue";
import { useRoute, RouterView } from "vue-router";

import PageTransition from "@/components/ui/PageTransition.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import EmptyLayout from "@/components/layouts/EmptyLayout.vue";

const layouts = {
    DefaultLayout,
    EmptyLayout,
};

const route = useRoute();
const layout = computed(() => layouts[route.meta.layout] ?? DefaultLayout);
</script>

<template>
    <component :is="layout">
        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>
    </component>
</template>
