<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From vue-router
import { useRoute, RouterView } from "vue-router";

//   -- From components
import AppContentTransition from "@/components/ui/AppContentTransition.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import EmptyLayout from "@/components/layouts/EmptyLayout.vue";
import ReportLayout from "@/components/layouts/ReportLayout.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------
const route = useRoute();

// --- Stores -------------

// --- State --------------
const layouts = {
    DefaultLayout,
    EmptyLayout,
    ReportLayout,
};

// --- Composables --------

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
