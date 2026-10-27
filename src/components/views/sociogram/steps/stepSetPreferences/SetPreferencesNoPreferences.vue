<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
    /**
     * Whether the member has declared no preference. Bound with `v-model`:
     * read here, written back through `update:modelValue`.
     */
    modelValue: { type: Boolean, default: false },

    /** Which preference this card relates to. Drives the checkbox tone. */
    tone: {
        type: String,
        required: true,
        validator: (value) => ["likes", "dislikes"].includes(value),
    },
});

// --- Emits --------------
const emit = defineEmits(["update:modelValue"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read the flag from `modelValue` and write it back by emitting
// `update:modelValue`, so the parent stays the single source of truth.
const checked = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="rounded-lg border border-line p-4">
        <p class="text-xs text-muted mb-3">
            <slot name="description" />
        </p>
        <label class="flex items-start gap-3">
            <input
                type="checkbox"
                class="mt-0.5 size-4 shrink-0"
                :class="tone === 'likes' ? 'accent-accent' : 'accent-reject'"
                v-model="checked"
            />
            <span class="text-sm text-ink">
                <slot name="checkboxLabel" />
            </span>
        </label>
    </div>
</template>
