
<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import AppCardEdu from "@/components/ui/AppCardEdu.vue";
import AppCardEmail from "@/components/ui/AppCardEmail.vue";

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
                <h1>Cosa si nasconde sotto il cofano?</h1>
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
                <AppCardEdu />
                <AppCardEmail />
            </div>
        </section>
    </div>
</template>
