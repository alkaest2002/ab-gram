<script setup>
// --- Imports ------------
//   -- From components
import DiscordIcon from "@/components/ui/icons/DiscordIcon.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

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
const discordUrl = "https://discord.com/channels/1562509525280493672/1562509526052110450";

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const openDiscord = () =>
    window.open(discordUrl, "_blank", "noopener,noreferrer");
</script>

<template>
    <BaseCard>
        <template #eyebrow>Comunità</template>
        <template #title>Entra nel server Discord</template>

        Unisciti alla community su Discord per fare domande, condividere feedback e restare aggiornato sul progetto.

        <template #actions>
            <BaseButton
                :buttonVariant="buttonVariant"
                @click="openDiscord"
            >
                <template #icon>
                    <DiscordIcon size="size-4" />
                </template>
                Apri il server Discord
            </BaseButton>
        </template>
    </BaseCard>
</template>
