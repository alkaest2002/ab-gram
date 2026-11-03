<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

//   -- From utils.
import {
    memberIndexIn,
    metricIndexOf,
    readRaw,
    formatValue,
} from "@/utils/memberStatsHelpers";

// --- Props --------------
const props = defineProps({
    // The id of the member these stats belong to, used to look up their row in
    // the Moreno metric object's `ids` array.
    memberId: { type: [String, Number], default: null },
    // Individual-level Moreno metrics (likes + dislikes combined).
    morenoMetrics: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Moreno's sociometric status codes (0-8) with an Italian label, a short reading
// and an emphasis tone from the report's accent/reject/ink/muted palette.
const STATUS_CONFIG = {
    99: {
        label: "Non classificato",
        description: "",
        tone: "muted",
    },
    0: {
        label: "Isolato",
        description: "nessuna scelta ricevuta né espressa.",
        tone: "muted",
    },
    1: {
        label: "Ignorato",
        description: "ha espresso scelte ma non ne ha ricevute.",
        tone: "muted",
    },
    2: {
        label: "Marginale",
        description: "riceve poche attenzioni.",
        tone: "muted",
    },
    3: {
        label: "Apprezzato",
        description: "impatto medio con bilancio positivo.",
        tone: "accent",
    },
    4: {
        label: "Popolare",
        description: "impatto alto con bilancio positivo.",
        tone: "accent",
    },
    5: {
        label: "Malvisto",
        description: "impatto medio con bilancio negativo.",
        tone: "reject",
    },
    6: {
        label: "Rifiutato",
        description: "impatto alto con bilancio negativo.",
        tone: "reject",
    },
    7: {
        label: "Ambivalente",
        description: "impatto medio con bilancio neutro.",
        tone: "ink",
    },
    8: {
        label: "Controverso",
        description: "impatto alto con bilancio neutro.",
        tone: "ink",
    },
};

const STATUS_TONES = {
    accent: {
        bar: "bg-accent",
        text: "text-accent",
    },
    reject: {
        bar: "bg-reject",
        text: "text-reject",
    },
    ink: {
        bar: "bg-ink",
        text: "text-ink",
    },
    muted: {
        bar: "bg-muted",
        text: "text-muted",
    },
};

// --- Composables --------

// --- Computed -----------
const sociometricStatus = computed(() => {
    const metrics = props.morenoMetrics;
    const memberIndex = memberIndexIn(props.memberId, metrics);
    const metricIndex = metricIndexOf(metrics, "ss");
    if (memberIndex < 0 || metricIndex < 0) return null;

    const code = Number(readRaw(metrics, memberIndex, metricIndex));
    const config = STATUS_CONFIG[code];
    if (!config) return null;

    return { code, ...config, tone: STATUS_TONES[config.tone] };
});

const receivedLikesScore = computed(() => {
    const metrics = props.morenoMetrics;
    const memberIndex = memberIndexIn(props.memberId, metrics);
    const metricIndex = metricIndexOf(metrics, "bns");
    return Number(readRaw(metrics, memberIndex, metricIndex));
});

const receivedDislikesScore = computed(() => {
    const metrics = props.morenoMetrics;
    const memberIndex = memberIndexIn(props.memberId, metrics);
    const metricIndex = metricIndexOf(metrics, "mls");
    return Number(readRaw(metrics, memberIndex, metricIndex));
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <section v-if="sociometricStatus" class="min-w-0 mt-6">
        <header class="mb-[2mm] border-b border-line pb-[0.5mm]">
            <h3 class="font-mono text-[9pt] font-bold uppercase tracking-[0.08em]">
                Status sociometrico
            </h3>
        </header>

        <div class="flex items-center justify-between gap-[2.5mm]">
            <div class="min-w-0">
                <p class="font-display leading-none">
                    <span
                        class="font-medium text-[10pt]"
                        :class="sociometricStatus.tone.text"
                        >{{ sociometricStatus.label }}</span
                    >
                    <span class="text-[9pt] text-muted mx-2">&rarr;</span>
                    <span class="text-[9pt] text-muted">{{
                        sociometricStatus.description
                    }}</span>
                </p>
            </div>
            <div class="flex shrink-0 items-center gap-[1mm]">
                <span
                    class="flex items-center gap-[1mm] rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
                >
                    <span class="font-mono text-[9pt] font-medium text-muted"
                        >BNS</span
                    >
                    <span class="font-mono text-[9pt] font-semibold leading-none">{{
                        formatValue(receivedLikesScore)
                    }}</span>
                </span>
                <span
                    class="flex items-center gap-[1mm] rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
                >
                    <span class="font-mono text-[9pt] font-medium text-muted"
                        >MLS</span
                    >
                    <span class="font-mono text-[9pt] font-semibold leading-none">{{
                        formatValue(receivedDislikesScore)
                    }}</span>
                </span>
            </div>
        </div>
    </section>
</template>
