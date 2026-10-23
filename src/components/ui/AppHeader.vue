<script setup>
// --- Imports ------------
//   -- From vue
import { onBeforeUnmount, watch } from "vue";

//   -- From vue-router
import { RouterLink, useRoute } from "vue-router";

//   -- From components
import AppLogo from "@/components/ui/AppLogo.vue";
import MenuIcon from "@/components/ui/icons/MenuIcon.vue";
import NavAppIcon from "@/components/ui/icons/NavAppIcon.vue";
import NavDocsIcon from "@/components/ui/icons/NavDocsIcon.vue";
import NavAboutIcon from "@/components/ui/icons/NavAboutIcon.vue";

//   -- From composables
import { useDisclosure } from "@/composables/useDisclosure";
import { useNavItems } from "@/composables/useNavItems";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------
const route = useRoute();

// --- Stores -------------

// --- State --------------
// Each menu entry maps to its hand-drawn icon (see src/components/ui/icons/).
const navIcons = {
    sociogram: NavAppIcon,
    docs: NavDocsIcon,
    about: NavAboutIcon,
};

// --- Composables --------
const { isOpen, close, toggle } = useDisclosure();
const { navItems } = useNavItems("header");

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
// A header item is active on its own route and on any child route.
const isActive = (path) =>
    route.path === path || route.path.startsWith(`${path}/`);
</script>

<template>
    <header class="sticky top-0 z-20 border-b border-line">
        <div
            class="pointer-events-none absolute inset-0 -z-10 bg-canvas/85 backdrop-blur"
            aria-hidden="true"
        />

        <div class="flex h-(--header-h) items-center justify-between px-6">
            <AppLogo />

            <button
                class="relative z-50 rounded-md p-2 text-ink transition-colors hover:bg-ink/5 sm:hidden"
                :aria-expanded="isOpen"
                aria-controls="main-nav"
                :aria-label="isOpen ? 'Chiudi il menu' : 'Apri il menu'"
                @click="toggle"
            >
                <MenuIcon :open="isOpen" />
            </button>

            <nav
                id="main-nav"
                class="invisible fixed inset-x-3 top-(--header-h) z-40 flex origin-top flex-col gap-0.5 overflow-y-auto rounded-2xl border border-line bg-canvas/95 p-2 opacity-0 backdrop-blur-md transition-[opacity,translate,scale] duration-200 ease-out max-h-[calc(100dvh-var(--header-h)-0.75rem)] [box-shadow:0_18px_40px_-18px_color-mix(in_oklab,var(--color-ink)_35%,transparent)] -translate-y-2 scale-[0.98]
                    data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100
                    sm:static sm:inset-auto sm:z-auto sm:w-auto sm:max-h-none sm:flex-row sm:items-center sm:gap-1 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:opacity-100 sm:shadow-none sm:backdrop-blur-none sm:visible sm:translate-y-0 sm:scale-100"
                :data-open="isOpen"
                aria-label="Navigazione principale"
            >
                <RouterLink
                    v-for="item in navItems"
                    :key="item.path"
                    :to="item.path"
                    class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors hover:text-ink"
                    :class="isActive(item.path) ? 'text-accent' : 'text-muted'"
                >
                    <component :is="navIcons[item.name]" size="size-4" />
                    <span>{{ item.meta.title }}</span>
                </RouterLink>
            </nav>
        </div>

        <!-- Clickable backdrop: closes the panel when tapped outside. -->
        <div
            class="invisible fixed inset-0 z-30 bg-ink/25 opacity-0 backdrop-blur-sm transition-opacity duration-200 sm:hidden data-[open=true]:visible data-[open=true]:opacity-100"
            :data-open="isOpen"
            aria-hidden="true"
            @click="close"
        />
    </header>
</template>
