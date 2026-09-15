<script setup>
import AppFooter from "@/components/common/layout/AppFooter.vue";
import AppHeader from "@/components/common/layout/AppHeader.vue";
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
