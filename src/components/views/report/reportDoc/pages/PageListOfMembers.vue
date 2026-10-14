<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BasePage from "./BasePage.vue";

// --- Composables --------

// --- Props --------------
const props = defineProps({
    reportData: { type: Object, required: true },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------
const members = computed(() => props.reportData?.sociogram?.members ?? []);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2>Elenco dei {{ members.length }} membri</h2>
        </template>

        <template #default>
            <section class="overflow-hidden">
                <ul class="columns-2 gap-x-10 text-sm">
                    <li
                        v-for="member in members"
                        :key="member.id"
                        class="break-inside-avoid flex items-center gap-x-2.5 py-1"
                    >
                        <span
                            class="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md border border-ink px-1.5 font-mono text-xs font-semibold text-ink"
                        >
                            {{ member.id }}
                        </span>
                        <span class="text-ink">{{ member.name }}</span>
                    </li>
                </ul>
            </section>
        </template>
    </BasePage>
</template>
