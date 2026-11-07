<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import BaseClickButton from "@/components/ui/BaseClickButton.vue";
import CheckIcon from "@/components/ui/icons/CheckIcon.vue";
import CopyIcon from "@/components/ui/icons/CopyIcon.vue";

//   -- From composables.
import { useCopyLink } from "@/composables/useCopyLink";

// --- Props --------------
defineProps({
  buttonVariant: {
    type: String,
    default: "outline",
    validator: (value) => ["solid", "outline", "red"].includes(value),
  },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------
const { copied, copyLink } = useCopyLink();

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <BaseClickButton :button-variant="buttonVariant" aria-live="polite" @click="copyLink">
    <template #icon>
      <CheckIcon v-if="copied" size="size-4" />
      <CopyIcon v-else size="size-4" />
    </template>
    <span class="grid place-items-center">
      <span class="col-start-1 row-start-1" :class="copied ? 'invisible' : 'visible'">
        Copia il link
      </span>
      <span class="col-start-1 row-start-1" :class="copied ? 'visible' : 'invisible'">
        Copiato!
      </span>
    </span>
  </BaseClickButton>
</template>
