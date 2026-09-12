<script setup>
import { RouterLink } from "vue-router";

import AppLogo from "@/components/layout/AppLogo.vue";
import SocialLinks from "@/components/layout/SocialLinks.vue";
import { useNavItems } from "@/composables/useNavItems";

const { navItems } = useNavItems("footer");
</script>

<template>
    <footer class="mt-16 border-t border-line">
        <div
            class="mx-auto max-w-3xl gap-10 px-6 py-12 sm:flex sm:justify-between"
        >
            <div class="space-y-4">
                <AppLogo />
                <p class="max-w-xs text-sm">
                    Analisi sociometriche in tempo reale.
                </p>
                <SocialLinks />
            </div>

            <nav
                class="mt-10 space-y-2 sm:mt-0"
                aria-label="Navigazione secondaria"
            >
                <div class="flex flex-row items-start gap-1">
                    <RouterLink
                        v-for="item in navItems"
                        :key="item.path"
                        :to="item.path"
                        class="nav-link"
                    >
                        {{ item.meta.label }}
                    </RouterLink>
                </div>
            </nav>
        </div>
    </footer>
</template>
