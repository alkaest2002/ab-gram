<script setup>
// --- Vue ----------------

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------
import PrivacyIcon from "@/components/ui/icons/PrivacyIcon.vue";
import EmailIcon from "@/components/ui/icons/EmailIcon.vue";

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
        icon: PrivacyIcon,
    },
    {
        label: "Email",
        href: "mailto:info@ab-grid.example",
        icon: EmailIcon,
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
                <p class="text-xs">
                    {{ originYear }} | {{ currentYear }} &copy; AB-Grid rilasciato con
                    <a href="https://opensource.org/licenses/MIT" target="_blank">Licenza MIT</a>
                </p>
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
                    <component :is="link.icon" />
                    {{ link.label }}
                </component>
            </nav>
        </div>
    </footer>
</template>
