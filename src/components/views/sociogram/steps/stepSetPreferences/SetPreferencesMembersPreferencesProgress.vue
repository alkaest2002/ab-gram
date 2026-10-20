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
    <div>
        <div class="mb-2 flex items-baseline justify-between">
            <p class="eyebrow">AVANZAMENTO</p>
            <p class="font-mono text-xs font-medium text-muted">
                {{ completedMembersCount }} di {{ totalCount }} membri
            </p>
        </div>

        <div
            class="h-2 w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="Membri con dati compilati"
            :aria-valuenow="completedPercentage"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <div
                class="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                :style="{ width: `${completedPercentage}%` }"
            ></div>
        </div>

        <p class="mt-2 text-xs text-muted">
            {{ completedPercentage }}% completato<span
                v-if="remainingMembersCount > 0"
            >
                — {{ remainingMembersCount }} ancora da compilare</span
            >.
        </p>
    </div>
</template>
