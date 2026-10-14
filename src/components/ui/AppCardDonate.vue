<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import HeartIcon from "@/components/ui/icons/HeartIcon.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const donationUrl = "https://donate.stripe.com/4gM6oH21z5ov7Yq59pcV201";

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BaseCard>
        <template #eyebrow>Sostieni il progetto</template>
        <template #title>Ti è stata utile l'app?</template>

        Offrici un caffè con una piccola donazione volontaria e libera, tramite &copy; Stripe.

        <template #actions>
            <a
                :href="donationUrl"
                target="_blank"
                rel="noreferrer"
                class="btn btn-outline w-full sm:w-auto"
            >
                <HeartIcon size="size-4" />
                Dona con Stripe
            </a>

        </template>
    </BaseCard>
</template>
