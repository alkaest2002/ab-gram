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
    // The id of the member these stats belong to, used to look up their row in
    // `memberInEdges`.
    memberId: { type: [String, Number], default: null },
    // `getEdgeTypes` result, exposing `memberInEdges`.
    edgeTypes: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Relationship edge types T1..T6 (typeVII is intentionally omitted), each paired
// with the short label used on the page.
const EDGE_TYPE_CONFIG = [
    { key: "typeI", label: "T1" },
    { key: "typeII", label: "T2" },
    { key: "typeIII", label: "T3" },
    { key: "typeIV", label: "T4" },
    { key: "typeV", label: "T5" },
    { key: "typeVI", label: "T6" },
];

// `memberInEdges` is keyed by member id and holds a `{ cnt, pct }` per edge
// type: the number of the member's edges of that type (`cnt`) and its 0-1 share
// of the member's total edges (`pct`).
const edgeShares = (() => {
    const shares = props.edgeTypes?.memberInEdges?.[props.memberId] ?? {};
    return EDGE_TYPE_CONFIG.map(({ key, label }) => {
        const value = shares[key] ?? {};
        return {
            key,
            label,
            count: Number(value.cnt ?? 0),
            share: Number(value.pct ?? 0),
        };
    });
})();

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
                Relazioni
            </h3>
        </header>
        <div class="flex gap-[1mm]">
            <span
                v-for="item in edgeShares"
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
    </section>
</template>
