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
  readRank,
  formatValue,
} from "@/utils/report/memberStatsHelpers";

//   -- From relative.
import BasePage from "../BasePage.vue";

//   -- From constants.
import { STATUS_UI_CONFIG } from "@/analysis/moreno/metrics/individualMetricsSociometricStatus/constants";

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
const METRICS = [
  { label: "DG", key: "inDegreeCentrality" },
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
  const memberIndex = memberIndexIn(member.id, props.morenoMetrics);
  const statusIndex = metricIndexOf(props.morenoMetrics, "ss");
  const statusCode =
    memberIndex < 0 || statusIndex < 0
      ? 99
      : Number(readRaw(props.morenoMetrics, memberIndex, statusIndex));
  const status = STATUS_UI_CONFIG[statusCode] ?? STATUS_UI_CONFIG[99];

  const bonus = Number(
    readRaw(props.morenoMetrics, memberIndex, metricIndexOf(props.morenoMetrics, "bns")),
  );
  const malus = Number(
    readRaw(props.morenoMetrics, memberIndex, metricIndexOf(props.morenoMetrics, "mls")),
  );

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
          <div
            v-for="card in cards"
            :key="card.id"
            class="flex items-center gap-[3mm] min-h-[6.6mm] border-b border-line"
            :class="{ 'py-[1.5mm]': cards.length < 25 }"
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
              class="shrink-0 w-[30mm] leading-[1.1] font-medium whitespace-nowrap text-[9pt]"
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
