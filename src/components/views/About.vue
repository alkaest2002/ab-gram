
<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
import packageJson from "../../../package.json";

// Runtime (dependencies) and build-time (devDependencies) packages, read from
// package.json so this page never drifts from the lockfile.
const stripRange = (version) => version.replace(/^[\^~]/, "");

const dependencies = Object.entries(packageJson.dependencies ?? {}).map(
    ([name, version]) => ({ name, version: stripRange(version) }),
);

const devDependencies = Object.entries(packageJson.devDependencies ?? {}).map(
    ([name, version]) => ({ name, version: stripRange(version) }),
);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="page">
        <section class="space-y-8">
            <header class="space-y-2">
                <p class="eyebrow">Dettagli tecnici</p>
                <h1>Cosa si nascondo sotto il cofano?</h1>
            </header>

            <p>
                AB-Grid è un'applicazione web costruita con Vue 3 e Vite.
                Queste sono le librerie che la fanno funzionare, dal calcolo
                delle metriche di rete al rendering dei grafici.
            </p>

            <div class="grid gap-8 sm:grid-cols-2">
                <div class="card">
                    <h3
                        class="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
                    >
                        Dipendenze
                    </h3>
                    <ul class="space-y-2 mt-6">
                        <li
                            v-for="pkg in dependencies"
                            :key="pkg.name"
                            class="flex items-baseline justify-between gap-4"
                        >
                            <span
                                class="min-w-0 wrap-break-words font-mono text-sm text-ink"
                            >
                                {{ pkg.name }}
                            </span>
                            <span class="shrink-0 font-mono text-xs text-muted">
                                {{ pkg.version }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="card">
                    <h3
                        class="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
                    >
                        Strumenti di sviluppo
                    </h3>
                    <ul class="space-y-2 mt-6">
                        <li
                            v-for="pkg in devDependencies"
                            :key="pkg.name"
                            class="flex items-baseline justify-between gap-4"
                        >
                            <span
                                class="min-w-0 wrap-break-words font-mono text-sm text-ink"
                            >
                                {{ pkg.name }}
                            </span>
                            <span class="shrink-0 font-mono text-xs text-muted">
                                {{ pkg.version }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="space-y-8">
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
                        <p class="text-sm">
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
