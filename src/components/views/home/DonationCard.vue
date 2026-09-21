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
    <section
        class="relative overflow-hidden rounded-2xl bg-linear-to-r from-accent to-reject p-6 text-white shadow-xl shadow-accent/20 sm:p-8"
    >
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="max-w-[52ch] space-y-3">
                <p class="font-mono text-xs font-medium tracking-[0.14em] text-white/80 uppercase">
                    Sostieni il progetto
                </p>
                <h2 class="text-white">Ti è stato utile?</h2>
                <p class="text-white/90">
                    Offrici un caffè con una piccola donazione, oppure
                    copia il link e condividilo con chi potrebbe trovarla utile.
                </p>
            </div>

            <div class="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <a
                    :href="donationUrl"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white/90 sm:w-auto"
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
                    class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto"
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
