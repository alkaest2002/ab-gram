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
        <div class="flex flex-col items-center text-center">
            <section class="mt-7 w-full">
                <p class="eyebrow">Sociometria nel browser</p>

                <h1 class="hero-title mt-3">
                    Analizza le <em>dinamiche dei gruppi</em>
                </h1>

                <!-- The lede teaches the colour code: blue is a choice, red a
                     rejection — the same pair as the logo and the graph. -->
                <p class="lede mx-auto mt-6 max-w-[56ch]">
                    Registra le
                    <strong class="font-semibold text-accent">scelte</strong> e
                    i
                    <strong class="font-semibold text-reject">rifiuti</strong>
                    dei membri di un gruppo. AB-Grid pensa a tutto il resto.
                </p>
            </section>

            <!-- Edge -->
            <div
                class="mt-10 flex flex-col items-center sm:mt-14"
                aria-hidden="true"
            >
                <span class="h-12 w-px bg-ink sm:h-16"></span>
                <svg
                    class="-mt-px size-2.5 text-ink"
                    viewBox="0 0 10 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="m1 1 4 4 4-4" />
                </svg>
            </div>

            <section class="mt-7 w-full space-y-6">
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
                    <li class="flex items-center gap-2">
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
                            <path d="m22 2 5 4-5 4" />
                        </svg>
                        scelta
                    </li>
                    <li class="flex items-center gap-2">
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
                            <path d="M4 6h24" />
                            <path d="m9 2-5 4 5 4" />
                            <path d="m23 2 5 4-5 4" />
                        </svg>
                        reciproca
                    </li>
                    <li class="flex items-center gap-2">
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
                            <path d="M2 6h25" stroke-dasharray="3.5 3.5" />
                            <path d="m22 2 5 4-5 4" />
                        </svg>
                        rifiuto
                    </li>
                    <li class="flex items-center gap-2">
                        <svg
                            class="size-3.5"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            aria-hidden="true"
                        >
                            <circle
                                cx="8"
                                cy="8"
                                r="6.5"
                                stroke-dasharray="2.5 3.5"
                            />
                        </svg>
                        isolamento
                    </li>
                </ul>
            </section>

            <!-- Edge -->
            <div
                class="mt-10 flex flex-col items-center sm:mt-14"
                aria-hidden="true"
            >
                <span class="h-12 w-px bg-ink sm:h-16"></span>
                <svg
                    class="-mt-px size-2.5 text-ink"
                    viewBox="0 0 10 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="m1 1 4 4 4-4" />
                </svg>
            </div>

            <section class="mt-7 w-full">
                <p class="eyebrow">Tre passaggi</p>
                <h2 class="mt-3">Dai nomi al sociogramma</h2>

                <p class="flow mt-5 justify-center">
                    <span>Nomi</span>
                    <span class="flow-sep" aria-hidden="true">→</span>
                    <span>Scelte e rifiuti</span>
                    <span class="flow-sep" aria-hidden="true">→</span>
                    <span>Sociogramma</span>
                </p>

            </section>

            <!-- Edge -->
            <div
                class="mt-10 flex flex-col items-center sm:mt-14"
                aria-hidden="true"
            >
                <span class="h-12 w-px bg-ink sm:h-16"></span>
                <svg
                    class="-mt-px size-2.5 text-ink"
                    viewBox="0 0 10 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="m1 1 4 4 4-4" />
                </svg>
            </div>

            <section class="mt-7 w-full">
                <Featurettes />
            </section>

            <!-- Edge -->
            <div
                class="mt-10 flex flex-col items-center sm:mt-14"
                aria-hidden="true"
            >
                <span class="h-12 w-px bg-ink sm:h-16"></span>
                <svg
                    class="-mt-px size-2.5 text-ink"
                    viewBox="0 0 10 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="m1 1 4 4 4-4" />
                </svg>
            </div>

            <!-- The donation card keeps its own left-aligned layout. -->
            <section class="mt-7 w-full max-w-2xl text-left">
                <DonationCard />
            </section>
        </div>
    </div>
</template>
