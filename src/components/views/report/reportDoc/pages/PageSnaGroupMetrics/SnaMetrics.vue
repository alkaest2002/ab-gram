<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
    // Rows to render: `{ key, label, kind, value }`, assembled by the container.
    rows: { type: Array, default: () => [] },
    // Accent color for the ratio bars.
    accentColor: { type: String, default: "" },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function formatValue(row) {
    if (row.kind === "ratio") {
        // One decimal, Italian comma separator (e.g. 0.214 -> "21,4%").
        const percent = (Number(row.value) * 100).toFixed(1).replace(".", ",");
        return `${percent}%`;
    }

    return String(Math.round(Number(row.value)));
}

function ratioPercent(row) {
    if (row.kind !== "ratio") return 0;
    return Math.max(0, Math.min(100, Number(row.value) * 100));
}
</script>

<template>
    <div class="sna-stats pt-1">
        <table class="w-full text-left">
            <tbody>
                <tr v-for="row in rows" :key="row.key" class="align-baseline">
                    <td
                        class="py-[1.5mm] pr-[4mm] font-mono text-[8pt] font-medium tracking-[0.08em] text-muted uppercase"
                    >
                        {{ row.label }}
                    </td>
                    <td class="py-[1.5mm] text-right">
                        <div class="font-display text-[12pt] font-bold text-ink whitespace-nowrap">
                            {{ formatValue(row) }}
                        </div>
                        <div
                            v-if="row.kind === 'ratio'"
                            class="mt-[0.75mm] h-0.5 w-full overflow-hidden rounded-full bg-line"
                        >
                            <div
                                class="h-full rounded-full"
                                :style="{ width: `${ratioPercent(row)}%`, backgroundColor: accentColor }"
                            ></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
/* Stats band: 40% of the content cell, vertically centered. */
.sna-stats {
    flex: 0 0 40%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
