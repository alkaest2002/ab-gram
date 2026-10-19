<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BasePage from "./BasePage.vue";

// --- Composables --------

// --- Props --------------
const props = defineProps({
    typeOfSna: {
        type: String,
        required: true,
        validator: (value) => ["likes", "dislikes"].includes(value),
    },
    components: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- State --------------
// Per-type presentation details. The two preference types share the same
// component taxonomy, so only the page title changes.
const SNA_CONFIG = {
    likes: {
        pageTitle: "Componenti della rete delle scelte",
    },
    dislikes: {
        pageTitle: "Componenti della rete dei rifiuti",
    },
};

// The categories are shown in a fixed reading order (not the DataFrame column
// order), so the component lists are looked up by key rather than by position.
const CATEGORIES = [
    { key: "dyads", label: "Diadi" },
    { key: "cliques", label: "Clique" },
    { key: "weakComponents", label: "Componenti debolmente connesse" },
    { key: "strongComponents", label: "Componenti fortemente connesse" },
    { key: "strongComponentsWithReciprocalEdges", label: "Componenti fortemente reciproche" },
];

// --- Computed -----------
const config = computed(() => SNA_CONFIG[props.typeOfSna] ?? SNA_CONFIG.likes);

// `components` maps each component type to the list of its components (each
// component being a list of member ids). A missing/empty prop degrades to
// empty lists.
const categories = computed(() =>
    CATEGORIES.map((category) => ({
        ...category,
        components: props.components?.[category.key] ?? [],
    })),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt]">{{ config.pageTitle }}</h2>
        </template>

        <template #default>
            <div class="flex h-full flex-col gap-[6mm] overflow-hidden">
                <section v-for="category in categories" :key="category.key" class="shrink-0">
                    <header class="flex items-baseline justify-between border-b border-line">
                        <h3 class="font-mono text-[9pt] font-medium tracking-[0.08em] text-muted uppercase">
                            {{ category.label }}
                        </h3>
                        <span class="font-mono text-[9pt] font-semibold text-ink">
                            {{ category.components.length }}
                        </span>
                    </header>

                    <div v-if="category.components.length" class="pt-[2mm]">
                        <div class="flex flex-wrap gap-[1.5mm]">
                            <span
                                v-for="(component, index) in category.components"
                                :key="`${category.key}-${index}`"
                                class="inline-flex items-center rounded-lg border-gray-200 bg-gray-200 px-[2.5mm] font-mono text-[9pt] font-semibold text-muted"
                                :class="{'py-[1mm]': component.length > 24}"
                            >
                                {{ component.join(" · ") }}
                            </span>
                        </div>
                    </div>

                    <p v-else class="pt-[2mm] font-mono text-[9pt] text-muted italic">
                        nessuna componente di questo tipo
                    </p>
                </section>
            </div>
        </template>
    </BasePage>
</template>
