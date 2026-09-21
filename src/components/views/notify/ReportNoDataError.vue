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
        <!-- Empty sheet: a document with nothing on it — the universal
             "there is nothing to report" mark, in the app's muted colour. -->
        <svg viewBox="0 0 64 64" class="size-14 shrink-0" aria-hidden="true">
            <path
                d="M20 10h18l10 10v34H20Z"
                class="fill-none stroke-muted stroke-[1.5]"
                stroke-linejoin="round"
            />
            <path
                d="M38 10v10h10"
                class="fill-none stroke-muted stroke-[1.5]"
                stroke-linejoin="round"
            />
            <path
                d="M28 30h14"
                class="stroke-muted stroke-[1.5]"
                stroke-linecap="round"
                stroke-dasharray="4 4"
            />
            <path
                d="M28 38h10"
                class="stroke-muted stroke-[1.5]"
                stroke-linecap="round"
                stroke-dasharray="4 4"
            />
        </svg>

        <div class="mt-6 space-y-3">
            <p class="eyebrow">Report</p>
            <h1 class="text-balance">Nessun dato da elaborare</h1>
            <p class="lede mx-auto">
                Non ci sono ancora dati per generare il report.
            </p>
        </div>

        <div
            class="mt-10 flex w-full flex-col items-center gap-4 border-t border-line pt-8"
        >
            <p class="max-w-[52ch] text-sm">
                Inserisci preferenze e rifiuti dei membri del gruppo, poi torna
                qui per generare il report.
            </p>
            <BaseButton to="/sociogram" variant="outline">
                Inserisci i dati
            </BaseButton>
        </div>
    </div>
</template>
