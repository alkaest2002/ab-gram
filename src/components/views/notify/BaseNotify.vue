<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components
import BaseButton from "@/components/ui/BaseButton.vue";
import WarningIcon from "@/components/ui/icons/WarningIcon.vue"

// --- Props --------------
defineProps({
    to: { type: [String, Object], default: null },
    replace: { type: Boolean, default: false },
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
    <div
        class="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-14 text-center"
    >
        <slot name="icon">
            <WarningIcon size="size-18" :stroke-width="1.5" />
        </slot>

        <div class="mt-3 space-y-3">
            <p class="eyebrow">Errore</p>
            <h2 class="text-3xl">
                <slot name="title"> Ops! Qualcosa è andato storto </slot>
            </h2>
            <p class="mx-auto max-w-[52ch] text-sm">
                <slot name="text">
                    Se pensi che si tratti di un bug, segnala il problema al gestore del sito.
                </slot>
            </p>
        </div>

        <div
            class="mt-10 flex w-full flex-col items-center gap-4 border-t border-line pt-8"
        >
            <BaseButton :to="to" :replace="replace" buttonVariant="solid">
                <slot name="buttonLabel" />
            </BaseButton>
        </div>
    </div>
</template>
