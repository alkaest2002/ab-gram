<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------
const props = defineProps({
    // Summary statistics for one degree direction: `{ min, max, median, iqr }`.
    value: { type: Object, default: () => ({}) },
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
// Position (0-100) of the median along the min→max range, for the median
// bar and its value label.
function medianPercent() {
    const min = Number(props.value?.min ?? 0);
    const max = Number(props.value?.max ?? 0);
    const median = Number(props.value?.median ?? 0);
    const span = max - min;

    if (span === 0) return 50;
    return ((median - min) / span) * 100;
}

function medianStyle() {
    return { left: `${medianPercent()}%` };
}

function formatBoxCount(value) {
    return String(Math.round(Number(value ?? 0)));
}

function formatBoxDecimal(value) {
    const n = Number(value ?? 0);
    if (Number.isInteger(n)) return String(n);
    return String(Number(n.toFixed(2))).replace(".", ",");
}
</script>

<template>
    <div class="boxplot">
        <div class="boxplot-row">
            <span class="boxplot-end text-ink">{{ formatBoxCount(value.min) }}</span>
            <div class="boxplot-track">
                <div class="boxplot-line bg-ink"></div>
                <div class="boxplot-median bg-ink" :style="medianStyle()"></div>
                <span class="boxplot-median-label text-ink" :style="medianStyle()">{{ formatBoxCount(value.median) }}</span>
                <span class="boxplot-iqr text-ink">(IQR {{ formatBoxDecimal(value.iqr) }})</span>
            </div>
            <span class="boxplot-end text-ink">{{ formatBoxCount(value.max) }}</span>
        </div>
    </div>
</template>

<style scoped>
/* Degree box plot: a horizontal range line (min→max), a median bar and the
   min/median/max values, with the IQR printed underneath. */
.boxplot {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 3mm;
    padding-bottom: 3mm;
}
.boxplot-row {
    display: flex;
    align-items: center;
    gap: 1mm;
}
.boxplot-end {
    font-size: 7pt;
    font-variant-numeric: tabular-nums;
    line-height: 1;
}
.boxplot-track {
    position: relative;
    width: 24mm;
    height: 4mm;
}
.boxplot-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-50%);
}
.boxplot-median {
    position: absolute;
    top: 1mm;
    bottom: 1mm;
    width: 1.5px;
}
.boxplot-median-label {
    position: absolute;
    top: -2.5mm;
    transform: translateX(-50%);
    font-size: 7pt;
    line-height: 1;
    white-space: nowrap;
}
.boxplot-iqr {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.75mm;
    font-size: 7pt;
    line-height: 1;
    white-space: nowrap;
}
</style>
