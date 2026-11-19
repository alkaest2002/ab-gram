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
    class="card p-4 cursor-pointer transition-colors hover:border-muted focus-visible:outline-ink"
    role="button"
    tabindex="0"
    :aria-label="`Modifica le preferenze di ${member.name}`"
    @click="$emit('sociogram-edit-member', member.id)"
    @keydown.enter.prevent="$emit('sociogram-edit-member', member.id)"
    @keydown.space.prevent="$emit('sociogram-edit-member', member.id)"
  >
    <div class="flex items-center gap-3">
      <svg viewBox="0 0 32 32" class="size-9 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="14.3" class="fill-canvas stroke-line" stroke-width="1" />
        <text
          x="16"
          y="16"
          dy="0.34em"
          text-anchor="middle"
          class="fill-ink font-mono text-[13px] font-medium"
        >
          {{ member.id }}
        </text>
      </svg>
      <p class="min-w-0 font-display text-lg font-bold leading-snug tracking-[-0.01em] text-ink">
        {{ member.name }}
      </p>
    </div>

    <div class="space-y-3 pl-12">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between gap-3">
          <span class="eyebrow flex items-center gap-1.5">
            <span class="tracking-tight text-accent font-bold"
              >{{ member.likes.length }} {{ member.likes.length == 1 ? "Scelta" : "Scelte" }}</span
            >
          </span>
        </div>
        <p v-if="member.likes.length" class="text-[13px] leading-[1.45] text-ink">
          {{ member.likesText }}
        </p>
        <p v-else class="text-[13px] leading-[1.45] text-muted">Nessuna scelta</p>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between gap-3">
          <span class="eyebrow flex items-center gap-1.5">
            <span class="tracking-tight text-reject font-bold"
              >{{ member.dislikes.length }}
              {{ member.dislikes.length == 1 ? "Rifiuto" : "Rifiuti" }}</span
            >
          </span>
        </div>
        <p v-if="member.dislikes.length" class="text-[13px] leading-[1.45] text-ink">
          {{ member.dislikesText }}
        </p>
        <p v-else class="text-[13px] leading-[1.45] text-muted">Nessun rifiuto</p>
      </div>
    </div>
  </div>
</template>
