<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From components.
import DiscordCard from "@/components/ui/AppDiscordCard.vue";
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
      discord card is the dashed "isolated" one — the member nobody has
      chosen yet.
    -->
  <div class="page home py-12 sm:py-16">
    <div class="flex flex-col items-center gap-16 text-center sm:gap-16">
      <!-- Hero -->
      <section class="w-full">
        <Hero />
      </section>

      <!-- Sociogram -->
      <section class="w-full max-w-212.5">
        <SociogramPreview />
      </section>

      <!-- Sociogram Steps -->
      <section class="w-full max-w-212.5">
        <SociogramSteps />
      </section>

      <!-- featurettes -->
      <section class="w-full">
        <Featurettes />
      </section>

      <!-- Discord / edu cards -->
      <section class="grid w-full gap-8 lg:grid-cols-2">
        <DiscordCard :button-variant="'solid'" />
        <EduCard />
      </section>
    </div>
  </div>
</template>
