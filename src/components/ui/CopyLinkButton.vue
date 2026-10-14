<script setup>
// --- Vue ----------------
import { onBeforeUnmount, ref } from "vue";

// --- Components ---------
import CheckIcon from "@/components/ui/icons/CheckIcon.vue";
import CopyIcon from "@/components/ui/icons/CopyIcon.vue";

// --- State --------------
const siteUrl = window.location.origin;
const copied = ref(false);
let copyTimer = null;

// --- Lifecycle ----------
onBeforeUnmount(() => clearTimeout(copyTimer));

// --- Methods ------------
async function copyLink() {
    try {
        await navigator.clipboard.writeText(siteUrl);
    } catch {
        // Clipboard API needs a secure context (https or localhost). Without it
        // there's no reliable fallback, so leave the button label unchanged.
        return;
    }

    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 2000);
}
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
