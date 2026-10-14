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
            <h2>Elenco dei membri</h2>
        </template>

        <template #default>
            <section class="overflow-hidden rounded-lg border border-line bg-white">
                <header
                    class="flex items-center justify-between gap-4 border-b border-line px-4 py-2"
                >
                    <p class="eyebrow">Sociogramma</p>
                    <span class="font-mono text-xs font-medium text-muted">
                        {{ members.length }} membri
                    </span>
                </header>

                <ul class="columns-2 gap-x-10 px-4 py-3 text-sm">
                    <li
                        v-for="member in members"
                        :key="member.id"
                        class="break-inside-avoid flex items-center gap-x-2.5 py-1"
                    >
                        <span
                            class="inline-flex h-6 min-w-7 shrink-0 items-center justify-center rounded-md border border-line px-1.5 font-mono text-xs font-semibold text-ink"
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
