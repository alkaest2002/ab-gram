<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
  /** Total number of members. */
  membersCount: {
    type: Number,
    default: 0,
  },
  /** Number of duplicated non-empty names. */
  duplicatedNamesCount: {
    type: Number,
    default: 0,
  },
  /** Number of empty (blank) names. */
  emptyNamesCount: {
    type: Number,
    default: 0,
  },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// Issue counts read red when they need attention, muted once they're resolved.
// Members is the baseline and always reads ink.
const duplicatedTone = computed(() =>
  props.duplicatedNamesCount > 0 ? "text-reject" : "text-muted"
);
const emptyTone = computed(() =>
  props.emptyNamesCount > 0 ? "text-reject" : "text-muted"
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <dl
    class="grid grid-cols-1 divide-y divide-line rounded-lg border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
  >
    <!-- Persone: a filled dot, the baseline reading of the group's size. -->
    <div class="flex flex-col px-5 py-4">
      <dt class="eyebrow order-2 mt-2">Persone</dt>
      <dd class="order-1 flex items-center gap-2.5 text-ink">
        <span
          class="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink"
        >
          <svg class="size-5" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="6.5" fill="currentColor" />
          </svg>
        </span>
        <span class="font-mono text-2xl leading-none font-semibold">
          {{ membersCount }}
        </span>
      </dd>
    </div>

    <!-- Nomi duplicati: two overlapping marks — the same name twice. -->
    <div class="flex flex-col px-5 py-4">
      <dt class="eyebrow order-2 mt-2">Nomi duplicati</dt>
      <dd class="order-1 flex items-center gap-2.5" :class="duplicatedTone">
        <span
          class="grid size-9 shrink-0 place-items-center rounded-lg border border-line"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            aria-hidden="true"
          >
            <circle cx="10" cy="12" r="5.5" />
            <circle cx="14" cy="12" r="5.5" />
          </svg>
        </span>
        <span class="font-mono text-2xl leading-none font-semibold">
          {{ duplicatedNamesCount }}
        </span>
      </dd>
    </div>

    <!-- Nomi vuoti: a dashed, hollow circle — the graph's mark for absence. -->
    <div class="flex flex-col px-5 py-4">
      <dt class="eyebrow order-2 mt-2">Nomi vuoti</dt>
      <dd class="order-1 flex items-center gap-2.5" :class="emptyTone">
        <span
          class="grid size-9 shrink-0 place-items-center rounded-lg border border-line"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-dasharray="3 3.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="6.5" />
          </svg>
        </span>
        <span class="font-mono text-2xl leading-none font-semibold">
          {{ emptyNamesCount }}
        </span>
      </dd>
    </div>
  </dl>
</template>
