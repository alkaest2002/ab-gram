<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import HeartIcon from "@/components/ui/icons/HeartIcon.vue";

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
    <div class="relative overflow-hidden rounded-lg border border-line bg-white">
        <div
            class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
            aria-hidden="true"
        ></div>
        <div class="p-6 sm:p-8">
            <header class="space-y-2">
                <p class="eyebrow">Sostieni il progetto</p>
                <h2 class="text-2xl">Ti è stata utile l'app?</h2>
            </header>

            <p class="mt-4 max-w-[52ch]">
                Offrici un caffè con una piccola donazione volontaria e libera, tramite &copy; Stripe.
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                    :href="donationUrl"
                    target="_blank"
                    rel="noreferrer"
                    class="btn btn-solid w-full sm:w-auto"
                >
                    <HeartIcon size="size-4" />
                    Dona con Stripe
                </a>

                <CopyLinkButton />
            </div>
        </div>
    </div>
</template>
