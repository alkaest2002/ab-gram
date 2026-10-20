<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
// `count` and `error` are the state values that drive visibility; the
// displayed content is provided via slots so callers control the wording.
const props = defineProps({
    count: { type: Number, default: null },
    error: { type: String, default: null },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
const hasResult = computed(() => props.count !== null);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div v-if="hasResult || error" class="space-y-3">
        <div
            v-if="hasResult"
            class="flex items-center gap-3 rounded-lg border border-line p-3"
            role="status"
        >
            <span
                class="grid size-8 shrink-0 place-items-center rounded-md border border-line text-accent"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    class="size-4 fill-none stroke-current stroke-[1.75]"
                >
                    <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </span>
            <div class="min-w-0 pt-0.5">
                <slot />
            </div>
        </div>

        <div
            v-if="error"
            class="flex items-start gap-3 rounded-lg border border-line p-3"
            role="alert"
        >
            <span
                class="grid size-8 shrink-0 place-items-center rounded-md border border-line text-reject"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    class="size-4 fill-none stroke-current stroke-[1.75]"
                >
                    <circle cx="12" cy="12" r="9" />
                    <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="13"
                        stroke-linecap="round"
                    />
                    <circle
                        cx="12"
                        cy="16"
                        r="0.5"
                        fill="currentColor"
                        stroke="none"
                    />
                </svg>
            </span>
            <div class="min-w-0 pt-0.5">
                <p class="text-sm font-medium text-ink">Caricamento non riuscito</p>
                <p class="text-sm text-muted">
                    <slot name="error">{{ error }}</slot>
                </p>
            </div>
        </div>
    </div>
</template>
