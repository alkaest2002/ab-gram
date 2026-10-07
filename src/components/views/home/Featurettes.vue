<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
// Three commitments set as ledger rows: a hairline rule per row, the title with
// its icon in the commitment's tone, and a mono "zero" on the right — because
// each promise is literally a zero: zero euro, zero setup, zero data sent out.
const features = [
    {
        id: "free",
        tone: "text-ink",
        title: "Gratuita",
        zero: "0 €",
        text: "Nessun abbonamento, nessun acquisto in-app, nessun account da creare. AB-Grid è gratis, punto.",
    },
    {
        id: "easy",
        tone: "text-ink",
        title: "Semplice",
        zero: "0 setup",
        text: "Niente da installare o configurare: apri la pagina, inserisci i nomi e leggi subito il sociogramma.",
    },
    {
        id: "privacy",
        tone: "text-ink",
        title: "Privata",
        zero: "0 dati inviati",
        text: "Tutto gira nel tuo browser. I dati non lasciano mai il dispositivo: niente server, niente tracciamento.",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <section class="space-y-8 text-center">
        <header class="mx-auto max-w-2xl space-y-3">
            <p class="eyebrow">Perché AB-Grid</p>
            <h2>Tre impegni, zero eccezioni</h2>
        </header>

        <ul class="mx-auto w-full max-w-2xl">
            <li
                v-for="feature in features"
                :key="feature.id"
                class="flex flex-col items-center gap-2.5 border-t border-line py-7 last:border-b"
            >
                <h3
                    class="flex items-center gap-2.5 text-xl tracking-[-0.01em] sm:text-2xl"
                >
                    <span :class="feature.tone" aria-hidden="true">
                        <!-- Gratuita: a card struck through — no payment, ever. -->
                        <svg
                            v-if="feature.id === 'free'"
                            class="size-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M2 10h20" />
                            <path d="M4.5 19.5 19.5 4.5" />
                        </svg>

                        <!-- Semplice: a spark — the result appears on its own. -->
                        <svg
                            v-else-if="feature.id === 'easy'"
                            class="size-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"
                            />
                            <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
                        </svg>

                        <!-- Privata: a shield locked with a keyhole — data stays in. -->
                        <svg
                            v-else
                            class="size-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                            />
                            <circle cx="12" cy="11" r="2" />
                            <path d="M12 13v3.5" />
                        </svg>
                    </span>
                    {{ feature.title }}
                </h3>

                <p class="max-w-[52ch] text-sm">{{ feature.text }}</p>

                <span class="font-mono text-xs text-muted">
                    {{ feature.zero }}
                </span>
            </li>
        </ul>
    </section>
</template>
