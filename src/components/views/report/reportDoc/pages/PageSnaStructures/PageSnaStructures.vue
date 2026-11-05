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
// Per-type presentation details. The two preference types share the same
// structure taxonomy, so only the page title changes.
const SNA_CONFIG = {
  likes: {
    pageTitle: "Strutture interne alla rete delle scelte",
  },
  dislikes: {
    pageTitle: "Strutture della rete dei rifiuti",
  },
};

// The categories are shown in a fixed reading order (not the DataFrame column
// order), so the structure lists are looked up by key rather than by position.
const CATEGORIES = [
  { key: "dyads", label: "Diadi" },
  { key: "cliques", label: "Clique" },
  { key: "weakComponents", label: "Componenti debolmente connesse" },
  { key: "strongComponents", label: "Componenti fortemente connesse" },
  {
    key: "strongComponentsWithReciprocalEdges",
    label: "Componenti fortemente connesse con legami reciproci",
  },
];

const config = SNA_CONFIG[props.typeOfSna] ?? SNA_CONFIG.likes;

// `structures` maps each structure type to the list of its structures (each
// structure being a list of member ids). A missing/empty prop degrades to
// empty lists.
const categories = CATEGORIES.map((category) => ({
  ...category,
  structures: props.structures?.[category.key] ?? [],
}));

// Louvain communities are a partition of the group with an associated
// modularity Q value, reported next to the section title.
const louvainCommunities = props.structures?.louvainCommunities?.communities ?? [];
const louvainQ = props.structures?.louvainCommunities?.q ?? null;

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
              Comunità di Louvain ({{ formatQ(louvainQ) }})
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
