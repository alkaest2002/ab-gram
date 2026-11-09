<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed, ref } from "vue";

//   -- From utils.
import {
  memberIndexIn,
  metricIndexOf,
  readRaw,
  readRank,
  formatValue,
} from "@/utils/report/memberStatsHelpers";

//   -- From relative.
import BasePage from "../BasePage.vue";

//   -- From utils.
import { STATUS_UI } from "@/utils/report/sociometricStatusUI";

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

// The six centrality indicators, in the fixed reading order used by the row.
// They map the compact label to the real SNA metric key, matching the member
// metrics page.
const CENTRALITY_METRICS_COMFIG = [
  { label: "DG", key: "inDegreeCentrality" },
  { label: "PK", key: "PageRank" },
  { label: "CL", key: "closenessCentrality" },
  { label: "BT", key: "betweennessCentrality" },
  { label: "HA", key: "hitsAuthority" },
  { label: "HU", key: "hitsHub" },
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
  const statusCode =
    memberIndex < 0 || statusIndex < 0
      ? 99
      : Number(readRaw(props.morenoMetrics, memberIndex, statusIndex));
  const status = STATUS_UI[statusCode] ?? STATUS_UI[99];

  const bonus = Number(
    readRaw(props.morenoMetrics, memberIndex, metricIndexOf(props.morenoMetrics, "bns")),
  );
  const malus = Number(
    readRaw(props.morenoMetrics, memberIndex, metricIndexOf(props.morenoMetrics, "mls")),
  );

  const snaIndex = memberIndexIn(member.id, props.snaMetrics);
  const metrics = CENTRALITY_METRICS_COMFIG.map(({ label, key }) => {
    const metricIndex = metricIndexOf(props.snaMetrics, key);
    const rank = Number(readRank(props.snaMetrics, snaIndex, metricIndex));
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
      <h2 class="text-[16pt]">Sintesi</h2>
    </template>

    <template #default>
      <section class="h-full overflow-hidden">
        <div class="flex h-full flex-col">
          <!-- On-screen sort controls (hidden in the printed report). -->
          <div
            class="pb-[2.5mm] flex shrink-0 flex-wrap items-center gap-[1mm] border-b border-line justify-end"
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
            v-for="card in sortedCards"
            :key="card.id"
            class="flex items-center gap-[3mm] min-h-[6.6mm] border-b border-line"
            :class="{ 'py-[1.5mm]': sortedCards.length < 25 }"
          >
            <div class="flex flex-1 items-center gap-[1.5mm] min-w-0">
              <span
                class="inline-flex h-[4.6mm] min-w-[6mm] shrink-0 items-center justify-center px-[1mm] border border-ink rounded font-mono text-[7pt] font-semibold leading-none text-ink"
                >{{ card.id }}</span
              >
              <span class="min-w-0 truncate text-[9pt] text-ink">{{ card.name }}</span>
            </div>

            <span
              class="flex w-[30mm] shrink-0 items-center justify-between rounded border border-line bg-canvas px-[1.25mm] py-[0.6mm]"
            >
              <span class="font-mono text-[8pt] font-medium text-muted">BNS/MLS</span>
              <span class="font-mono text-[8pt] font-semibold leading-none"
                >{{ formatValue(card.bonus) }}/{{ formatValue(card.malus) }}</span
              >
            </span>

            <span
              class="shrink-0 w-[36mm] leading-[1.15] font-medium text-[9pt]"
              :class="card.statusClass"
            >
              {{ card.statusLabel }}
            </span>

            <div class="flex shrink-0 items-center gap-[3mm]">
              <span
                v-for="metric in card.metrics"
                :key="metric.label"
                class="inline-flex items-center gap-[1.2mm]"
              >
                <span class="font-mono text-[8pt] font-semibold leading-none text-ink">{{
                  metric.label
                }}</span>
                <span
                  class="h-[2.2mm] w-[2.2mm] shrink-0 rounded-full"
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
