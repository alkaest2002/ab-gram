<script setup>
// --- Vue ----------------
import { onBeforeUnmount, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import HeartIcon from "@/components/ui/icons/HeartIcon.vue";
import CheckIcon from "@/components/ui/icons/CheckIcon.vue";
import CopyIcon from "@/components/ui/icons/CopyIcon.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
// Stripe donation link.
const donationUrl = "https://donate.stripe.com/4gM6oH21z5ov7Yq59pcV201";
const siteUrl = window.location.origin;
const copied = ref(false);
let copyTimer = null;

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onBeforeUnmount(() => clearTimeout(copyTimer));

// --- Methods ------------
async function copyLink() {
    try {
        await navigator.clipboard.writeText(siteUrl);
    } catch {
        // Clipboard API needs a secure context (https or localhost). Without it
        // there's no reliable fallback, so leave the button label unchanged.
        return;
    }

    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
    <section class="relative overflow-hidden rounded-lg border border-line bg-white text-left">
        <!-- The brand pair as a top rule: the same blue→red underline as the hero. -->
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
                Offrici un caffè con una piccola donazione, tramite &copy; Stripe, oppure copia il
                link e condividilo con chi potrebbe trovarla utile.
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

                <button
                    type="button"
                    class="btn btn-outline w-full sm:w-auto"
                    aria-live="polite"
                    @click="copyLink"
                >
                    <CheckIcon v-if="copied" size="size-4" />
                    <CopyIcon v-else size="size-4" />
                    <span class="grid place-items-center">
                        <span
                            class="col-start-1 row-start-1"
                            :class="copied ? 'invisible' : 'visible'"
                        >
                            Copia il link
                        </span>
                        <span
                            class="col-start-1 row-start-1"
                            :class="copied ? 'visible' : 'invisible'"
                        >
                            Copiato!
                        </span>
                    </span>
                </button>
            </div>
        </div>
    </section>
</template>
