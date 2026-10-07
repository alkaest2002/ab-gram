<script setup>
// --- Vue ----------------

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const originYear = 2026
const currentYear = new Date().getFullYear();

const links = [
    {
        label: "Privacy",
        to: "/privacy",
        paths: [
            "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        ],
    },
    {
        label: "Email",
        href: "mailto:info@ab-grid.example",
        paths: [
            "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
            "m3 7 9 6 9-6",
        ],
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <footer class="mt-16 border-t border-line">
        <div
            class="mx-auto flex max-w-4xl flex-col gap-8 px-6 pt-4 pb-10 sm:flex-row sm:items-start sm:justify-between"
        >
            <div class="space-y-3">
                <p class="text-sm">AB-Grid | Analisi sociometriche, {{ originYear }} &mdash; {{ currentYear }}</p>
            </div>

            <nav class="flex gap-6" aria-label="Informazioni">
                <component
                    :is="link.to ? RouterLink : 'a'"
                    v-for="link in links"
                    :key="link.to || link.href"
                    class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink cursor-pointer"
                    :to="link.to"
                    :href="link.href"
                >
                    <svg
                        class="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path v-for="path in link.paths" :key="path" :d="path" />
                    </svg>
                    {{ link.label }}
                </component>
            </nav>
        </div>
    </footer>
</template>
