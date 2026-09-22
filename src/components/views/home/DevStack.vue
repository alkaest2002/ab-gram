<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
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
    <section class="band">
        <div class="space-y-2.5">
            <p class="max-w-[52ch] text-sm">
                ABGrid è un'app sviluppata con
                <a href="https://github.com/vuejs/core" target="_blank" rel="noreferrer">Vue.js</a>,
                il suo ecosistema
                (<a href="https://github.com/vuejs/router" target="_blank" rel="noreferrer">Vue Router</a>
                e <a href="https://github.com/vuejs/pinia" target="_blank" rel="noreferrer">Pinia</a>),
                <a href="https://github.com/graphology/graphology" target="_blank" rel="noreferrer">graphology</a>,
                <a href="https://github.com/dupontcyborg/numpy-ts" target="_blank" rel="noreferrer">numpy-ts</a>.
                Lavora in locale: i dati restano sul tuo dispositivo e i calcoli avvengono nel browser.
            </p>
        </div>

        <BaseButton to="/sociogram">Apri l'app</BaseButton>
    </section>
</template>
