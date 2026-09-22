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

        <SociogramLegend />

        <DevStack />

        <DonationCard />
    </div>
</template>
