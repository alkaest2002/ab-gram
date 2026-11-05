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
  typeOfSna: {
    type: String,
    required: true,
    validator: (value) => ["likes", "dislikes"].includes(value),
  },
  structures: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Single source of truth for the page: per-type titles and the fixed reading
// order of structure categories. The two preference types share the same
// structure taxonomy, so only the page title changes.
const SNA_STRUCTURE_CONFIG = {
  titles: {
    likes: "Strutture interne alla rete delle scelte",
    dislikes: "Strutture della rete dei rifiuti",
  },
  categories: [
    { key: "dyads", label: "Diadi" },
    { key: "cliques", label: "Clique" },
    { key: "weakComponents", label: "Componenti debolmente connesse" },
    { key: "strongComponents", label: "Componenti fortemente connesse" },
    {
      key: "strongComponentsWithReciprocalEdges",
      label: "Componenti fortemente connesse con legami reciproci",
    },
  ],
};

const pageTitle = SNA_STRUCTURE_CONFIG.titles[props.typeOfSna] ?? SNA_STRUCTURE_CONFIG.titles.likes;

// `structures` maps each structure type to an object exposing its `structures`
// list (each structure being a list of member ids). A missing/empty prop
// degrades to empty lists.
const categories = SNA_STRUCTURE_CONFIG.categories.map((category) => ({
  ...category,
  structures: props.structures?.[category.key]?.structures ?? [],
}));

// Louvain communities are a partition of the group with an associated
// modularity Q value, reported next to the section title.
const louvainCommunities = props.structures?.louvainCommunities?.structures ?? [];
const louvainModularity = props.structures?.louvainCommunities?.modularity ?? null;

const formatQ = (value) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return `Q = ${Number(value).toFixed(3)}`;
};

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <BasePage>
    <template #pageTitle>
      <h2 class="text-[16pt]">{{ pageTitle }}</h2>
    </template>

    <template #default>
      <div class="flex h-full flex-col gap-[6mm] overflow-hidden">
        <section v-for="category in categories" :key="category.key" class="shrink-0">
          <header class="flex items-baseline justify-between border-b border-line">
            <h3 class="font-mono text-[9pt] font-medium tracking-[0.08em] text-muted uppercase">
              {{ category.label }}
            </h3>
            <span class="font-mono text-[9pt] font-semibold text-ink">
              {{ category.structures.length }}
            </span>
          </header>

          <div v-if="category.structures.length" class="pt-[2mm]">
            <div class="flex flex-wrap gap-[1.5mm]">
              <span
                v-for="(structure, index) in category.structures"
                :key="`${category.key}-${index}`"
                class="inline-flex items-center rounded-lg border-gray-200 bg-gray-200 px-[2.5mm] font-mono text-[9pt] font-semibold text-muted"
                :class="{ 'py-[1mm]': structure.length > 24 }"
              >
                {{ structure.join(" · ") }}
              </span>
            </div>
          </div>

          <p v-else class="pt-[2mm] font-mono text-[9pt] text-muted italic">
            nessuna struttura di questo tipo
          </p>
        </section>

        <section class="shrink-0">
          <header class="flex items-baseline justify-between border-b border-line">
            <h3 class="font-mono text-[9pt] font-medium tracking-[0.08em] text-muted uppercase">
              Comunità di Louvain ({{ formatQ(louvainModularity) }})
            </h3>
            <span class="font-mono text-[9pt] font-semibold text-ink">
              {{ louvainCommunities.length }}
            </span>
          </header>

          <div v-if="louvainCommunities.length" class="pt-[2mm]">
            <div class="flex flex-wrap gap-[1.5mm]">
              <span
                v-for="(community, index) in louvainCommunities"
                :key="`louvain-${index}`"
                class="inline-flex items-center rounded-lg border-gray-200 bg-gray-200 px-[2.5mm] font-mono text-[9pt] font-semibold text-muted"
                :class="{ 'py-[1mm]': community.length > 24 }"
              >
                {{ community.join(" · ") }}
              </span>
            </div>
          </div>

          <p v-else class="pt-[2mm] font-mono text-[9pt] text-muted italic">
            nessuna comunità di questo tipo
          </p>
        </section>
      </div>
    </template>
  </BasePage>
</template>
