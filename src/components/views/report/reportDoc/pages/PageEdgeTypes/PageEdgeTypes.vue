<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From relative.
import BasePage from "../BasePage.vue";

// --- Props --------------
const props = defineProps({
  edgeTypes: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// The seven relationship types are shown in a fixed reading order, grouped by
// the three severity tiers used in the analysis. Each edge is presented as the
// directed `A -> B` pair it is stored as, with no de-duplication of mutual
// types: typeI and typeIV therefore list both `[A, B]` and `[B, A]`.
const EDGE_TYPES_CONFIG = [
  {
    key: "healthy",
    label: "Relazioni sane",
    borderColor: "border-accent",
    labelColor: "text-accent",
    barColor: "bg-accent",
    types: [
      { key: "typeI", label: "Scelte reciproche" },
      { key: "typeII", label: "Scelte non reciproche" },
    ],
  },
  {
    key: "potentiallyProblematic",
    label: "Relazioni potenzialmente problematiche",
    borderColor: "border-orange-800",
    labelColor: "text-orange-800",
    barColor: "bg-orange-800",
    types: [{ key: "typeIII", label: "Rifiuti non reciproci" }],
  },
  {
    key: "problematic",
    label: "Relazioni problematiche",
    borderColor: "border-reject",
    labelColor: "text-reject",
    barColor: "bg-reject",
    types: [
      { key: "typeIV", label: "Rifiuti reciproci" },
      { key: "typeV", label: "Scelte contraccambiate da rifiuti" },
      { key: "typeVI", label: "Rifiuti contraccambiati da scelte" },
      { key: "typeVII", label: "Scelte e rifiuti insieme" },
    ],
  },
];

// `edgeTypes` maps each type key to the list of its `[aId, bId]` pairs. A
// missing/empty prop degrades to empty lists, so every type still renders.
const categories = EDGE_TYPES_CONFIG.map((category) => {
  const types = category.types.map((type) => ({
    ...type,
    edges: toDisplayEdges(props.edgeTypes?.[type.key] ?? []),
  }));

  return {
    ...category,
    types,
    total: types.reduce((sum, type) => sum + type.edges.length, 0),
  };
});

// --- Composables --------

// --- Computed -----------

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
        <section v-for="category in categories" :key="category.key" class="shrink-0 pl-[1mm]">
          <header class="flex items-baseline justify-between border-b border-line pb-[2mm]">
            <h3
              class="inline-flex items-center gap-[1.5mm] font-mono text-[9pt] font-semibold tracking-[0.08em] uppercase"
              :class="category.labelColor"
            >
              <span
                class="inline-block h-[2.5mm] w-[2.5mm] rounded-full"
                :class="category.barColor"
              ></span>
              {{ category.label }}
            </h3>
            <span class="font-mono text-[9pt] font-semibold text-ink">
              {{ category.total }}
            </span>
          </header>

          <div class="pt-[1.5mm]">
            <div
              v-for="type in category.types"
              :key="type.key"
              class="pt-[2mm] first:pt-0 mb-[1.5mm]"
            >
              <div class="flex items-baseline justify-between">
                <p class="font-mono text-[8pt] font-medium text-muted">
                  {{ type.edges.length }} {{ type.label }}
                </p>
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
            </div>
          </div>
        </section>
      </div>
    </template>
  </BasePage>
</template>
