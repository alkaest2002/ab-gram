<script setup>
// --- Vue ----------------
import { onMounted } from "vue";

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import SociogramSteps from "@/components/views/home/SociogramSteps.vue";
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
        <div class="flex flex-col items-center text-center space-y-18">

            <!-- Hero -->
            <section class="w-full">
                <p class="eyebrow">Sociometria nel browser</p>

                <h1 class="hero-title mt-3">
                    Analizza le <em>dinamiche dei gruppi</em>
                </h1>

                <p class="lede mx-auto mt-6 max-w-[56ch]">
                    Registra
                    <strong class="font-semibold text-accent">scelte</strong> e
                    <strong class="font-semibold text-reject">rifiuti</strong>
                    dei membri di un gruppo. AB-Grid pensa al resto.
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

            </section>

            <!-- Sociogram Steps -->
            <section class="w-full">
                <SociogramSteps />
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
