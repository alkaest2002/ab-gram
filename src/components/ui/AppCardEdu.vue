<script setup>
// --- Imports ------------
//   -- From components
import AppCopyLinkButton from "@/components/ui/AppCopyLinkButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

// --- Props --------------
defineProps({
    buttonVariant: {
        type: String,
        default: "outline",
    },
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
    <BaseCard>
        <template #eyebrow>Segnala il progetto</template>
        <template #title>Insegni in una scuola pubblica?</template>

        Se questo progetto ti è stato utile, segnalalo al
        Ministero dell'Istruzione e del Merito.

        <template #actions>
            <AppCopyLinkButton :buttonVariant="buttonVariant" />
        </template>
    </BaseCard>
</template>
