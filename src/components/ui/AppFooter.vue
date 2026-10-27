<script setup>
// --- Imports ------------
//   -- From vue-router
import { RouterLink } from "vue-router";

//   -- From components
import ShieldIcon from "@/components/ui/icons/ShieldIcon.vue";
import GithubIcon from "@/components/ui/icons/GithubIcon.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const originYear = 2026
const currentYear = new Date().getFullYear();


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
                <a
                    href="https://github.com/alkaest2002/ab-gram"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                >
                    <GithubIcon />
                    GitHub
                </a>

                <RouterLink
                    to="/privacy"
                    class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink cursor-pointer"
                >
                    <ShieldIcon />
                    GDPR | Privacy
                </RouterLink>
            </nav>
        </div>
    </footer>
</template>
