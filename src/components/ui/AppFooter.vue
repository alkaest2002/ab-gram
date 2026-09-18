<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import AppLogo from "@/components/ui/AppLogo.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
// Hand-drawn SVG paths: no icon dependency, no files to load.
const links = [
    {
        label: "GitHub",
        href: "https://github.com/ab-grid",
        external: true,
        paths: ["M9 18l-6-6 6-6", "M15 6l6 6-6 6"],
    },
    {
        label: "Email",
        href: "mailto:info@ab-grid.example",
        external: false,
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
            class="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between"
        >
            <div class="space-y-3">
                <AppLogo />
                <p class="max-w-xs text-sm">
                    Analisi sociometriche in tempo reale.
                </p>
            </div>

            <nav class="flex gap-6" aria-label="Contatti">
                <a
                    v-for="link in links"
                    :key="link.href"
                    class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                    :href="link.href"
                    :target="link.external ? '_blank' : undefined"
                    :rel="link.external ? 'noreferrer' : undefined"
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
                </a>
            </nav>
        </div>
    </footer>
</template>
