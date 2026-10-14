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

// Compact rows: preferences resolved to their ids (not names), sorted for a
// stable reading order and rendered as individual chips. Likes and dislikes
// stay separate so the `+`/`−` signs map 1:1 onto sociometry's positive/negative
// choice convention.
const rows = computed(() =>
    members.value.map((member) => ({
        id: member.id,
        likes: [...(member.likes ?? [])].sort(),
        dislikes: [...(member.dislikes ?? [])].sort(),
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
            <section class="overflow-hidden rounded-lg border border-line bg-white">
                <header
                    class="flex items-center justify-between gap-4 border-b border-line px-4 py-2"
                >
                    <p class="eyebrow flex items-center gap-x-4">
                        <span class="text-accent">Scelte</span>
                        <span class="text-reject">Rifiuti</span>
                    </p>
                    <span class="font-mono text-xs font-medium text-muted">
                        {{ rows.length }} membri
                    </span>
                </header>

                <ul class="columns-2 gap-x-10 px-4 py-3 text-sm">
                    <li
                        v-for="row in rows"
                        :key="row.id"
                        class="break-inside-avoid py-1"
                    >
                        <div class="flex items-start gap-x-2.5">
                            <span
                                class="inline-flex h-6 min-w-7 shrink-0 items-center justify-center rounded-md border border-line px-1.5 font-mono text-xs font-semibold text-ink"
                            >
                                {{ row.id }}
                            </span>

                            <div class="flex flex-wrap gap-1">
                                <span
                                    v-for="like in row.likes"
                                    :key="`l-${like}`"
                                    class="inline-flex h-6 items-center rounded-md border border-accent px-1.5 font-mono text-xs font-medium text-accent"
                                >
                                    {{ like }}
                                </span>
                                <span
                                    v-for="dislike in row.dislikes"
                                    :key="`d-${dislike}`"
                                    class="inline-flex h-6 items-center rounded-md border border-reject px-1.5 font-mono text-xs font-medium text-reject"
                                >
                                    {{ dislike }}
                                </span>
                                <span
                                    v-if="!row.likes.length && !row.dislikes.length"
                                    class="inline-flex h-6 items-center font-mono text-xs text-muted"
                                >
                                    —
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
        </template>
    </BasePage>
</template>
