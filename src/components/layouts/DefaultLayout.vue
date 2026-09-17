<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import AppHeader from "@/components/ui/AppHeader.vue";
import AppFooter from "@/components/ui/AppFooter.vue";

// --- Utilities ----------

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!-- min-h-dvh + flex-1 on main: every page covers the viewport and overflows when needed. -->
    <div class="flex min-h-dvh flex-col">

        <!-- Header -->
        <AppHeader />

        <!-- Content -->
        <main class="flex-1">
            <slot />
        </main>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>
