<script setup>
// --- Imports ------------
//   -- From vue-router
import { RouterLink } from "vue-router";

//   -- From components
import ShieldIcon from "@/components/ui/icons/ShieldIcon.vue";
import EmailIcon from "@/components/ui/icons/EmailIcon.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const originYear = 2026
const currentYear = new Date().getFullYear();

const links = [
    {
        label: "Privacy",
        to: "/privacy",
        icon: ShieldIcon,
    },
    {
        label: "Email",
        href: "mailto:info@ab-gram.example",
        icon: EmailIcon,
    },
];

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <footer class="mt-16 border-t border-line">
        <div
            class="flex flex-col gap-8 px-6 pt-4 pb-10 sm:flex-row sm:items-start sm:justify-between"
        >
            <div class="space-y-3">
                <p class="text-xs">
                    {{ originYear }} | {{ currentYear }} &copy; AB-Gram rilasciato con
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
