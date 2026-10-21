<script setup>
// --- Imports ------------
//   -- From vue-router
import { RouterLink } from "vue-router";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!--
      Purely typographic lockup: no mark. "A" and "B" sit in the two brand
      colours as solid fields — the same blue/red pair the app uses for
      preference and rejection — and "Gram" follows in heavy ink. The halves are
      equal width, so the colour split lands exactly at the centre of the block
      regardless of how wide the two letters are.
    -->
    <RouterLink
        to="/"
        class="inline-flex origin-left items-center text-[1.375rem] font-bold leading-none tracking-[-0.035em] transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03]"
        aria-label="AB-Gram, torna alla home"
    >
        <span class="inline-flex overflow-hidden rounded-[0.14em]">
            <span class="w-[1em] bg-accent pt-[0.1em] pb-[0.14em] text-center text-canvas tracking-normal">A</span><span class="w-[1em] bg-reject pt-[0.1em] pb-[0.14em] text-center text-canvas tracking-normal">B</span>
        </span>
        <span class="ml-[0.16em] text-ink">Gram</span>
    </RouterLink>
</template>
