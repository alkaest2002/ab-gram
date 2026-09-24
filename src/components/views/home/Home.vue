<script setup>
// --- Vue ----------------
import { onMounted } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import SociogramPreview from "@/components/views/home/SociogramPreview.vue";
import SociogramLegend from "@/components/views/home/SociogramLegend.vue";
import DonationCard from "@/components/views/home/DonationCard.vue";
import DevStack from "@/components/views/home/DevStack.vue";

// --- Composables --------
import { preloadWorker } from "@/utils/workerLoader";

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onMounted(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadWorker().catch((err) => {
        console.warn('Worker preload failed, will load on-demand:', err);
      });
    });
  }
});

// --- Methods ------------
</script>

<template>
    <div class="page home">
        <section>
            <h1
                class="mt-2 text-[2.125rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[3.125rem]"
            >
                Analizza le
                <span class="relative inline-block">
                    dinamiche dei gruppi
                    <span
                        class="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-linear-to-r from-accent to-reject"
                        aria-hidden="true"
                    ></span>
                </span>
            </h1>

            <p
                class="mt-6 max-w-[58ch] text-base leading-relaxed text-muted sm:text-[1.0625rem]"
            >
                Registra scelte e rifiuti dei membri di un gruppo. AB-Grid pensa
                a tutto il resto.
            </p>
        </section>

        <SociogramPreview />

        <SociogramLegend />

        <DevStack />

        <DonationCard />
    </div>
</template>
