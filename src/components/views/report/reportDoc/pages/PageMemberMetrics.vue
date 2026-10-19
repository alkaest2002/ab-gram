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
    // The member this page reports on (`{ id, name, ... }`).
    member: { type: Object, default: null },
    // The Moreno ego plot for this member (`{ memberId, svg }`).
    egoPlot: { type: Object, default: null },
    // Individual-level Moreno metrics (likes + dislikes combined).
    morenoMetrics: { type: Object, default: () => ({}) },
    // Individual-level SNA metrics for the choice ("likes") network.
    snaMetrics: { type: Object, default: () => ({}) },
    // `getEdgeTypes` result, exposing `memberInEdges`.
    edgeTypes: { type: Object, default: () => ({}) },
    // `getSnaComponents` result, exposing `memberInComponents`.
    components: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- State --------------
// The metric chips are listed in a fixed reading order (not the dataframe column
// order). The first twelve are Moreno's individual sociometric indices, the last
// six the SNA centrality block. Each entry maps a short label to the real metric
// key so a chip can read "gp 10 (1/10)" while the data is keyed "gp"/"PageRank".
const METRIC_ROWS = [
    [
        { label: "GP", key: "gp", source: "moreno" },
        { label: "RP", key: "rp", source: "moreno" },
        { label: "MP", key: "mp", source: "moreno" },
        { label: "GR", key: "gr", source: "moreno" },
        { label: "RR", key: "rr", source: "moreno" },
        { label: "MR", key: "mr", source: "moreno" },
    ],
    [
        { label: "IM", key: "im", source: "moreno" },
        { label: "BL", key: "bl", source: "moreno" },
        { label: "EI", key: "ei", source: "moreno" },
        { label: "OR", key: "or", source: "moreno" },
        { label: "AI", key: "ai", source: "moreno" },
        { label: "II", key: "ii", source: "moreno" },
    ],
    [
        { label: "DG", key: "degreeCentrality", source: "sna" },
        { label: "CL", key: "closenessCentrality", source: "sna" },
        { label: "BT", key: "betweennessCentrality", source: "sna" },
        { label: "PK", key: "PageRank", source: "sna" },
        { label: "HA", key: "hitsAuthority", source: "sna" },
        { label: "HU", key: "hitsHub", source: "sna" },
    ],
];

// Relationship edge types T1..T6 (typeVII is intentionally omitted) and the SNA
// component categories, each paired with the short label used on the page.
const EDGE_TYPE_CONFIG = [
    { key: "typeI", label: "T1" },
    { key: "typeII", label: "T2" },
    { key: "typeIII", label: "T3" },
    { key: "typeIV", label: "T4" },
    { key: "typeV", label: "T5" },
    { key: "typeVI", label: "T6" },
];

const COMPONENT_CONFIG = [
    { key: "dyads", label: "DYD" },
    { key: "cliques", label: "CLQ" },
    { key: "weakComponents", label: "WCC" },
    { key: "strongComponents", label: "SCC" },
    { key: "strongComponentsWithReciprocalEdges", label: "SCM" },
];

