<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import EmailIcon from "@/components/ui/icons/EmailIcon.vue";

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
                <p class="eyebrow">Contatti</p>
                <h2 class="text-2xl">Hai una domanda?</h2>
            </header>

            <p class="mt-4 max-w-[52ch]">
                Scrivici e ti risponderemo il prima possibile.
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                    href="mailto:info@ab-grid.com"
                    class="btn btn-solid w-full sm:w-auto"
                >
                    <EmailIcon size="size-4" />
                    Scrivi a info@ab-grid.com
                </a>
            </div>
        </div>
    </div>
</template>
