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
        <!-- Stop square: the universal "stopped" mark, in the app's muted colour
             (this is a user action, not an error). -->
        <svg
            viewBox="0 0 64 64"
            class="size-14 shrink-0"
            aria-hidden="true"
        >
            <rect
                x="22"
                y="22"
                width="20"
                height="20"
                rx="4"
                class="fill-none stroke-muted stroke-[1.5]"
            />
        </svg>

        <div class="mt-6 space-y-3">
            <p class="eyebrow">Report</p>
            <h1 class="text-balance">Generazione interrotta</h1>
            <p class="lede mx-auto">
                Hai interrotto la generazione del report.
            </p>
        </div>

        <div
            class="mt-10 flex w-full flex-col items-center gap-4 border-t border-line pt-8"
        >
            <p class="max-w-[52ch] text-sm">
                I dati inseriti non sono andati persi. Puoi tornare al
                sociogramma e riprovare quando vuoi.
            </p>
            <BaseButton to="/sociogram" variant="outline">
                Torna al sociogramma
            </BaseButton>
        </div>
    </div>
</template>
