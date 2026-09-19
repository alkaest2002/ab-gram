<script setup>
// --- Vue ----------------
import { onBeforeUnmount, ref } from "vue";

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
/**
 * The five readings are the vocabulary of the graph above: each entry reuses the
 * same mark that appears in the sociogram, so the legend isn't decoration
 * but the key to reading the drawing.
 *
 * `tone` chooses the mark's color, `double` adds the tip at the start too,
 * `dashed` dashes it: the same three variables as the drawing.
 */
const readings = [
    {
        kind: "choice",
        tone: "accent",
        title: "Preferenze",
        text: "Chi indica chi. La freccia parte da chi sceglie e arriva a chi è stato scelto.",
    },
    {
        kind: "mutual",
        tone: "accent",
        double: true,
        title: "Preferenze reciproche",
        text: "Le coppie che si scelgono a vicenda: il legame più stabile del gruppo.",
    },
    {
        kind: "reject",
        tone: "reject",
        dashed: true,
        title: "Rifiuti",
        text: "Le preferenze negative: dicono con chi una persona preferirebbe non lavorare.",
    },
    {
        kind: "reject-mutual",
        tone: "reject",
        dashed: true,
        double: true,
        title: "Rifiuti reciproci",
        text: "Due persone che si escludono a vicenda: la tensione da sciogliere per prima.",
    },
    {
        kind: "alone",
        tone: "muted",
        title: "Isolamento",
        text: "Chi esprime preferenze senza riceverne. Iris, Luca e Marta, nel grafico qui sopra.",
    },
];

// Placeholder until a real donation link exists.
const paypalUrl = "https://www.paypal.com/paypalme/ab-grid";
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
        // Clipboard API needs a secure context (https or localhost). Fall back to
        // a temporary textarea for older browsers or file:// previews.
        const textarea = document.createElement("textarea");
        textarea.value = siteUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
    <div class="page home">
        <section class="hero space-y-5">
            <h1 class="hero-title">
                Analizza le <em>dinamiche dei gruppi</em>
            </h1>

            <p class="lede">
                Registra preferenze e rifiuti dei membri di un gruppo: AB-Grid
                costruisce il sociogramma, calcola gli indici sociometrici e
                prepara il report da interpretare.
            </p>
        </section>

        <SociogramPreview />

        <section class="space-y-6">
            <div class="space-y-3">
                <h2>Legenda</h2>
            </div>

            <ul class="readings">
                <li
                    v-for="reading in readings"
                    :key="reading.kind"
                    class="reading"
                >
                    <span
                        class="reading-glyph"
                        :class="`glyph-${reading.tone}`"
                        aria-hidden="true"
                    >
                        <svg viewBox="0 0 32 32">
                            <circle
                                v-if="reading.kind === 'alone'"
                                class="is-dashed"
                                cx="16"
                                cy="16"
                                r="10.5"
                            />
                            <template v-else>
                                <path
                                    :class="{ 'is-dashed': reading.dashed }"
                                    d="M5 16h22"
                                />
                                <path d="M22 11l5 5-5 5" />
                                <path
                                    v-if="reading.double"
                                    d="M10 11l-5 5 5 5"
                                />
                            </template>
                        </svg>
                    </span>

                    <div class="space-y-1.5">
                        <h3>{{ reading.title }}</h3>
                        <p class="text-sm">{{ reading.text }}</p>
                    </div>
                </li>
            </ul>
        </section>

        <section class="band">
            <div class="space-y-2.5">
                <p class="max-w-[52ch] text-sm">
                    ABGrid è un'app sviluppata con
                    <a href="https://github.com/vuejs/core" target="_blank" rel="noreferrer">Vue</a>,
                    il suo ecosistema
                    (<a href="https://github.com/vuejs/router" target="_blank" rel="noreferrer">Vue Router</a>
                    e <a href="https://github.com/vuejs/pinia" target="_blank" rel="noreferrer">Pinia</a>)
                    e <a href="https://github.com/graphology/graphology" target="_blank" rel="noreferrer">graphology</a>.
                    Lavora in locale: i dati restano sul tuo dispositivo e i calcoli avvengono nel browser.
                </p>
            </div>

            <BaseButton to="/sociogram">Apri l'app</BaseButton>
        </section>

        <!-- Support: a small, optional ask — donate or share. The blue-to-red
             gradient is the same signature the hero title uses, so the card
             reads as the brand's own voice rather than an off-the-shelf banner. -->
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
                        Offrici un caffè con una piccola donazione su PayPal, oppure
                        copia il link e condividilo con chi potrebbe trovarla utile.
                    </p>
                </div>

                <div class="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                        :href="paypalUrl"
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
                        Dona con PayPal
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
                        {{ copied ? "Copiato!" : "Copia il link" }}
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.hero {
    padding-block: 1.5rem 0.5rem;
}
</style>
