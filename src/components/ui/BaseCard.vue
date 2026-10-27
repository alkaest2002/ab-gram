<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------
defineProps({
    /** Whether to show the accent gradient strip along the top edge. */
    showAccent: { type: Boolean, default: true },
});

// --- Emits --------------

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
    <div class="relative overflow-hidden rounded-lg border border-line bg-white">
        <div
            v-if="showAccent"
            class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
            aria-hidden="true"
        ></div>

        <div class="p-6 sm:p-8">
            <header v-if="$slots.eyebrow || $slots.title" class="space-y-2">
                <p v-if="$slots.eyebrow" class="eyebrow">
                    <slot name="eyebrow" />
                </p>
                <h2 v-if="$slots.title" class="text-2xl">
                    <slot name="title" />
                </h2>
            </header>

            <p v-if="$slots.default" class="mt-4 max-w-[52ch]">
                <slot />
            </p>

            <div
                v-if="$slots.actions"
                class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>
