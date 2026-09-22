<script setup>
// --- Json ---------------
import packages from "../../../../package.json"

// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
// The build stack, read like a manifest: package name, what it does, and the
// version pinned in package.json.
const stack = [
    {
        name: "Vue",
        role: "app",
        version: packages.dependencies.vue.substring(1),
        href: "https://github.com/vuejs/core",
    },
    {
        name: "Pinia",
        role: "data store",
        version: packages.dependencies.pinia.substring(1),
        href: "https://github.com/vuejs/pinia",
    },
    {
        name: "Numpy-ts",
        role: "calcoli numerici",
        version: packages.dependencies["numpy-ts"].substring(1),
        href: "https://github.com/dupontcyborg/numpy-ts",
    },
    {
        name: "Graphology",
        role: "grafi",
        version: packages.dependencies.graphology.substring(1),
        href: "https://github.com/graphology/graphology",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <section
        class="relative overflow-hidden rounded-lg border border-line bg-white"
    >
        <!-- The brand pair as a top rule: the same blue→red underline as the hero. -->
        <div
            class="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent to-reject"
            aria-hidden="true"
        ></div>

        <div class="p-6 sm:p-8">
            <header class="space-y-2">
                <p class="eyebrow">Stack tecnologico</p>
                <h2>Strumenti open source</h2>
            </header>

            <ul class="mt-6 border-y border-line">
                <li
                    v-for="item in stack"
                    :key="item.name"
                    class="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-t border-line py-2.5 first:border-t-0"
                >
                    <a
                        :href="item.href"
                        target="_blank"
                        rel="noreferrer"
                        class="font-mono text-sm font-semibold text-ink transition-colors hover:text-accent"
                    >
                        {{ item.name }}
                    </a>
                    <span class="font-mono text-xs text-muted">{{
                        item.role
                    }}</span>
                    <span class="font-mono text-xs tabular-nums text-accent">{{
                        item.version
                    }}</span>
                </li>
            </ul>

            <div
                class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <p class="max-w-[44ch] text-sm">
                    <span class="font-bold">AB-Grid</span> lavora in locale: i
                    calcoli avvengono nel browser e i dati restano sul tuo
                    dispositivo.
                </p>
                <BaseButton to="/sociogram">Apri l'app</BaseButton>
            </div>
        </div>
    </section>
</template>
