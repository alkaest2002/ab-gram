<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From utils
import {
    memberIndexIn,
    metricIndexOf,
    readRaw,
    readRank,
} from "@/utils/memberStatsHelpers";

//   -- From relative
import BasePage from "../BasePage.vue";

// --- Props --------------
const props = defineProps({
    membersData: { type: Object, required: true },
    // Individual-level Moreno metrics (likes + dislikes combined), used only to
    // read the sociometric status code.
    morenoMetrics: { type: Object, default: () => ({}) },
    // Individual-level SNA metrics for the choice ("likes") network, used to
    // read the six centrality ranks shown as dots.
    snaMetrics: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Moreno's sociometric status codes (0-8 plus the unclassified fallback) with
// an Italian label and an emphasis tone drawn from the report palette.
const STATUS_CONFIG = {
    99: { label: "Non classificato", tone: "muted" },
    0: { label: "Isolato", tone: "muted" },
    1: { label: "Ignorato", tone: "muted" },
    2: { label: "Marginale", tone: "muted" },
    3: { label: "Apprezzato", tone: "accent" },
    4: { label: "Popolare", tone: "accent" },
    5: { label: "Malvisto", tone: "reject" },
    6: { label: "Rifiutato", tone: "reject" },
    7: { label: "Ambivalente", tone: "ink" },
    8: { label: "Controverso", tone: "ink" },
};

// Tone → text color utility classes. "accent" is the report's blue, "reject"
// its red; "ink" is near-black, so the status reads in one of the three colours
// described by the summary legend (blue / ink / red).
const STATUS_TONES = {
    accent: "text-accent",
    reject: "text-reject",
    ink: "text-ink",
    muted: "text-muted",
};

// The six centrality indicators, in the fixed reading order used by the row.
// They map the compact label to the real SNA metric key, matching the member
// metrics page.
const METRICS = [
    { label: "DG", key: "degreeCentrality" },
    { label: "PK", key: "PageRank" },
    { label: "CL", key: "closenessCentrality" },
    { label: "BT", key: "betweennessCentrality" },
    { label: "HA", key: "hitsAuthority" },
    { label: "HU", key: "hitsHub" },
];

// --- Composables --------

// --- Computed -----------
const members = computed(() => props.membersData?.members ?? []);

const cards = computed(() => members.value.map(buildCard));

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function buildCard(member) {
    const morenoIndex = memberIndexIn(member.id, props.morenoMetrics);
    const statusIndex = metricIndexOf(props.morenoMetrics, "ss");
    const statusCode =
        morenoIndex < 0 || statusIndex < 0
            ? 99
            : Number(readRaw(props.morenoMetrics, morenoIndex, statusIndex));
    const status = STATUS_CONFIG[statusCode] ?? STATUS_CONFIG[99];

    const snaIndex = memberIndexIn(member.id, props.snaMetrics);
    const metrics = METRICS.map(({ label, key }) => {
        const metricIndex = metricIndexOf(props.snaMetrics, key);
        const rank = Number(readRank(props.snaMetrics, snaIndex, metricIndex));
        return { label, active: rank === 1 || rank === 2 || rank === 3 };
    });

    return {
        id: member.id,
        name: member.name,
        statusLabel: status.label,
        statusClass: STATUS_TONES[status.tone],
        metrics,
    };
}
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt]">Sintesi</h2>
        </template>

        <template #default>
            <section class="h-full overflow-hidden">
                <div class="flex h-full flex-col">
                    <div
                        v-for="card in cards"
                        :key="card.id"
                        class="summary-row"
                    >
                        <div class="member-identity">
                            <span class="id-badge">{{ card.id }}</span>
                            <span class="min-w-0 truncate text-[8.5pt] text-ink">{{
                                card.name
                            }}</span>
                        </div>

                        <span
                            class="member-status text-[7.5pt]"
                            :class="card.statusClass"
                        >
                            {{ card.statusLabel }}
                        </span>

                        <div class="member-metrics">
                            <span
                                v-for="metric in card.metrics"
                                :key="metric.label"
                                class="metric"
                            >
                                <span class="metric-label">{{ metric.label }}</span>
                                <span
                                    class="metric-dot"
                                    :class="metric.active ? 'bg-accent' : 'bg-gray-300'"
                                ></span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </BasePage>
</template>

<style scoped>
/* One dense row per member, separated by a hairline: identity on the left, the
   coloured sociometric status in the middle, and the six centrality indicators
   as label + dot pairs on the right. Sizes stay in mm so the 35-member roster
   fits on a single A4 sheet when printed. */
.summary-row {
    display: flex;
    align-items: center;
    gap: 3mm;
    min-height: 6.6mm;
    border-bottom: 1px solid var(--color-line);
}

.member-identity {
    display: flex;
    align-items: center;
    gap: 1.5mm;
    min-width: 0;
    flex: 1 1 0;
}

.id-badge {
    display: inline-flex;
    height: 4.6mm;
    min-width: 6mm;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0 1mm;
    border: 1px solid var(--color-ink);
    border-radius: 0.25rem;
    font-family: var(--font-mono);
    font-size: 7pt;
    font-weight: 600;
    line-height: 1;
    color: var(--color-ink);
}

.member-status {
    flex-shrink: 0;
    width: 30mm;
    line-height: 1.1;
    font-weight: 500;
    white-space: nowrap;
}

.member-metrics {
    display: flex;
    align-items: center;
    gap: 3mm;
    flex-shrink: 0;
}

.metric {
    display: inline-flex;
    align-items: center;
    gap: 1.2mm;
}

.metric-label {
    font-family: var(--font-mono);
    font-size: 7pt;
    font-weight: 600;
    line-height: 1;
    color: var(--color-ink);
}

/* A small filled dot (not a circle with text inside): gray by default, accent
   blue when the member's rank for that metric is 1, 2 or 3. */
.metric-dot {
    width: 2.2mm;
    height: 2.2mm;
    flex-shrink: 0;
    border-radius: 9999px;
}
</style>
