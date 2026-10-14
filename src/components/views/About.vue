
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

// Runtime dependencies, read from package.json so this page never drifts from
// the lockfile.
const stripRange = (version) => version.replace(/^[\^~]/, "");

// Public GitHub repositories for the runtime dependencies.
const repositories = {
    graphology: "https://github.com/graphology/graphology",
    "graphology-components": "https://github.com/graphology/graphology",
    "graphology-layout": "https://github.com/graphology/graphology",
    "graphology-layout-forceatlas2": "https://github.com/graphology/graphology",
    "graphology-metrics": "https://github.com/graphology/graphology",
    "graphology-operators": "https://github.com/graphology/graphology",
    mathjax: "https://github.com/mathjax/MathJax",
    "numpy-ts": "https://github.com/dupontcyborg/numpy-ts",
    pinia: "https://github.com/vuejs/pinia",
    "unplugin-vue-markdown": "https://github.com/unplugin/unplugin-vue-markdown",
    vue: "https://github.com/vuejs/core",
    "vue-router": "https://github.com/vuejs/router",
};

const dependencies = Object.entries(packageJson.dependencies ?? {}).map(
    ([name, version]) => ({
        name,
        version: stripRange(version),
        repository: repositories[name],
    }),
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

            <div class="card">
                <h3
                    class="font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
                >
                    Dipendenze
                </h3>
                <div class="mt-6 overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-line">
                                <th
                                    class="py-2 pr-4 font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
                                >
                                    Libreria
                                </th>
                                <th
                                    class="py-2 pr-4 font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
                                >
                                    Versione
                                </th>
                                <th
                                    class="py-2 font-mono text-xs font-medium tracking-[0.14em] text-muted uppercase"
                                >
                                    Repository
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="pkg in dependencies"
                                :key="pkg.name"
                                class="border-b border-line last:border-0"
                            >
                                <td
                                    class="py-2 pr-4 font-mono text-sm whitespace-nowrap text-ink"
                                >
                                    {{ pkg.name }}
                                </td>
                                <td
                                    class="py-2 pr-4 font-mono text-xs whitespace-nowrap text-muted"
                                >
                                    {{ pkg.version }}
                                </td>
                                <td class="py-2">
                                    <a
                                        v-if="pkg.repository"
                                        :href="pkg.repository"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="font-mono text-xs break-all text-accent transition-colors hover:text-ink"
                                    >
                                        {{ pkg.repository }}
                                    </a>
                                    <span v-else class="font-mono text-xs text-muted">
                                        —
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section class="space-y-8">
            <div class="grid gap-8 sm:grid-cols-2">
                <AppCardEmail :buttonVariant="'solid'" />
                <AppCardEdu />
            </div>
        </section>
    </div>
</template>
