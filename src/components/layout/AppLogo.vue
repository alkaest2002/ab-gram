<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- Text-only logo: "AB" in a clipped gradient, "Grid" in light weight. -->
  <RouterLink to="/" class="logo" aria-label="AB-Grid, torna alla home">
    <span class="logo-mark">AB</span><span class="logo-sep"> </span
    ><span class="logo-word">Grid</span>
  </RouterLink>
</template>
