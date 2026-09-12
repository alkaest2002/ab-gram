<script setup>
import { onBeforeUnmount, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

import AppLogo from "@/components/layout/AppLogo.vue";
import { useDisclosure } from "@/composables/useDisclosure";
import { useNavItems } from "@/composables/useNavItems";

const route = useRoute();
const { isOpen, close, toggle } = useDisclosure();
const { navItems } = useNavItems("header");

// Navigating closes the collapsed menu.
watch(() => route.fullPath, close);

// When the panel is open, the page under the backdrop must not scroll.
watch(isOpen, (open) =>
    document.body.classList.toggle("overflow-hidden", open),
);

onBeforeUnmount(() => document.body.classList.remove("overflow-hidden"));
</script>

<template>
    <header class="site-header">
        <div
            class="mx-auto flex h-(--header-h) max-w-3xl items-center justify-between px-6"
        >
            <AppLogo />

            <button
                class="nav-toggle"
                :aria-expanded="isOpen"
                aria-controls="main-nav"
                :aria-label="isOpen ? 'Chiudi il menu' : 'Apri il menu'"
                @click="toggle"
            >
                <svg
                    class="size-5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    stroke-width="1.5"
                >
                    <path v-if="isOpen" d="M6 6l12 12M18 6L6 18" />
                    <path v-else d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            </button>

            <nav
                id="main-nav"
                class="site-nav"
                :data-open="isOpen"
                aria-label="Navigazione principale"
            >
                <RouterLink
                    v-for="item in navItems"
                    :key="item.path"
                    :to="item.path"
                    class="nav-link"
                >
                    {{ item.meta.label }}
                </RouterLink>
            </nav>
        </div>

        <!-- Clickable backdrop: closes the panel when tapped outside. -->
        <div
            class="nav-backdrop"
            :data-open="isOpen"
            aria-hidden="true"
            @click="close"
        />
    </header>
</template>
