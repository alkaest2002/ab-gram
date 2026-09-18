<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Utilities ----------

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="page">
        <div class="flex flex-col items-center gap-6 text-center">
            <!-- Cross in a circle: the universal "invalid data" mark, in the
                 app's red error colour. -->
            <svg
                viewBox="0 0 64 64"
                class="size-24 shrink-0"
                aria-hidden="true"
            >
                <circle
                    cx="32"
                    cy="32"
                    r="23"
                    class="fill-none stroke-reject stroke-2"
                />
                <path
                    d="M24 24l16 16"
                    class="stroke-reject stroke-2"
                    stroke-linecap="round"
                />
                <path
                    d="M40 24 24 40"
                    class="stroke-reject stroke-2"
                    stroke-linecap="round"
                />
            </svg>

            <div class="space-y-3">
                <p class="eyebrow">Errore di validazione</p>
                <h1>Ooops! Qualcosa è andato storto</h1>
                <p class="lede mx-auto">
                    I dati sociometrici non sono corretti.
                </p>
            </div>
        </div>

        <section class="card">
            <p>
                Controlla che i dati rispettino i requisiti e i vincoli
                richiesti, poi riprova.
            </p>
            <p>
                Consulta la documentazione per i requisiti indispensabili. Se
                pensi che quest'errore sia un bug del software, contatta lo
                sviluppatore.
            </p>
            <BaseButton to="/docs">Consulta la documentazione</BaseButton>
        </section>
    </div>
</template>
