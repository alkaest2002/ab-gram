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
// dot and its value label. No clamping here: the `.boxplot` container provides
// horizontal padding, so the dot can sit exactly on min/max and still overhang
// without being clipped.
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


</script>

<template>
    <div class="boxplot">
        <div class="boxplot-track">
            <div class="boxplot-line bg-ink"></div>
            <div class="boxplot-median bg-ink" :style="medianStyle()"></div>
            <span class="boxplot-median-label text-ink" :style="medianStyle()">{{ formatBoxCount(value.median) }}</span>
            <span class="boxplot-min text-ink">{{ formatBoxCount(value.min) }}</span>
            <span class="boxplot-iqr text-ink">IQR {{ formatBoxCount(value.iqr) }}</span>
            <span class="boxplot-max text-ink">{{ formatBoxCount(value.max) }}</span>
        </div>
    </div>
</template>

<style scoped>
/* Degree box plot: a horizontal range line (min→max) with a median dot (and its
   value above); min, IQR and max are printed below the line. */
.boxplot {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* Horizontal padding gives the median dot (and its label) room to overhang
       the line's endpoints when the median equals the min or the max. */
    padding: 3mm 2mm 3.5mm;
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
    height: 2px;
    transform: translateY(-50%);
    border-radius: 3px;
}
.boxplot-median {
    position: absolute;
    top: 50%;
    width: 2mm;
    height: 2mm;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}
.boxplot-median-label {
    position: absolute;
    top: -2.5mm;
    transform: translateX(-50%);
    font-size: 7pt;
    line-height: 1;
    white-space: nowrap;
}
.boxplot-min {
    position: absolute;
    top: 100%;
    left: 0;
    transform: translateX(-50%);
    margin-top: 0.75mm;
    font-size: 7pt;
    font-variant-numeric: tabular-nums;
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
.boxplot-max {
    position: absolute;
    top: 100%;
    right: 0;
    transform: translateX(50%);
    margin-top: 0.75mm;
    font-size: 7pt;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
}
</style>
