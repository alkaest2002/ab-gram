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

// Balanced two-column split. Safari does not honour CSS multi-column layout
// (`columns-2`) when printing and collapses it to a single column, so the two
// halves are laid out with flexbox instead. The first half takes the extra
// item on odd counts, matching balanced column fill.
const columns = computed(() => {
    const half = Math.ceil(members.value.length / 2);
    return [members.value.slice(0, half), members.value.slice(half)];
});

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
                <div class="flex gap-x-10">
                    <ul
                        v-for="(column, i) in columns"
                        :key="i"
                        class="flex-1 text-sm"
                    >
                        <li
                            v-for="member in column"
                            :key="member.id"
                            class="flex items-center gap-x-2.5 py-1"
                        >
                            <span
                                class="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md border border-ink px-1.5 font-mono text-xs font-semibold text-ink"
                            >
                                {{ member.id }}
                            </span>
                            <span class="text-ink">{{ member.name }}</span>
                        </li>
                    </ul>
                </div>
            </section>
        </template>
    </BasePage>
</template>
