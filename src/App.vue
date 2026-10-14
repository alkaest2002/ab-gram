<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------
import { useRoute, RouterView } from "vue-router";

// --- Stores -------------

// --- Components ---------
import AppContentTransition from "@/components/ui/AppContentTransition.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import EmptyLayout from "@/components/layouts/EmptyLayout.vue";
import ReportLayout from "@/components/layouts/ReportLayout.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const layouts = {
    DefaultLayout,
    EmptyLayout,
    ReportLayout,
};

const route = useRoute();

// --- Computed -----------
const layout = computed(() => layouts[route.meta.layout] ?? DefaultLayout);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <component :is="layout">
        <RouterView v-slot="{ Component }">
            <AppContentTransition appear>
                <component :is="Component" />
            </AppContentTransition>
        </RouterView>
    </component>
</template>
