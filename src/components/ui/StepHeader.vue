<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<template>
  <header class="space-y-2.5">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p class="max-w-[58ch]"><slot /></p>
  </header>
</template>
