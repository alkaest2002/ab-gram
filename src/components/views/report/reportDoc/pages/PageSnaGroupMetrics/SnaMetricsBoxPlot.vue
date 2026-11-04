<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Props --------------
const props = defineProps({
  // Summary statistics for one degree direction: `{ min, q1, median, q3, max }`.
  value: { type: Object, default: () => ({}) },
});
</script>

<template>
  <table class="boxplot">
    <thead>
      <tr>
        <th>min</th>
        <th>q1</th>
        <th>med</th>
        <th>q3</th>
        <th>max</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ value.min }}</td>
        <td>{{ Math.round(value.q1 ?? 0) }}</td>
        <td>{{ value.median }}</td>
        <td>{{ Math.round(value.q3 ?? 0) }}</td>
        <td>{{ value.max }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
/* Table-like five-number summary: a wide (horizontal) header/value table with
   no graphical marks — just labelled columns for min, Q1, median, Q3 and max. */
.boxplot {
  display: inline-table;
  border-collapse: collapse;
  vertical-align: baseline;
}
.boxplot th {
  padding: 0 1.6mm 0.6mm;
  border-bottom: 1px solid var(--color-line);
  font-family: var(--font-mono);
  font-size: 6.5pt;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  text-align: center;
  white-space: nowrap;
}
.boxplot td {
  padding: 0.6mm 1.6mm 0;
  font-family: var(--font-display);
  font-size: 9pt;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--color-ink);
  text-align: center;
  white-space: nowrap;
}
</style>
