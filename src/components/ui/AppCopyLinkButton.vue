<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Components ---------
import CheckIcon from "@/components/ui/icons/CheckIcon.vue";
import CopyIcon from "@/components/ui/icons/CopyIcon.vue";

// --- Composables --------
import { useCopyLink } from "@/composables/useCopyLink";

// --- Props --------------
const props = defineProps({
    buttonVariant: {
        type: String,
        default: "outline",
        validator: (value) => ["solid", "outline", "red"].includes(value),
    },
});

// --- State --------------
const { copied, copyLink } = useCopyLink();

// Classes written out in full: Tailwind doesn't see ones built by interpolation.
const variantClasses = {
    solid: "btn-solid",
    outline: "btn-outline",
    red: "btn-red",
};

// --- Computed -----------
const buttonClasses = computed(() => ["btn", variantClasses[props.buttonVariant]]);
</script>

<template>
    <button
        type="button"
        :class="buttonClasses"
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
