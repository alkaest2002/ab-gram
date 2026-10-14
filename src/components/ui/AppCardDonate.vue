<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import HeartIcon from "@/components/ui/icons/HeartIcon.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const donationUrl = "https://donate.stripe.com/4gM6oH21z5ov7Yq59pcV201";

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
const openDonation = () =>
    window.open(donationUrl, "_blank", "noopener,noreferrer");
</script>

<template>
    <BaseCard>
        <template #eyebrow>Sostieni il progetto</template>
        <template #title>Ti è stata utile l'app?</template>

        Offrici un caffè con una piccola donazione volontaria e libera, tramite &copy; Stripe.

        <template #actions>
            <BaseButton
                buttonVariant="solid"
                class="w-full sm:w-auto"
                @click="openDonation"
            >
                <template #icon>
                    <HeartIcon size="size-4" />
                </template>
                Dona con Stripe
            </BaseButton>

        </template>
    </BaseCard>
</template>
