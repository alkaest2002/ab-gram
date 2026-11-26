<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, ref } from "vue";

import { memberIndexIn, metricIndexOf, readRaw, readRank } from "@/analysis/common/statsHelpers";

import SummaryRow from "./SummaryRow.vue";
import BasePage from "../BasePage.vue";

import { STATUS_UI } from "@/utils/report/sociometricStatusUI";

// --- Props --------------
const props = defineProps({
  membersData: { type: Object, required: true },
  // Individual-level Moreno metrics (likes + dislikes combined), used only to
  // read the sociometric status code.
  morenoMetrics: { type: Object, default: () => ({}) },
  // Individual-level SNA metrics for the choice ("likes") network, used to
  // read the centrality ranks shown as dots.
  snaMetrics: { type: Object, default: () => ({}) },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// The centrality indicators, in the fixed reading order used by the row.
// They map the compact label to the real SNA metric key, matching the member
// metrics page.
const CENTRALITY_METRICS_COMFIG = [
  { label: "DG", key: "inDegreeCentrality" },
  { label: "PK", key: "PageRank" },
  { label: "HA", key: "hitsAuthority" },
  { label: "HU", key: "hitsHub" },
  { label: "BT", key: "betweennessCentrality" },
  { label: "CL", key: "closenessCentrality" },
  { label: "BD", key: "closenessBroadcastCentrality" },
];

// Sortable columns for the summary list. Each maps a key to the label shown in
// the on-screen sort controls (which are hidden in the printed report).
const SORT_FIELDS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "status", label: "Status sociometrico" },
];

// The active ascending sort key (always one of the SORT_FIELDS keys).
const sortKey = ref("id");

// --- Composables --------

// --- Computed -----------
const members = computed(() => props.membersData?.members ?? []);

// Cards built once from the source data — independent of the active sort key.
const cards = computed(() => members.value.map(buildCard));

// A lightweight re-sort whenever `sortKey` changes; cards are NOT rebuilt.
const sortedCards = computed(() =>
  [...cards.value].sort((a, b) => compareCards(a, b, sortKey.value)),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function selectSort(key) {
  sortKey.value = key;
}

function compareCards(a, b, key) {
  switch (key) {
    case "id":
      return String(a.id).localeCompare(String(b.id), "it", {
        numeric: true,
        sensitivity: "base",
      });
    case "name":
      return String(a.name ?? "").localeCompare(String(b.name ?? ""), "it", {
        sensitivity: "base",
      });
    case "status":
      return compareStatus(a, b);
    default:
      return 0;
  }
}

function compareStatus(a, b) {
  // Sort by the soft label first, then by bonus, then by malus.
  const byLabel = String(a.statusLabel ?? "").localeCompare(String(b.statusLabel ?? ""), "it", {
    sensitivity: "base",
  });
  if (byLabel !== 0) return byLabel;

  const byBonus = a.bonus - b.bonus;
  if (byBonus !== 0) return byBonus;

  return a.malus - b.malus;
}

function buildCard(member) {
  const memberIndex = memberIndexIn(member.id, props.morenoMetrics);
  const statusIndex = metricIndexOf(props.morenoMetrics, "ss");
  const statusCode = readRaw(props.morenoMetrics, memberIndex, statusIndex);
  const status = STATUS_UI[statusCode] ?? STATUS_UI["NaN"];

  const bonus = readRaw(
    props.morenoMetrics,
    memberIndex,
    metricIndexOf(props.morenoMetrics, "bns"),
  );
  const malus = readRaw(
    props.morenoMetrics,
    memberIndex,
    metricIndexOf(props.morenoMetrics, "mls"),
  );

  const snaIndex = memberIndexIn(member.id, props.snaMetrics);
  const metrics = CENTRALITY_METRICS_COMFIG.map(({ label, key }) => {
    const metricIndex = metricIndexOf(props.snaMetrics, key);
    const rank = readRank(props.snaMetrics, snaIndex, metricIndex);
    return { label, active: rank === 1 || rank === 2 || rank === 3 };
  });

  return {
    id: member.id,
    name: member.name,
    statusLabel: status.labelSoft,
    statusClass: status.text,
    bonus,
    malus,
    metrics,
  };
}
</script>

<template>
  <BasePage>
    <template #pageTitle>
      <h2 id="summary" class="text-[16pt]">Sintesi</h2>
    </template>

    <template #default>
      <section class="h-full overflow-hidden">
        <div class="flex h-full flex-col">
          <!-- On-screen sort controls (hidden in the printed report). -->
          <div
            class="pb-[2.5mm] flex shrink-0 flex-wrap items-center gap-[2mm] border-b border-line justify-end"
          >
            <span class="text-[8pt] font-medium uppercase tracking-[0.06em] text-muted">
              Ordina:
            </span>
            <button
              v-for="field in SORT_FIELDS"
              :key="field.key"
              type="button"
              class="inline-flex items-center rounded-full px-[2.5mm] py-[0.6mm] text-[8pt] font-medium transition-colors"
              :class="sortKey === field.key ? 'bg-line' : 'bg-white'"
              :aria-pressed="sortKey === field.key"
              @click="selectSort(field.key)"
            >
              {{ field.label }}
            </button>
          </div>

          <div
            v-if="sortedCards.length"
            class="grid grid-cols-[minmax(0,1fr)_17mm_36mm_max-content] items-center gap-[3mm] min-h-[5mm] border-b border-line text-[8pt] font-medium text-muteid py-2"
          >
            <span>Membro</span>
            <span class="text-center font-mono">BNS/MLS</span>
            <span>Status sociometrico</span>
            <div class="grid grid-flow-col auto-cols-[6mm] place-items-center font-mono">
              <span v-for="metric in CENTRALITY_METRICS_COMFIG" :key="metric.key">{{
                metric.label
              }}</span>
            </div>
          </div>

          <SummaryRow
            v-for="card in sortedCards"
            :key="card.id"
            :card="card"
            :class="{ 'py-[1.5mm]': sortedCards.length < 25 }"
          />
        </div>
      </section>
    </template>
  </BasePage>
</template>
