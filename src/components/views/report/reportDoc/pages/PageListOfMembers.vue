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
    <BasePageLayout>
        <section class="space-y-4">
            <div class="space-y-2">
                <h2>Elenco dei membri</h2>
                <p class="max-w-[52ch]">
                    I membri del gruppo con l'identificativo usato nei sociogrammi
                    e nelle tabelle del report.
                </p>
            </div>

            <table class="w-full border-collapse text-sm">
                <thead>
                    <tr class="border-b-2 border-ink text-left">
                        <th class="py-2 pr-6 font-mono text-xs font-semibold tracking-[0.14em] uppercase text-muted">
                            ID
                        </th>
                        <th class="py-2 font-mono text-xs font-semibold tracking-[0.14em] uppercase text-muted">
                            Nome
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="member in members"
                        :key="member.id"
                        class="border-b border-line"
                    >
                        <td class="py-2 pr-6 font-mono text-sm font-semibold text-ink">
                            {{ member.id }}
                        </td>
                        <td class="py-2 text-ink">{{ member.name }}</td>
                    </tr>
                </tbody>
            </table>

            <p v-if="members.length === 0" class="text-sm text-muted">
                Nessun membro nel gruppo.
            </p>
        </section>
    </BasePageLayout>
</template>
