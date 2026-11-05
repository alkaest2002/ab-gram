<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From utils.
import { formatShare } from "@/utils/report/memberStatsHelpers";

// --- Props --------------
const props = defineProps({
  // The id of the member these stats belong to, used to test their presence in
  // each structure list.
  memberId: { type: [String, Number], default: null },
  // `getSnaStructures` result for the choice ("likes") network, exposing the
  // structure lists per category.
  likesStructures: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// SNA structure categories, each paired with the short label used on the page.
const STRUCTURES_CONFIG = [
  { key: "dyads", label: "L-DYD" },
  { key: "cliques", label: "L-CLQ" },
  { key: "weakComponents", label: "L-WCC" },
  { key: "strongComponents", label: "L-SCC" },
  { key: "strongComponentsWithReciprocalEdges", label: "L-SCM" },
  { key: "louvainCommunities", label: "L-LVN" },
];

// Each structure category is a list of structures, where a structure is a list
// of member ids. Louvain communities are nested under `communities` alongside a
// modularity `q`, so that category is read through its `communities` list. The
// shares count how many of that category's structures contain the member
// (`cnt`) and the 0-1 fraction it is present in (`pct`).
const structureShares = STRUCTURES_CONFIG.map(({ key, label }) => {
  const list =
    key === "louvainCommunities"
      ? (props.likesStructures?.[key]?.communities ?? [])
      : (props.likesStructures?.[key] ?? []);
  const count = list.filter((structure) => structure.includes(props.memberId)).length;
  const share = list.length === 0 ? 0 : count / list.length;
  return { key, label, count, share };
});

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <section class="min-w-0">
    <header class="mb-[2mm] border-b border-line pb-[0.5mm]">
      <h3 class="font-mono text-[9pt] font-bold uppercase tracking-[0.08em]">Strutture interne</h3>
    </header>
    <div class="flex flex-col gap-[1mm]">
      <div class="flex gap-[1mm]">
        <span
          v-for="item in structureShares"
          :key="item.key"
          class="flex flex-1 items-center justify-between rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
        >
          <span class="font-mono text-[9pt] font-medium text-muted">{{ item.label }}</span>
          <span class="flex items-center gap-[1mm]">
            <span class="font-mono text-[9pt] font-semibold leading-none">{{ item.count }}</span>
            <span class="font-mono text-[7pt] leading-none text-muted">{{
              formatShare(item.share)
            }}</span>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>
