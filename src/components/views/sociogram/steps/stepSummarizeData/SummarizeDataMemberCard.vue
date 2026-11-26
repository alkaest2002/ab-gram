<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
  /**
   * Single member summary row: `id`, `name`, resolved `likes`/`dislikes`
   * arrays, and the pre-joined `likesText`/`dislikesText` strings.
   */
  member: { type: Object, required: true },
});

// --- Emits --------------
defineEmits(["sociogram-edit-member"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div
    class="card group relative min-w-0 cursor-pointer space-y-4 p-5 transition-[border-color,box-shadow] duration-200 hover:border-gray/40 hover:shadow-sm focus-visible:border-accent focus-visible:outline-accent motion-reduce:transition-none"
    role="button"
    tabindex="0"
    :aria-label="`Modifica le preferenze di ${member.name}`"
    @click="$emit('sociogram-edit-member', member.id)"
    @keydown.enter.prevent="$emit('sociogram-edit-member', member.id)"
    @keydown.space.prevent="$emit('sociogram-edit-member', member.id)"
  >
    <span
      class="absolute top-4 right-4 inline-flex h-7 items-center gap-1.5 rounded-md bg-ink/5 px-2 font-mono text-[12px] font-medium text-muted"
      aria-hidden="true"
    >
      <span class="text-muted/70">ID</span>
      <span class="text-ink font-bold">{{ member.id }}</span>
    </span>

    <div class="flex min-h-8 items-center gap-2.5 pr-18">
      <svg
        viewBox="0 0 24 24"
        class="size-8 shrink-0 rounded-full bg-ink/5 p-1.5 text-muted"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
      <p
        class="min-w-0 wrap-anywhere font-display text-lg truncated font-bold leading-snug tracking-[-0.01em] text-ink"
      >
        {{ member.name }}
      </p>
    </div>

    <div class="space-y-3">
      <div class="min-w-0 space-y-0.5">
        <p class="text-sm font-semibold leading-snug text-accent">
          <span class="font-mono tabular-nums">{{ member.likes.length }}</span>
          {{ member.likes.length === 1 ? "Scelta" : "Scelte" }}
        </p>
        <p v-if="member.likes.length" class="wrap-anywhere text-[13px] leading-snug text-muted">
          {{ member.likesText }}
        </p>
        <p v-else class="text-[13px] leading-snug text-muted">Nessuna scelta</p>
      </div>

      <div class="min-w-0 space-y-0.5">
        <p class="text-sm font-semibold leading-snug text-reject">
          <span class="font-mono tabular-nums">{{ member.dislikes.length }}</span>
          {{ member.dislikes.length === 1 ? "Rifiuto" : "Rifiuti" }}
        </p>
        <p v-if="member.dislikes.length" class="wrap-anywhere text-[13px] leading-snug text-muted">
          {{ member.dislikesText }}
        </p>
        <p v-else class="text-[13px] leading-snug text-muted">Nessun rifiuto</p>
      </div>
    </div>
  </div>
</template>
