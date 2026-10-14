<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import EmailIcon from "@/components/ui/icons/EmailIcon.vue";
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
        <template #eyebrow>Contatti</template>
        <template #title>Hai una domanda?</template>

        Scrivici se hai bisogno di informazioni supplementari. Cercheremo di risponderti il prima possibile.

        <template #actions>
            <a
                href="mailto:info@ab-grid.com"
                class="btn btn-outline w-full sm:w-auto"
            >
                <EmailIcon size="size-4" />
                Scrivi a info@ab-grid.com
            </a>
        </template>
    </BaseCard>
</template>
