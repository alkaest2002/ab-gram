<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

//   -- From utils.
import { isMemberComplete } from "@/utils/sociogram/memberHelpers";

// --- Props --------------
const props = defineProps({
  /** Members whose preferences are being collected. */
  members: { type: Array, required: true },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
const totalCount = computed(() => props.members.length);

const completedMembersCount = computed(() => props.members.filter(isMemberComplete).length);

const completedPercentage = computed(() =>
  totalCount.value ? Math.round((completedMembersCount.value / totalCount.value) * 100) : 0,
);

const remainingMembersCount = computed(() => totalCount.value - completedMembersCount.value);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <!-- One-line meter: mono fraction, hairline bar, remaining count. -->
  <div
    class="flex items-center justify-between gap-4"
    role="img"
    :aria-label="`Completato ${completedPercentage}%, ${remainingMembersCount} da compilare`"
  >
    <!-- Left: compact progress (fraction + short bar). -->
    <div class="flex items-center gap-2">
      <p class="font-mono text-xs text-ink tabular-nums">
        {{ completedMembersCount }}<span class="text-muted">/{{ totalCount }}</span>
      </p>

      <div class="h-1 w-20 overflow-hidden rounded-full bg-line">
        <div
          class="h-full rounded-full bg-ink transition-[width] duration-300"
          :style="{ width: `${completedPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Right: remaining count. -->
    <p class="text-xs text-muted">{{ remainingMembersCount }} da compilare</p>
  </div>
</template>
