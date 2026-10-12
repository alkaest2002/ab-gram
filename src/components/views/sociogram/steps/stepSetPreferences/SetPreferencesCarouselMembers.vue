<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------

// --- Props --------------
defineProps({
    /** Member currently shown as the subject. */
    currentMember: { type: Object, default: null },
    /** Zero-based index of the current subject. */
    currentIndex: { type: Number, required: true },
    /** Total number of members in the carousel. */
    membersCount: { type: Number, required: true },
    /** Whether the carousel may move to the previous member. */
    canGoPrevious: { type: Boolean, default: false },
    /** Whether the carousel may move to the next member. */
    canGoNext: { type: Boolean, default: false },
});

// --- Emits --------------
defineEmits(["carousel-previous", "carousel-next"]);

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="flex items-center justify-between gap-4 rounded-lg border border-line p-4">
        <BaseButton
            variant="outline"
            :disabled="!canGoPrevious"
            aria-label="Membro precedente"
            @click="$emit('carousel-previous')"
        >
            &#8249;
        </BaseButton>

        <div class="min-w-0 flex-1 text-center">
            <p class="eyebrow">Membro {{ currentMember?.id }} ({{ currentIndex + 1 }} di {{ membersCount }})</p>
            <p class="mt-1 truncate font-display text-lg font-bold text-ink">
               {{ currentMember?.name }}
            </p>
        </div>

        <BaseButton
            variant="outline"
            :disabled="!canGoNext"
            aria-label="Membro successivo"
            @click="$emit('carousel-next')"
        >
            &#8250;
        </BaseButton>
    </div>
</template>
