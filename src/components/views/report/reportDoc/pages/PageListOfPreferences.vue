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

// Compact rows: each member's likes/dislikes resolved to their ids (not names),
// sorted for a stable reading order and joined with the app's " · " separator.
const rows = computed(() =>
    members.value.map((member) => ({
        id: member.id,
        likes: [...(member.likes ?? [])].sort().join(" · "),
        dislikes: [...(member.dislikes ?? [])].sort().join(" · "),
    })),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2>Preferenze dei membri</h2>
        </template>

        <template #default>
            <section class="space-y-4">
                <table class="w-full border-collapse border-y-2 border-ink text-sm">
                    <thead>
                        <tr class="border-b border-ink text-left">
                            <th
                                class="py-2 pr-6 text-xs font-semibold tracking-[0.14em] uppercase text-muted"
                            >
                                ID
                            </th>
                            <th
                                class="py-2 pr-6 text-xs font-semibold tracking-[0.14em] uppercase text-muted"
                            >
                                Scelte
                            </th>
                            <th
                                class="py-2 text-xs font-semibold tracking-[0.14em] uppercase text-muted"
                            >
                                Rifiuti
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in rows"
                            :key="row.id"
                            class="odd:bg-gray-100"
                        >
                            <td
                                class="pr-6 text-sm font-semibold text-ink w-2"
                            >
                                {{ row.id }}
                            </td>
                            <td class="pr-6 text-sm text-accent">
                                {{ row.likes || "—" }}
                            </td>
                            <td class="text-sm text-reject">
                                {{ row.dislikes || "—" }}
                            </td>
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
