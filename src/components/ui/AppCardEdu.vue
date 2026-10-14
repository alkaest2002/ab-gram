<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import CopyLinkButton from "@/components/ui/CopyLinkButton.vue";

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
    <div class="relative overflow-hidden rounded-lg border border-line bg-white">
        <div
            class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
            aria-hidden="true"
        ></div>
        <div class="p-6 sm:p-8">
            <header class="space-y-2">
                <p class="eyebrow">Segnala il progetto</p>
                <h2 class="text-2xl">Insegni in una scuola pubblica?</h2>
            </header>

            <p class="mt-4 max-w-[52ch]">
                Se questo progetto ti è stato utile, segnalalo al
                Ministero dell'Istruzione e del Merito.
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CopyLinkButton />
            </div>
        </div>
    </div>
</template>
