<script setup>
import { computed } from "vue";
import { metricIndexOf, readRank } from "@/analysis/common/statsHelpers";
import BasePage from "../BasePage.vue";
import { MEMBER_METRICS } from "@/utils/report/memberMetricRows.js";

const props = defineProps({
  morenoMetrics: { type: Object, required: true },
  snaMetrics: { type: Object, required: true },
});

const rows = computed(() =>
  MEMBER_METRICS.map(({ label, key, source }) => {
    const metrics = source === "moreno" ? props.morenoMetrics : props.snaMetrics;
    const column = metricIndexOf(metrics, key);

    // Count members per rank; missing ranks are grouped under a dash.
    const counts = new Map();
    (metrics.ids ?? []).forEach((_, index) => {
      const rank = readRank(metrics, index, column);
      const text = Number.isFinite(rank) ? String(rank) : "-";
      counts.set(text, (counts.get(text) ?? 0) + 1);
    });

    const ranks = [...counts.entries()]
      .map(([text, count]) => {
        const members = count === 1 ? "membro" : "membri";
        const where = text === "-" ? "senza rango" : `al rango ${text}`;
        return {
          text,
          count,
          rank: text === "-" ? Infinity : Number(text),
          title: `${count} ${members} ${where}`,
        };
      })
      .sort((a, b) => a.rank - b.rank);

    return { label, ranks };
  }),
);

// Divide the white-to-ink spectrum by the largest rank frequency across all
// metrics, so the darkest shade marks the most-shared rank.
const GRAY_SCALE = computed(() => {
  let maxCount = 0;
  for (const { ranks } of rows.value) {
    for (const { count } of ranks) {
      if (count > maxCount) maxCount = count;
    }
  }

  const length = Math.max(maxCount, 1);
  return Array.from({ length }, (_, i) => {
    const value = Math.round(255 - (i / (length - 1 || 1)) * 204); // white -> ink (#333)
    return {
      backgroundColor: `rgb(${value}, ${value}, ${value})`,
      color: value < 150 ? "#ffffff" : "var(--color-ink)",
    };
  });
});

function rankStyle(count) {
  const scale = GRAY_SCALE.value;
  return scale[Math.min(Math.max(count, 1), scale.length) - 1];
}
</script>

<template>
  <BasePage>
    <template #pageTitle
      ><h2 id="rankDistribution" class="text-[16pt]">Distribuzione dei ranghi</h2></template
    >
    <template #default>
      <div class="mb-[2mm]">
        <p class="text-[9pt] text-muted">
          Ogni cerchio è un rango; più scuro è il cerchio, più membri condividono quel rango. Il
          trattino indica un rango non disponibile.
        </p>
      </div>

      <ol class="space-y-[2mm] mt-6">
        <li
          v-for="row in rows"
          :key="row.label"
          class="flex items-center gap-[2mm] border-b border-line pb-[2mm]"
        >
          <span class="w-[8mm] shrink-0 font-mono text-[9.5pt] font-bold">{{ row.label }}</span>
          <span class="flex flex-1 flex-wrap items-center gap-[1.3mm]">
            <span
              v-for="(rank, i) in row.ranks"
              :key="i"
              :style="rankStyle(rank.count)"
              :title="rank.title"
              class="flex h-[4.5mm] w-[4.5mm] items-center justify-center rounded-full font-mono text-[6pt] font-semibold leading-none tabular-nums transition-colors"
              :class="{
                'border border-ink/40': rank.count === 1,
                'border border-transparent': rank.count > 1,
              }"
              >{{ rank.text }}</span
            >
            <span v-if="!row.ranks.length" class="text-[8pt] text-muted"
              >Nessun rango disponibile</span
            >
          </span>
        </li>
      </ol>
    </template>
  </BasePage>
</template>
