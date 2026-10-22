<script setup>
// --- Imports ------------
//   -- From components
import DonationCard from "@/components/ui/AppCardDonate.vue";
import EduCard from "@/components/ui/AppCardEdu.vue";
import Hero from "@/components/views/home/Hero.vue";
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import SociogramSteps from "@/components/views/home/SociogramSteps.vue";
import Featurettes from "@/components/views/home/Featurettes.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

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
    <div class="page home space-y-9 py-9 sm:space-y-12 sm:py-12">
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

            <!-- Donation / edu cards -->
            <section class="grid w-full gap-8 lg:grid-cols-2">
                <DonationCard />
                <EduCard />
            </section>

        </div>
    </div>
</template>
