<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import SociogramLegend from "@/components/views/home/SociogramLegend.vue";
import DonationCard from "@/components/views/home/DonationCard.vue";
import DevStack from "@/components/views/home/DevStack.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="page home">
        <section class="space-y-5 pt-6 pb-2">
            <h1 class="hero-title">Analizza le dinamiche dei gruppi</h1>

            <p class="lede"></p>
            <span class="block mb-0">Registra scelte e rifiuti dei membri di un gruppo.</span>
            <span>
                AB-Grid costruisce il sociogramma, calcola gli indici
                sociometrici, i grafici e prepara il report
            </span>
        </section>

        <SociogramPreview />

        <SociogramLegend />

        <DevStack />

        <DonationCard />
    </div>
</template>
