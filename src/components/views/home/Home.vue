<script setup>
// --- Vue ----------------

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import SociogramLegend from "@/components/views/home/SociogramLegend.vue";
import DonationCard from "@/components/views/home/DonationCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

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

        <SociogramLegend />

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

        <DonationCard />
    </div>
</template>

<style scoped>
.hero {
    padding-block: 1.5rem 0.5rem;
}
</style>
