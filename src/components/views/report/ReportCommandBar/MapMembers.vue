<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { RouterLink } from "vue-router";

// --- Props --------------
defineProps({ members: { type: Array, required: true } });

// --- Emits --------------
const emit = defineEmits(["select", "back"]);
</script>

<template>
  <button
    type="button"
    class="mb-1 rounded-xl px-2 py-1 text-xs text-white hover:bg-white/10 focus-visible:outline-white"
    @click="emit('back')"
  >
    <span aria-hidden="true">‹</span> Indice del report
  </button>
  <ul aria-label="Membri" class="grid grid-cols-5 gap-1">
    <li v-for="member in members" :key="member.id" class="text-center text-xs text-white">
      <RouterLink
        :to="{ hash: `#member${member.id}` }"
        :title="member.name"
        :aria-label="`Membro ${member.id}: ${member.name}`"
        class="block rounded-lg bg-white/5 py-1.5 hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-white"
        @click="emit('select')"
      >
        {{ member.id }}
      </RouterLink>
    </li>
  </ul>
</template>
