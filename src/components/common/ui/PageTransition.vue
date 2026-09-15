<script setup>
import { resolvePageTransition } from "@/router/scroll";
</script>

<template>
    <!-- Fade between routes; out-in keeps the pages from overlapping. -->
    <Transition
        appear
        mode="out-in"
        enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 motion-safe:translate-y-1"
        leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
        leave-to-class="opacity-0"
        @after-enter="resolvePageTransition"
    >
        <slot />
    </Transition>
</template>
