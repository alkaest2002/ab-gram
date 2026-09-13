<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
    <!--
      Purely typographic lockup: no mark. "A" and "B" sit in the two brand
      colours as solid fields — the same blue/red pair the app uses for
      preference and rejection — and "Grid" follows in heavy ink. The halves are
      equal width, so the colour split lands exactly at the centre of the block
      regardless of how wide the two letters are.
    -->
    <RouterLink to="/" class="logo" aria-label="AB-Grid, torna alla home">
        <span class="logo-ab">
            <span class="logo-a">A</span><span class="logo-b">B</span>
        </span>
        <span class="logo-word">Grid</span>
    </RouterLink>
</template>
