<script setup>
import { preferredScrollBehavior } from "@/router/scroll";

defineProps({
    headings: {
        type: Array,
        required: true,
    },
});

// Same-page anchor: scroll directly instead of routing, so it is immediate and
// doesn't wait for a page transition. `scrollIntoView` respects `scroll-mt-*`.
function scrollToHeading(heading, event) {
    event.preventDefault();
    const el = document.getElementById(heading.id);
    if (!el) return;
    el.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
    history.replaceState(null, "", `#${heading.id}`);
}
</script>

<template>
    <nav
        v-if="headings.length"
        aria-label="On this page"
        class="mb-10 rounded-lg border border-line p-4"
    >
        <p class="text-xs font-semibold tracking-wider text-muted uppercase">
            On this page
        </p>
        <ul class="mt-3 space-y-1 text-sm">
            <li
                v-for="heading in headings"
                :key="heading.id"
                :class="{ 'pl-4': heading.level === 3 }"
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
