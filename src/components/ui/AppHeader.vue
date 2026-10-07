<script setup>
// --- Vue ----------------
import { onBeforeUnmount, watch } from "vue";

// --- Routers ------------
import { RouterLink, useRoute } from "vue-router";

// --- Stores -------------

// --- Components ---------
import AppLogo from "@/components/ui/AppLogo.vue";
import MenuIcon from "@/components/ui/icons/MenuIcon.vue";
import NavAppIcon from "@/components/ui/icons/NavAppIcon.vue";
import NavDocsIcon from "@/components/ui/icons/NavDocsIcon.vue";
import NavAboutIcon from "@/components/ui/icons/NavAboutIcon.vue";

// --- Composables --------
import { useDisclosure } from "@/composables/useDisclosure";
import { useNavItems } from "@/composables/useNavItems";

// --- Props --------------

// --- Emits --------------

// --- State --------------
const route = useRoute();
const { isOpen, close, toggle } = useDisclosure();
const { navItems } = useNavItems("header");

// Each menu entry maps to its hand-drawn icon (see src/components/ui/icons/).
const navIcons = {
    sociogram: NavAppIcon,
    docs: NavDocsIcon,
    about: NavAboutIcon,
};

// --- Computed -----------

// --- Watchers -----------
// Navigating closes the collapsed menu.
watch(() => route.fullPath, close);

// When the panel is open, the page under the backdrop must not scroll.
watch(isOpen, (open) =>
    document.body.classList.toggle("overflow-hidden", open),
);

// --- Lifecycle ----------
onBeforeUnmount(() => document.body.classList.remove("overflow-hidden"));

// --- Methods ------------
</script>

<template>
    <header class="site-header">
        <div
            class="mx-auto flex h-(--header-h) max-w-4xl items-center justify-between px-6"
        >
            <AppLogo />

            <button
                class="nav-toggle"
                :aria-expanded="isOpen"
                aria-controls="main-nav"
                :aria-label="isOpen ? 'Chiudi il menu' : 'Apri il menu'"
                @click="toggle"
            >
                <MenuIcon :open="isOpen" />
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
                    <component :is="navIcons[item.name]" />
                    <span>{{ item.meta.title }}</span>
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
