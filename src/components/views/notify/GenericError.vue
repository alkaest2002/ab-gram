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
            <!-- Warning triangle: the universal "something went wrong" mark,
                 in the app's red error colour. -->
            <svg
                viewBox="0 0 64 64"
                class="size-24 shrink-0"
                aria-hidden="true"
            >
                <path
                    d="M32 8 59 55 H5 Z"
                    class="fill-none stroke-reject stroke-2"
                    stroke-linejoin="round"
                />
                <path
                    d="M32 27v14"
                    class="stroke-reject stroke-2"
                    stroke-linecap="round"
                />
                <circle cx="32" cy="49" r="1.6" class="fill-reject" />
            </svg>

            <div class="space-y-3">
                <p class="eyebrow">Errore</p>
                <h1>Ooops! Qualcosa è andato storto</h1>
                <p class="lede mx-auto">
                    Si è verificato un problema imprevisto.
                </p>
            </div>
        </div>

        <section class="card">
            <p>
                Riprova tra poco. Se il problema persiste, segnalalo a chi
                gestisce l'applicazione.
            </p>
            <BaseButton to="/">Torna alla home</BaseButton>
        </section>
    </div>
</template>
