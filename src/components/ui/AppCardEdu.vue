<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components
import AppCopyLinkButton from "@/components/ui/AppCopyLinkButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import FileIcon from "@/components/ui/icons/FileIcon.vue";

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
const brochureUrl = `${import.meta.env.BASE_URL}ab-gram%20depliant.pdf`;

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const openBrochure = () =>
    window.open(brochureUrl, "_blank", "noopener,noreferrer");
</script>

<template>
    <BaseCard>
        <template #eyebrow>Segnala il progetto</template>
        <template #title>Insegni in una scuola pubblica?</template>

        Se questo progetto ti è stato utile, segnalalo al
        Ministero dell'Istruzione e del Merito.

        <template #actions>
            <AppCopyLinkButton :buttonVariant="buttonVariant" />
            <BaseButton :buttonVariant="buttonVariant" @click="openBrochure">
                <template #icon>
                    <FileIcon size="size-4" />
                </template>
                Apri il dépliant
            </BaseButton>
        </template>
    </BaseCard>
</template>
