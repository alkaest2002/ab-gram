<script setup>
// --- Imports ------------
//   -- From relative
import BasePage from "../BasePage.vue";

// --- Props --------------
const props = defineProps({
    membersData: { type: Object, required: true },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const members = props.membersData?.members ?? [];

// Balanced two-column split. Safari does not honour CSS multi-column layout
// (`columns-2`) when printing and collapses it to a single column, so the two
// halves are laid out with flexbox instead. The first half takes the extra
// item on odd counts, matching balanced column fill.
const half = Math.ceil(members.length / 2);
const columns = [members.slice(0, half), members.slice(half)];

// --- Composables --------

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
                    <ul
                        v-for="(column, i) in columns"
                        :key="i"
                        class="min-w-0 flex-1"
                    >
                        <li
                            v-for="member in column"
                            :key="member.id"
                            class="flex items-center gap-x-2.5 py-1"
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