// Moreno's sociometric status codes (0-8) with an Italian label, a short reading
// and an emphasis tone from the report's accent/reject/ink/muted palette.
const STATUS_CONFIG = {
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

// --- Computed -----------

// Row index of this member inside a metric object's `ids` array.
const memberIndexIn = (metrics) => {
    if (props.member.id == null) return -1;
    return (metrics?.ids ?? []).indexOf(props.member.id);
};

// Column index of a metric key inside a metric object's `metrics` array.
const metricIndexOf = (metrics, key) => (metrics?.metrics ?? []).indexOf(key);

function readRaw(metrics, memberIndex, metricIndex) {
    if (memberIndex < 0 || metricIndex < 0) return 0;
    return metrics?.rawValuesById?.[memberIndex]?.[metricIndex] ?? 0;
}

function readRank(metrics, memberIndex, metricIndex) {
    if (memberIndex < 0 || metricIndex < 0) return 0;
    return metrics?.rankedValuesById?.[memberIndex]?.[metricIndex] ?? 0;
}

// Highest dense rank for a metric: `rankedValuesByMetric[m]` is the rank column,
// so its maximum is the denominator of the "rank / max rank" chip suffix.
function readMaxRank(metrics, metricIndex) {
    const column = metrics?.rankedValuesByMetric?.[metricIndex] ?? [];
    if (!column.length) return 0;
    return Math.max(...column);
}

function buildChip(label, key, source) {
    const metrics =
        source === "moreno" ? props.morenoMetrics : props.snaMetrics;
    const memberIndex = memberIndexIn(metrics);
    const metricIndex = metricIndexOf(metrics, key);

    return {
        label,
        raw: readRaw(metrics, memberIndex, metricIndex),
        rank: readRank(metrics, memberIndex, metricIndex),
        maxRank: readMaxRank(metrics, metricIndex),
    };
}

// Metric chips grouped by row (Moreno indices then SNA centralities). Each row
// holds six chips so the page lays out exactly six metrics per line.
const metricChips = computed(() =>
    METRIC_ROWS.map((row) =>
        row.map(({ label, key, source }) => buildChip(label, key, source)),
    ),
);

// `memberInEdges` is keyed by member id and holds a 0-1 share per edge type.
const edgeShares = computed(() => {
    const shares = props.edgeTypes?.memberInEdges?.[props.member.id] ?? {};
    return EDGE_TYPE_CONFIG.map(({ key, label }) => ({
        key,
        label,
        value: Number(shares[key] ?? 0),
    }));
});

// `memberInComponents` is keyed by member id and holds a 0-1 presence fraction
// per component category.
const componentShares = computed(() => {
    const shares = props.components?.memberInComponents?.[props.member.id] ?? {};
    return COMPONENT_CONFIG.map(({ key, label }) => ({
        key,
        label,
        value: Number(shares[key] ?? 0),
    }));
});

const status = computed(() => {
    const metrics = props.morenoMetrics;
    const memberIndex = memberIndexIn(metrics);
    const metricIndex = metricIndexOf(metrics, "ss");
    if (memberIndex < 0 || metricIndex < 0) return null;

    const code = Number(readRaw(metrics, memberIndex, metricIndex));
    const config = STATUS_CONFIG[code];
    if (!config) return null;

    return { code, ...config, tone: STATUS_TONES[config.tone] };
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
// Raw values are whole numbers for the Moreno indices and decimals in [0, 1]
// for the SNA centralities; show integers verbatim and trim floats to 2 decimals
// so the compact chips stay readable.
function formatValue(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    if (Number.isInteger(num)) return String(num);
    return String(Math.round(num * 100) / 100);
}

// `memberInEdges` / `memberInComponents` hold 0-1 fractions; present as a whole
// percentage (a single decimal would be noise on these dense chips).
function formatShare(value) {
    return `${Math.round(Number(value) * 100)}%`;
}
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt] truncate">
                <span class="text-muted">Membro {{ props.member.id }}  |</span> {{ props.member.name }}
            </h2>
        </template>

        <template #default>
            <div v-if="egoPlot?.svg" class="member-layout">
                <!-- TOP: the ego graph. -->
                <div class="top-band flex flex-col">
                    <div
                        class="ego-svg min-h-0 flex-1 overflow-hidden"
                        v-html="egoPlot.svg"
                    ></div>
                </div>

                <!-- BOTTOM: four stacked rows. -->
                <div class="bottom-band flex flex-col gap-y-[4mm]">

                    <!-- Row 1: metrics. -->
                    <section class="min-w-0">
                        <header
                            class="mb-[2mm] border-b border-line pb-[0.5mm]"
                        >
                            <h3
                                class="font-mono text-[10pt] font-bold uppercase tracking-[0.08em] text-muted"
                            >
                                Metriche
                            </h3>
                        </header>

                        <div class="flex flex-col gap-[1mm]">
                            <div
                                v-for="(row, rowIndex) in metricChips"
                                :key="rowIndex"
                                class="flex gap-[1mm]"
                            >
                                <span
                                    v-for="chip in row"
                                    :key="chip.label"
                                    class="flex flex-1 items-center justify-between gap-[1mm] rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
                                >
                                    <span
                                        class="flex min-w-0 items-center gap-[1mm]"
                                    >
                                        <span
                                            class="font-mono text-[9pt] font-medium text-muted"
                                            >{{ chip.label }}</span
                                        >
                                        <span
                                            class="font-mono text-[7.5pt] font-semibold text-ink"
                                            >{{ formatValue(chip.raw) }}</span
                                        >
                                    </span>
                                    <span
                                        class="inline-flex shrink-0 items-center gap-[0.4mm] rounded bg-gray-200 px-[1mm] py-[0.3mm] text-ink"
                                    >
                                        <span
                                            class="font-mono text-[9pt] font-bold leading-none"
                                            >{{ chip.rank }}</span
                                        >
                                        <span
                                            class="font-mono text-[5.5pt] leading-none text-muted"
                                            >{{ chip.maxRank }}</span
                                        >
                                    </span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <!-- Row 2: edge types. -->
                    <section class="min-w-0">
                        <header
                            class="mb-[2mm] border-b border-line pb-[0.5mm]"
                        >
                            <h3
                                class="font-mono text-[9pt] font-bold uppercase tracking-[0.08em] text-muted"
                            >
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
                                <span
                                    class="font-mono text-[9pt] font-semibold leading-none text-ink"
                                    >{{ formatShare(item.value) }}</span
                                >
                            </span>
                        </div>
                    </section>

                    <!-- Row 3: component categories. -->
                    <section class="min-w-0">
                        <header
                            class="mb-[2mm] border-b border-line pb-[0.5mm]"
                        >
                            <h3
                                class="font-mono text-[9pt] font-bold uppercase tracking-[0.08em] text-muted"
                            >
                                Componenti
                            </h3>
                        </header>
                        <div class="flex gap-[1mm]">
                            <span
                                v-for="item in componentShares"
                                :key="item.key"
                                class="flex flex-1 items-center justify-between rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
                            >
                                <span
                                    class="font-mono text-[9pt] font-medium text-muted"
                                    >{{ item.label }}</span
                                >
                                <span
                                    class="font-mono text-[7.5pt] font-semibold leading-none text-ink"
                                    >{{ formatShare(item.value) }}</span
                                >
                            </span>
                            <span
                                v-if="componentShares.length"
                                class="invisible flex flex-1 items-center justify-between rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
                                aria-hidden="true"
                            >
                                <span
                                    class="font-mono text-[9pt] font-medium text-muted"
                                    >{{ componentShares[componentShares.length - 1].label }}</span
                                >
                                <span
                                    class="font-mono text-[7.5pt] font-semibold leading-none text-ink"
                                    >{{ formatShare(componentShares[componentShares.length - 1].value) }}</span
                                >
                            </span>
                        </div>
                    </section>

                    <!-- Row 4: sociometric status. -->
                    <section v-if="status" class="min-w-0">
                        <header
                            class="mb-[2mm] border-b border-line pb-[0.5mm]"
                        >
                            <h3
                                class="font-mono text-[9pt] font-bold uppercase tracking-[0.08em] text-muted"
                            >
                                Stato sociometrico
                            </h3>
                        </header>

                        <div
                            class="flex items-center gap-[2.5mm]"
                        >
                            <div class="min-w-0">
                                <p
                                    class="font-display leading-none"
                                >
                                    <span class="font-medium text-[10pt]" :class="status.tone.text">{{ status.label }}</span> &middot; <span class="text-[10pt]">{{ status.description }}</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <p v-else class="font-mono text-[9pt] text-muted italic">
                nessun grafico ego disponibile
            </p>
        </template>
    </BasePage>
</template>

<style scoped>
.member-layout {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.top-band {
    flex: 0 0 65%;
    min-height: 0;
}
.bottom-band {
    flex: 1 1 0;
    min-height: 0;
}

.ego-svg :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
