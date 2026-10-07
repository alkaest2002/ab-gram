<script setup>
// --- Vue ----------------
import { onBeforeUnmount, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

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
    <section class="relative overflow-hidden rounded-lg border border-line bg-white">
        <!-- The brand pair as a top rule: the same blue→red underline as the hero. -->
        <div
            class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
            aria-hidden="true"
        ></div>

        <div class="p-6 sm:p-8">
            <header class="space-y-2">
                <p class="eyebrow">Sostieni il progetto</p>
                <h2>Ti è stata utile l'app?</h2>
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
                    <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" />
                    </svg>
                    Dona con Stripe
                </a>

                <button
                    type="button"
                    class="btn btn-outline w-full sm:w-auto"
                    aria-live="polite"
                    @click="copyLink"
                >
                    <svg
                        v-if="copied"
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <svg
                        v-else
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <rect width="14" height="14" x="8" y="8" rx="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
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
