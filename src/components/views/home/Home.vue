<script setup>
// --- Vue ----------------
import { onMounted } from "vue";

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import DonationCard from "@/components/views/home/DonationCard.vue";
import Featurettes from "@/components/views/home/Featurettes.vue";

// --- Composables --------
import { preloadWorker } from "@/utils/workerLoader";

// --- Props --------------

// --- Emits --------------

// --- State --------------
const steps = [
    {
        title: "Gruppo",
        text: "Inserisci i membri del gruppo.",
    },
    {
        title: "Scelte e rifiuti",
        text: "Indica scelte e rifiuti di tutti.",
    },
    {
        title: "Sociogramma",
        text: "AB-Grid calcola indici e grafici.",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onMounted(() => {
    if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
            preloadWorker().catch((err) => {
                console.warn(
                    "Worker preload failed, will load on-demand:",
                    err,
                );
            });
        });
    }
});

// --- Methods ------------
</script>

<template>
    <!--
      The page is laid out as a vertical sociogram running down the centre:
      numbered nodes (circles styled like the members of the graph) joined by
      directed edges. The call to action is the filled "star" node and the
      donation card is the dashed "isolated" one — the member nobody has
      chosen yet.
    -->
    <div class="page home">
        <div class="flex flex-col items-center text-center space-y-18">

            <!-- Hero -->
            <section class="w-full">
                <p class="eyebrow">Sociometria nel browser</p>

                <h1 class="hero-title mt-3">
                    Analizza le <em>dinamiche dei gruppi</em>
                </h1>

                <p class="lede mx-auto mt-6 max-w-[56ch]">
                    Registra le
                    <strong class="font-semibold text-accent">scelte</strong> e
                    i
                    <strong class="font-semibold text-reject">rifiuti</strong>
                    dei membri di un gruppo. AB-Grid pensa a tutto il resto.
                </p>
            </section>

            <!-- Sociogram -->
            <section class="w-full space-y-6">
                <header class="mx-auto max-w-2xl space-y-3">
                    <p class="eyebrow">Un esempio</p>
                    <h2>Il gruppo, a colpo d'occhio</h2>
                </header>

                <div class="mx-auto w-full max-w-136">
                    <SociogramPreview />
                </div>

                <!-- Micro-key: one mono line instead of a full legend. -->
                <ul
                    class="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 font-mono text-xs text-muted"
                    aria-label="Come leggere il grafo"
                >
                    <li class="flex items-center gap-2 text-sm">
                        <svg
                            class="h-3 w-8 text-accent"
                            viewBox="0 0 32 12"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M2 6h25" />
                        </svg>
                        scelta
                    </li>
                    <li class="flex items-center gap-2 text-sm">
                        <svg
                            class="h-3 w-8 text-reject"
                            viewBox="0 0 32 12"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M2 6h25" />
                        </svg>
                        rifiuto
                    </li>
                </ul>
            </section>

            <!-- Sociogram Steps -->
            <section class="w-full">
                <p class="eyebrow">Tre passaggi</p>
                <h2 class="mt-3">Dai nomi al sociogramma</h2>

                <ol
                    class="mx-auto mt-10 grid max-w-3xl list-none grid-cols-1 gap-11 p-0 sm:grid-cols-3"
                >
                    <li
                        v-for="(step, i) in steps"
                        :key="step.title"
                        class="relative flex flex-col items-center rounded-lg border border-line bg-white px-5 pt-0 pb-6"
                    >
                        <!-- Numbered node, like a member of the graph. -->
                        <span
                            class="-mt-4 grid size-8 place-items-center rounded-full font-mono text-sm font-semibold text-white ring-4 ring-white"
                            :class="i === steps.length - 1 ? 'bg-accent' : 'bg-ink'"
                            aria-hidden="true"
                        >
                            {{ i + 1 }}
                        </span>

                        <!-- Mini graph: the step as the sociogram would draw it. -->
                        <svg
                            class="mt-5 h-12 w-24"
                            viewBox="0 0 96 48"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <!-- 1 · Nomi: members, not yet connected -->
                            <g v-if="i === 0" class="text-ink">
                                <circle cx="16" cy="24" r="6" />
                                <circle cx="48" cy="24" r="6" />
                                <circle cx="80" cy="24" r="6" />
                            </g>

                            <!-- 2 · Scelte e rifiuti: a choice and a rejection -->
                            <g v-else-if="i === 1">
                                <g class="text-ink">
                                    <circle cx="16" cy="24" r="6" />
                                    <circle cx="48" cy="24" r="6" />
                                    <circle cx="80" cy="24" r="6" />
                                </g>
                                <g class="text-accent">
                                    <path d="M23 24h18" />
                                    <path d="m37.5 21 3.5 3-3.5 3" />
                                </g>
                                <g class="text-reject">
                                    <path d="M55 24h18" />
                                    <path d="m69.5 21 3.5 3-3.5 3" />
                                </g>
                            </g>

                            <!-- 3 · Sociogramma: reciprocal pair, star, isolate -->
                            <g v-else>
                                <g class="text-accent">
                                    <path d="M24 24h16" />
                                    <path d="m26.5 21-3.5 3 3.5 3" />
                                    <path d="m37.5 21 3.5 3-3.5 3" />
                                </g>
                                <circle cx="16" cy="24" r="6" class="text-ink" fill="currentColor" />
                                <circle cx="48" cy="24" r="6" class="text-ink" fill="currentColor" />
                                <circle
                                    cx="80"
                                    cy="24"
                                    r="6"
                                    class="text-ink"
                                    stroke-dasharray="2.5 3"
                                />
                            </g>
                        </svg>

                        <h3 class="mt-5 text-base font-semibold text-ink">
                            {{ step.title }}
                        </h3>
                        <p class="mt-2 max-w-[28ch] text-sm">{{ step.text }}</p>
                    </li>
                </ol>
            </section>

            <!-- featurettes -->
            <section class="w-full">
                <Featurettes />
            </section>

            <!-- Donation card -->
            <section class="w-full max-w-2xl text-left">
                <DonationCard />
            </section>

        </div>
    </div>
</template>
