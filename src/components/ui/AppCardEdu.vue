<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import CopyLinkButton from "@/components/ui/CopyLinkButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------

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
            <CopyLinkButton />
        </template>
    </BaseCard>
</template>
