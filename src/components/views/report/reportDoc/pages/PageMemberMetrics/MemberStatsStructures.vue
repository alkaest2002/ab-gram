<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From utils
import { formatShare } from "@/utils/memberStatsHelpers";

// --- Props --------------
const props = defineProps({
    // The id of the member these stats belong to, used to test their presence in
    // each component list.
    memberId: { type: [String, Number], default: null },
    // `getSnaStructures` result for the choice ("likes") network, exposing the
    // component lists per category.
    likesComponents: { type: Object, default: () => ({}) },
    // `getSnaStructures` result for the rejection ("dislikes") network, exposing
    // the component lists per category.
    dislikesComponents: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// SNA component categories, each paired with the short label used on the page.
const COMPONENT_CONFIG = [
    { key: "dyads", label: "DYD" },
    { key: "cliques", label: "CLQ" },
    { key: "weakComponents", label: "WCC" },
    { key: "strongComponents", label: "SCC" },
    { key: "strongComponentsWithReciprocalEdges", label: "SCM" },
    { key: "louvainCommunities", label: "LVN" },
];

// Each component category is a list of components, where a component is a list
// of member ids. Louvain communities are nested under `communities` alongside a
// modularity `q`, so that category is read through its `communities` list. The
// shares count how many of that category's components contain the member
// (`cnt`) and the 0-1 fraction it is present in (`pct`).
const buildComponentShares = (components, prefix) => {
    return COMPONENT_CONFIG.map(({ key, label }) => {
        const list =
            key === "louvainCommunities"
                ? components?.[key]?.communities ?? []
                : components?.[key] ?? [];
        const count = list.filter((component) => component.includes(props.memberId)).length;
        const share = list.length === 0 ? 0 : count / list.length;
        return {
            key: `${prefix}-${key}`,
            label: `${prefix}-${label}`,
            count,
            share,
        };
    });
};

// The component stats render as a single row for the likes network.
const componentRows = [
  {
    name: "likes",
    shares: buildComponentShares(props.likesComponents, "L")
  },
];

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <section class="min-w-0">
        <header class="mb-[2mm] border-b border-line pb-[0.5mm]">
            <h3 class="font-mono text-[9pt] font-bold uppercase tracking-[0.08em]">
                Strutture interne
            </h3>
        </header>
        <div class="flex flex-col gap-[1mm]">
            <div
                v-for="row in componentRows"
                :key="row.name"
                class="flex gap-[1mm]"
            >
                <span
                    v-for="item in row.shares"
                    :key="item.key"
                    class="flex flex-1 items-center justify-between rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
                >
                    <span
                        class="font-mono text-[9pt] font-medium text-muted"
                        >{{ item.label }}</span
                    >
                    <span class="flex items-center gap-[1mm]">
                        <span
                            class="font-mono text-[9pt] font-semibold leading-none"
                            >{{ item.count }}</span
                        >
                        <span
                            class="font-mono text-[7pt] leading-none text-muted"
                            >{{ formatShare(item.share) }}</span
                        >
                    </span>
                </span>

            </div>
        </div>
    </section>
</template>
