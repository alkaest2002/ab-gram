<script setup>
// --- Components ---------
import CheckIcon from "@/components/ui/icons/CheckIcon.vue";
import CopyIcon from "@/components/ui/icons/CopyIcon.vue";

// --- Composables --------
import { useCopyLink } from "@/composables/useCopyLink";

// --- State --------------
const { copied, copyLink } = useCopyLink();
</script>

<template>
    <button
        type="button"
        class="btn btn-outline w-full sm:w-auto"
        aria-live="polite"
        @click="copyLink"
    >
        <CheckIcon v-if="copied" size="size-4" />
        <CopyIcon v-else size="size-4" />
        <span class="grid place-items-center">
            <span
                class="col-start-1 row-start-1"
                :class="copied ? 'invisible' : 'visible'"
            >
                Copia il link
            </span>
            <span
                class="col-start-1 row-start-1"
                :class="copied ? 'visible' : 'invisible'"
            >
                Copiato!
            </span>
        </span>
    </button>
</template>
