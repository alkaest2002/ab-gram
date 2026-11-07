<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import EmailIcon from "@/components/ui/icons/EmailIcon.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseClickButton from "@/components/ui/BaseClickButton.vue";

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
const openEmail = () => {
  window.location.href = "mailto:info@ab-gram.com";
};
</script>

<template>
  <BaseCard>
    <template #eyebrow>Contatti</template>
    <template #title>Hai una domanda?</template>

    Scrivici se hai bisogno di informazioni supplementari. Cercheremo di risponderti il prima
    possibile.

    <template #actions>
      <BaseClickButton :button-variant="buttonVariant" @click="openEmail">
        <template #icon>
          <EmailIcon size="size-4" />
        </template>
        info@ab-gram.com
      </BaseClickButton>
    </template>
  </BaseCard>
</template>
