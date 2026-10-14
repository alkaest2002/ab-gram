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
            <section class="space-y-4">
                <table class="w-full border-collapse border-y-2 border-ink text-sm">
                    <thead>
                        <tr class="border-b border-ink text-left">
                            <th
                                class="py-2 pr-6 font-mono text-xs font-semibold tracking-[0.14em] uppercase text-muted"
                            >
                                ID
                            </th>
                            <th
                                class="py-2 font-mono text-xs font-semibold tracking-[0.14em] uppercase text-muted"
                            >
                                Nome
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="member in members"
                            :key="member.id"
                            class="odd:bg-gray-100"
                        >
                            <td
                                class="pr-6 font-mono text-sm font-semibold text-ink w-2"
                            >
                                {{ member.id }}
                            </td>
                            <td class="text-ink">{{ member.name }}</td>
                        </tr>
                    </tbody>
                </table>

                <p v-if="members.length === 0" class="text-sm text-muted">
                    Nessun membro nel gruppo.
                </p>
            </section>
        </template>
    </BasePage>
</template>
