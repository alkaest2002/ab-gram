<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------
defineProps({
    headings: {
        type: Array,
        required: true,
    },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
// Same-page anchor: scroll directly instead of routing. `scrollIntoView`
// respects the `scroll-mt-*` offset on headings.
function scrollToHeading(heading, event) {
    event.preventDefault();
    const el = document.getElementById(heading.id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${heading.id}`);
}
</script>

<template>
    <nav
        v-if="headings.length"
        aria-label="In quesat pagina"
        class="mb-10 rounded-lg border border-line p-4"
    >
        <p class="text-xs font-semibold tracking-wider text-muted uppercase">
            In questa pagina
        </p>
        <ul class="mt-3 space-y-1 text-sm">
            <li
                v-for="heading in headings"
                :key="heading.id"
                :class="{ 'pl-4': heading.level === 3 }"
                class="text-sm"
            >
                <a
                    :href="`#${heading.id}`"
                    class="block text-muted transition-colors hover:text-accent"
                    @click="scrollToHeading(heading, $event)"
                >
                    {{ heading.text }}
                </a>
            </li>
        </ul>
    </nav>
</template>
