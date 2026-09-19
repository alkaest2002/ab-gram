<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------
import { useRoute, RouterView } from "vue-router";

// --- Stores -------------

// --- Components ---------
import TransitionRouter from "@/components/ui/TransitionRouter.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import EmptyLayout from "@/components/layouts/EmptyLayout.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const layouts = {
    DefaultLayout,
    EmptyLayout,
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
            <TransitionRouter>
                <component :is="Component" />
            </TransitionRouter>
        </RouterView>
    </component>
</template>
