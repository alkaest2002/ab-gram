<script setup>
// --- Vue ----------------

// --- Routers ------------

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
    <div class="page">
        <section class="space-y-4">
            <p class="eyebrow">Il progetto</p>
            <h1>AB-Grid</h1>
            <p class="lede max-w-[58ch]">
                Uno strumento di sociometria: raccoglie scelte e rifiuti
                all'interno di un gruppo e li trasforma in un grafico leggibile,
                per osservare le relazioni tra le persone.
            </p>
        </section>

        <section class="space-y-8">
            <header class="space-y-2">
                <p class="eyebrow">Perché è gratuito</p>
                <h2>Sociometria per tutti</h2>
            </header>

            <p>
                AB-Grid è distribuito gratuitamente per una scelta
                precisa: democratizzare l'uso della sociometria.
                Osservare e comprendere le relazioni di un gruppo non
                dovrebbe essere un privilegio di chi dispone di risorse o
                di software costosi, ma uno strumento alla portata di chi
                lavora ogni giorno con le persone.
            </p>

            <div class="grid gap-8 sm:grid-cols-2">
                <div
                    class="relative overflow-hidden rounded-lg border border-line bg-white"
                >
                    <div
                        class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
                        aria-hidden="true"
                    ></div>

                    <div class="flex items-start gap-4 p-6 sm:p-8">
                        <span
                            class="grid size-10 shrink-0 place-items-center rounded-lg bg-ink text-white"
                            aria-hidden="true"
                        >
                            <svg
                                class="size-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M22 10 12 5 2 10l10 5 10-5z" />
                                <path
                                    d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"
                                />
                            </svg>
                        </span>
                        <div class="space-y-1.5">
                            <h3 class="text-ink">
                                Insegni in una scuola pubblica?
                            </h3>
                            <p class="text-sm">
                                Se questo progetto ti è stato utile,
                                segnalalo al Ministero dell'Istruzione e
                                del Merito.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="relative overflow-hidden rounded-lg border border-line bg-white"
                >
                    <div
                        class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
                        aria-hidden="true"
                    ></div>

                    <div class="space-y-2 p-6 sm:p-8">
                        <h3 class="text-ink">Contatti</h3>
                        <p>
                            Scrivi a
                            <a href="mailto:info@ab-grid.com"
                                >info@ab-grid.com</a
                            >.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
