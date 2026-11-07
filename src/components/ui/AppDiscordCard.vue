<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import DiscordIcon from "@/components/ui/icons/DiscordIcon.vue";
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
const discordUrl = "https://discord.com/channels/1562511213198577874/1562511213961809953";

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const openDiscord = () => window.open(discordUrl, "_blank", "noopener,noreferrer");
</script>

<template>
  <BaseCard>
    <template #eyebrow>Comunità</template>
    <template #title>Entra nel server Discord</template>

    Unisciti alla community su Discord per fare domande, condividere feedback e restare aggiornato
    sul progetto.

    <template #actions>
      <BaseClickButton :button-variant="buttonVariant" @click="openDiscord">
        <template #icon>
          <DiscordIcon size="size-4" />
        </template>
        Apri il server Discord
      </BaseClickButton>
    </template>
  </BaseCard>
</template>
