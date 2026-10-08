<script setup>
// --- Vue ----------------
import { onMounted } from "vue";

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------
import Hero from "@/components/views/home/Hero.vue";
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
                <Hero />
            </section>

            <!-- Sociogram -->
            <section class="w-full">
                <SociogramPreview />
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
            <section class="w-full">
                <DonationCard />
            </section>

        </div>
    </div>
</template>
