<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From relative.
import BasePage from "../BasePage.vue";
import SnaPlot from "./SnaPlot.vue";
import SnaMetrics from "./SnaMetrics.vue";

// --- Props --------------
const props = defineProps({
  typeOfSna: {
    type: String,
    required: true,
    validator: (value) => ["likes", "dislikes"].includes(value),
  },
  members: { type: Array, default: () => [] },
  snaPlot: { type: Object, default: null },
  snaMetrics: { type: Object, default: () => ({}) },
  morenoMetrics: { type: Object, default: () => ({}) },
  nodeInfo: { type: Array, default: () => [] },
});

// --- Emits --------------
const emit = defineEmits(["regenerate-sna-plot"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Per-type page details: the network plot is drawn with a hard-coded accent in
// `analysisMain` (`#0000FF` for likes, `#FF0000` for dislikes), so the fallback
// below only kicks in when the plot carries no accent of its own.
const SNA_CONFIG = {
  likes: {
    accentColor: "#2563eb",
    pageTitle: "Rete delle scelte",
  },
  dislikes: {
    accentColor: "#dc2626",
    pageTitle: "Rete dei rifiuti",
  },
};

const config = SNA_CONFIG[props.typeOfSna] ?? SNA_CONFIG.likes;

// Reuse the plot's own accent so the metric bars and legend stay in the same
// hue as the graph, falling back to the type-specific color otherwise.
const accentColor = props.snaPlot?.accentColor ?? config.accentColor;
</script>

<template>
  <BasePage>
    <template #pageTitle>
      <h2 class="text-[16pt]">{{ config.pageTitle }}</h2>
    </template>

    <template #default>
      <!--
              The content cell is split 2/3 – 1/3 with flexbox (no layout table):
              the plot band on top, the compact stats band below. Only the metric
              list at the bottom is a real table (genuinely tabular label/value
              rows).
            -->
      <div v-if="snaPlot" class="sna-layout">
        <SnaPlot
          :initial-svg="snaPlot.svg ?? ''"
          :accent-color="accentColor"
          :type-of-sna="typeOfSna"
          :members="members"
          :node-info="nodeInfo"
          @regenerate-sna-plot="emit('regenerate-sna-plot', $event)"
        />
        <SnaMetrics
          :sna-metrics="snaMetrics"
          :moreno-metrics="morenoMetrics"
          :type-of-sna="typeOfSna"
          :accent-color="accentColor"
        />
      </div>
    </template>
  </BasePage>
</template>

<style scoped>
/* The content cell is split 2/3 – 1/3 with flexbox. Flex and percentage heights
   work here because the content cell has a definite height (see BasePage). */
.sna-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
