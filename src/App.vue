<script setup>
import { computed } from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import NotFoundLayout from "@/layouts/NotFoundLayout.vue";
import { useAppStore } from "@/stores/app";

// Register every layout here under the name stored in `app.layout`.
const layouts = {
    DefaultLayout,
    NotFoundLayout,
};

const appStore = useAppStore();

const currentLayout = computed(() => layouts[appStore.layout] ?? DefaultLayout);
</script>

<template>
    <component :is="currentLayout" />
</template>
