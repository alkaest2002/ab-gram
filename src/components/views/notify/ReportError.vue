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
        <!-- Warning triangle: the universal "something went wrong" mark,
             in the app's red error colour. -->
        <svg
            viewBox="0 0 64 64"
            class="size-14 shrink-0"
            aria-hidden="true"
        >
            <path
                d="M32 8 59 55 H5 Z"
                class="fill-none stroke-reject stroke-[1.5]"
                stroke-linejoin="round"
            />
            <path
                d="M32 27v14"
                class="stroke-reject stroke-[1.5]"
                stroke-linecap="round"
            />
            <circle cx="32" cy="49" r="1.6" class="fill-reject" />
        </svg>

        <div class="mt-6 space-y-3">
            <p class="eyebrow">Errore</p>
            <h1 class="text-balance">Impossibile generare il report</h1>
            <p class="lede mx-auto">
                Si è verificato un problema durante la generazione del report.
            </p>
        </div>

        <div
            class="mt-10 flex w-full flex-col items-center gap-4 border-t border-line pt-8"
        >
            <p class="max-w-[52ch] text-sm">
                Riprova tra poco. Se il problema persiste, segnalalo a chi
                gestisce l'applicazione.
            </p>
            <BaseButton to="/sociogram" variant="outline">Riprova</BaseButton>
        </div>
    </div>
</template>
