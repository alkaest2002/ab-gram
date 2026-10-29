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

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div
        class="flex flex-wrap justify-between gap-x-4 gap-y-2"
    >
        <p class="text-xs text-muted">
            <!-- One node per member: black when complete, gray otherwise. -->
            <span
                class="mr-3 inline-flex items-center gap-1 align-middle"
                aria-hidden="true"
            >
                <span
                    v-for="index of totalCount"
                    :key="index"
                    class="size-1.5 rounded-full transition-colors duration-300"
                    :class="
                        index <= completedMembersCount
                            ? 'bg-ink'
                            : 'bg-line'
                    "
                ></span>
            </span>
            completato {{ completedPercentage }}%
        </p>
        <p class="text-xs text-muted">
            {{ remainingMembersCount }} da compilare
        </p>
    </div>
</template>
