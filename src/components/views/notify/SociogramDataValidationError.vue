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
    <div
        class="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-14 text-center"
    >
        <!-- Cross in a circle: the universal "invalid data" mark, in the
             app's red error colour. -->
        <svg
            viewBox="0 0 64 64"
            class="size-14 shrink-0"
            aria-hidden="true"
        >
            <circle
                cx="32"
                cy="32"
                r="23"
                class="fill-none stroke-reject stroke-[1.5]"
            />
            <path
                d="M24 24l16 16"
                class="stroke-reject stroke-[1.5]"
                stroke-linecap="round"
            />
            <path
                d="M40 24 24 40"
                class="stroke-reject stroke-[1.5]"
                stroke-linecap="round"
            />
        </svg>

        <div class="mt-6 space-y-3">
            <p class="eyebrow">Errore di validazione</p>
            <h1 class="text-balance">Ooops! Qualcosa è andato storto</h1>
            <p class="lede mx-auto">
                I dati sociometrici non sono corretti.
            </p>
        </div>

        <div
            class="mt-10 flex w-full flex-col items-center gap-4 border-t border-line pt-8"
        >
            <p class="max-w-[52ch] text-sm">
                Controlla che i dati rispettino i requisiti e i vincoli
                richiesti, poi riprova.
            </p>
            <p class="max-w-[52ch] text-sm">
                Consulta la documentazione per i requisiti indispensabili. Se
                pensi che quest'errore sia un bug del software, contatta lo
                sviluppatore.
            </p>
            <BaseButton to="/docs" variant="outline">Consulta la documentazione</BaseButton>
        </div>
    </div>
</template>
