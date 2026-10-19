<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BasePage from "./BasePage.vue";

// --- Composables --------

// --- Props --------------
const props = defineProps({
    edgeTypes: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- State --------------
// The seven relationship types are shown in a fixed reading order, grouped by
// the three severity tiers used in the analysis. Each edge is presented as the
// directed `A -> B` pair it is stored as, with no de-duplication of mutual
// types: typeI and typeIV therefore list both `[A, B]` and `[B, A]`.
const EDGE_TYPES = {
    typeI: { label: "Scelte reciproche" },
    typeII: { label: "Scelte non reciproche" },
    typeIII: { label: "Rifiuti non reciproci" },
    typeIV: { label: "Rifiuti reciproci" },
    typeV: { label: "Scelte contraccambiate da rifiuti" },
    typeVI: { label: "Rifiuti contraccambiati da scelte" },
    typeVII: { label: "Scelte e rifiuti insieme" },
};

// The three tiers are the headline of this page, so each one gets its own
// emphasis colour. The palette stays within the site's two accents plus ink:
// blue for healthy, black for potentially problematic, red for problematic.
const CATEGORIES = [
    {
        key: "healthy",
        label: "Relazioni sane",
        tone: "accent",
        types: ["typeI", "typeII"],
    },
    {
        key: "potentiallyProblematic",
        label: "Relazioni potenzialmente problematiche",
        tone: "ink",
        types: ["typeIII"],
    },
    {
        key: "problematic",
        label: "Relazioni problematiche",
        tone: "reject",
        types: ["typeIV", "typeV", "typeVI", "typeVII"],
    },
];

const TONE_CLASSES = {
    accent: { borderColor: "border-accent", labelColor: "text-accent", barColor: "bg-accent" },
    ink: { borderColor: "border-ink", labelColor: "text-ink", barColor: "bg-ink" },
    reject: { borderColor: "border-reject", labelColor: "text-reject", barColor: "bg-reject" },
};

// --- Computed -----------
// `edgeTypes` maps each type key to the list of its `[aId, bId]` pairs. A
// missing/empty prop degrades to empty lists, so every type still renders.
const categories = CATEGORIES.map((category) => {
    const tone = TONE_CLASSES[category.tone];

    const types = category.types.map((key) => ({
        key,
        label: EDGE_TYPES[key].label,
        edges: toDisplayEdges(props.edgeTypes?.[key] ?? []),
    }));

    return {
        key: category.key,
        label: category.label,
        total: types.reduce((sum, type) => sum + type.edges.length, 0),
        types,
        ...tone,
    };
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
// Convert raw `[aId, bId]` pairs into display chips.
function toDisplayEdges(edges) {
    return edges.map(([a, b]) => ({ key: `${a}→${b}`, text: `${a} → ${b}` }));
}
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt]">Tipi di relazione</h2>
        </template>

        <template #default>
            <div class="flex h-full flex-col gap-[6mm] overflow-hidden">


                <section
                    v-for="category in categories"
                    :key="category.key"
                    class="shrink-0 pl-[2.5mm]"
                >
                    <header class="flex items-baseline justify-between border-b border-line pb-[1mm]">
                        <h3
                            class="inline-flex items-center gap-[1.5mm] font-mono text-[9pt] font-semibold tracking-[0.08em] uppercase"
                            :class="category.labelColor"
                        >
                            <span class="inline-block h-[2.5mm] w-[2.5mm] rounded-full" :class="category.barColor"></span>
                            {{ category.label }}
                        </h3>
                        <span class="font-mono text-[9pt] font-semibold text-ink">
                            {{ category.total }}
                        </span>
                    </header>

                    <div class="pt-[1.5mm]">
                        <div v-for="type in category.types" :key="type.key" class="pt-[1mm] first:pt-0 mb-[1.5mm]">

                            <div class="flex items-baseline justify-between">
                                <p class="font-mono text-[8pt] font-medium text-muted">{{ type.edges.length }} {{ type.label }}</p>
                            </div>

                            <div v-if="type.edges.length" class="mt-[1mm] flex flex-wrap gap-[1.5mm]">
                                <span
                                    v-for="edge in type.edges"
                                    :key="edge.key"
                                    class="inline-flex items-center rounded-lg border-gray-200 bg-gray-200 px-[2.5mm] font-mono text-[9pt] font-semibold text-muted"
                                >
                                    {{ edge.text }}
                                </span>
                            </div>

                            <p v-else class="mt-[0.5mm] font-mono text-[8pt] text-muted italic">
                                nessuna relazione
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </template>
    </BasePage>
</template>
