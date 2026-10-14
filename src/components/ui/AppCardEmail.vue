<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import EmailIcon from "@/components/ui/icons/EmailIcon.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------
defineProps({
    buttonVariant: {
        type: String,
        default: "outline",
    },
});

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const openEmail = () => {
    window.location.href = "mailto:info@ab-grid.com";
};
</script>

<template>
    <BaseCard>
        <template #eyebrow>Contatti</template>
        <template #title>Hai una domanda?</template>

        Scrivici se hai bisogno di informazioni supplementari. Cercheremo di risponderti il prima possibile.

        <template #actions>
            <BaseButton
                :buttonVariant="buttonVariant"
                @click="openEmail"
            >
                <template #icon>
                    <EmailIcon size="size-4" />
                </template>
                info@ab-grid.com
            </BaseButton>
        </template>
    </BaseCard>
</template>
