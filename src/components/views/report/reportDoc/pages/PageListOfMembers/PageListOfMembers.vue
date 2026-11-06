<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From relative.
import BasePage from "../BasePage.vue";

//   -- From composables.
import { useBalancedColumns } from "@/composables/report/useBalancedColumns";

// --- Props --------------
const props = defineProps({
  membersData: { type: Object, required: true },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const members = props.membersData?.members ?? [];

// --- Composables --------
const columns = useBalancedColumns(members);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <BasePage>
    <template #pageTitle>
      <h2 class="text-[16pt]">Elenco dei {{ members.length }} membri</h2>
    </template>

    <template #default>
      <section class="overflow-hidden">
        <div class="flex gap-x-10">
          <ul v-for="(column, i) in columns" :key="i" class="min-w-0 flex-1">
            <li
              v-for="member in column"
              :key="member.id"
              class="flex items-center gap-x-2.5 py-[1pt]"
            >
              <span
                class="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md border border-ink px-1.5 font-mono text-[10pt] font-semibold text-ink"
              >
                {{ member.id }}
              </span>
              <span class="min-w-0 truncate text-ink">{{ member.name }}</span>
            </li>
          </ul>
        </div>
      </section>
    </template>
  </BasePage>
</template>
