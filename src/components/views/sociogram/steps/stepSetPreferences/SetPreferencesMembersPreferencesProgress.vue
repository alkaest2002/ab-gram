<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From utils
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

const completedMembersCount = computed(
    () => props.members.filter(isMemberComplete).length,
);

const completedPercentage = computed(() =>
    totalCount.value
        ? Math.round((completedMembersCount.value / totalCount.value) * 100)
        : 0,
);

const remainingMembersCount = computed(
    () => totalCount.value - completedMembersCount.value,
);

/** Number of node dots to draw (one per member, capped for large groups). */
const MAX_DOTS = 24;

const progressDots = computed(() =>
    Math.min(totalCount.value, MAX_DOTS),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div
        class="flex flex-wrap justify-between gap-x-4 gap-y-2"
    >
        <div class="flex items-center gap-3">
            <!-- One node per member: filled when complete, outlined otherwise. -->
            <div
                class="flex items-center gap-1"
                aria-hidden="true"
            >
                <span
                    v-for="index in progressDots"
                    :key="index"
                    class="size-1.5 rounded-full transition-colors duration-300"
                    :class="
                        index <= completedMembersCount
                            ? 'bg-ink'
                            : 'border border-line bg-line'
                    "
                ></span>
            </div>
            <p class="text-xs text-muted">
                {{ completedPercentage }}% completato
            </p>
        </div>
        <div>
            <p class="text-xs text-muted">
                {{ remainingMembersCount }} da compilare
            </p>
        </div>
    </div>
</template>
