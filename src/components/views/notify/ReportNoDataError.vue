<script setup>
// --- Vue ----------------

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------

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
    <div class="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-6 py-14 text-center">
        <!-- Empty sheet: a document with nothing on it — the universal
             "there is nothing to report" mark, in the app's muted colour. -->
        <svg viewBox="0 0 64 64" class="size-24 shrink-0" aria-hidden="true">
            <path
                d="M20 10h18l10 10v34H20Z"
                class="fill-none stroke-muted stroke-2"
                stroke-linejoin="round"
            />
            <path
                d="M38 10v10h10"
                class="fill-none stroke-muted stroke-2"
                stroke-linejoin="round"
            />
            <path
                d="M28 30h14"
                class="stroke-muted stroke-2"
                stroke-linecap="round"
                stroke-dasharray="4 4"
            />
            <path
                d="M28 38h10"
                class="stroke-muted stroke-2"
                stroke-linecap="round"
                stroke-dasharray="4 4"
            />
        </svg>

        <div class="space-y-3">
            <p class="font-mono text-xs font-medium tracking-[0.14em] uppercase text-muted">
                Report
            </p>
            <h1>Nessun dato da elaborare</h1>
            <p class="mx-auto max-w-[46ch] text-base sm:text-[1.0625rem]">
                Non ci sono ancora dati per generare il report.
            </p>
        </div>

        <section
            class="w-full space-y-3 rounded-lg border border-line bg-canvas p-6 text-left"
        >
            <p>
                Inserisci preferenze e rifiuti dei membri del gruppo, poi torna
                qui per generare il report.
            </p>
            <RouterLink
                to="/sociogram"
                class="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/85"
            >
                Inserisci i dati
            </RouterLink>
        </section>
    </div>
</template>
