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
    membersData: { type: Object, required: true },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------
const members = computed(() => props.membersData?.members ?? []);

// Compact rows: preferences resolved to their ids (not names), sorted for a
// stable reading order and rendered as individual chips. Likes and dislikes
// stay separate so the `+`/`−` signs map 1:1 onto sociometry's positive/negative
// choice convention.
const rows = computed(() =>
    members.value.map((member) => ({
        id: member.id,
        likes: [...(member.likes ?? [])],
        dislikes: [...(member.dislikes ?? [])],
    })),
);

// Balanced two-column split. Safari does not honour CSS multi-column layout
// (`columns-2`) when printing and collapses it to a single column, so the two
// halves are laid out with flexbox instead. The first half takes the extra
// item on odd counts, matching balanced column fill.
const columns = computed(() => {
    const half = Math.ceil(rows.value.length / 2);
    return [rows.value.slice(0, half), rows.value.slice(half)];
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt]">Scelte e rifiuti</h2>
        </template>

        <template #default>
            <section class="overflow-hidden">
                <div class="flex gap-x-10">
                    <ul
                        v-for="(column, i) in columns"
                        :key="i"
                        class="flex-1"
                    >
                        <li
                            v-for="row in column"
                            :key="row.id"
                            class="py-1"
                        >
                            <div class="flex items-start gap-x-2.5">
                                <span
                                    class="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md border border-ink px-1.5 font-mono text-[10pt] font-semibold text-ink"
                                >
                                    {{ row.id }}
                                </span>

                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="like in row.likes"
                                        :key="`l-${like}`"
                                        class="inline-flex h-5 items-center rounded-md border border-accent px-1.5 font-mono text-[10pt] font-medium text-accent"
                                    >
                                        + {{ like }}
                                    </span>
                                    <span
                                        v-for="dislike in row.dislikes"
                                        :key="`d-${dislike}`"
                                        class="inline-flex h-5 items-center rounded-md border border-reject px-1.5 font-mono text-[10pt] font-medium text-reject"
                                    >
                                        - {{ dislike }}
                                    </span>
                                    <span
                                        v-if="!row.likes.length && !row.dislikes.length"
                                        class="inline-flex h-6 items-center font-mono text-[10pt] text-muted"
                                    >
                                        —
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </template>
    </BasePage>
</template>
