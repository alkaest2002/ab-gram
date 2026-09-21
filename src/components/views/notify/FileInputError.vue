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
        <!-- Document with an exclamation mark: the universal "unreadable file"
             mark, in the app's red error colour. -->
        <svg
            viewBox="0 0 64 64"
            class="size-14 shrink-0"
            aria-hidden="true"
        >
            <path
                d="M20 10h18l10 10v34H20Z"
                class="fill-none stroke-reject stroke-[1.5]"
                stroke-linejoin="round"
            />
            <path
                d="M38 10v10h10"
                class="fill-none stroke-reject stroke-[1.5]"
                stroke-linejoin="round"
            />
            <path
                d="M32 26v11"
                class="stroke-reject stroke-[1.5]"
                stroke-linecap="round"
            />
            <circle cx="32" cy="43" r="1.6" class="fill-reject" />
        </svg>

        <div class="mt-6 space-y-3">
            <p class="eyebrow">Errore file</p>
            <h1 class="text-balance">Il file non può essere caricato</h1>
            <p class="lede mx-auto">
                Il file selezionato non è un archivio sociogramma valido.
            </p>
        </div>

        <div
            class="mt-10 flex w-full flex-col items-center gap-4 border-t border-line pt-8"
        >
            <p class="max-w-[52ch] text-sm">
                Controlla che il file sia un archivio sociogramma valido e che
                non superi la dimensione massima consentita, poi riprova.
            </p>
            <BaseButton to="/sociogram" variant="outline">Riprova</BaseButton>
        </div>
    </div>
</template>
