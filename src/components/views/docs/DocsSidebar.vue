<script setup>
import { RouterLink, useRoute } from "vue-router";

import { navigation } from "@/docs/navigation";

const route = useRoute();

// The section holding the current page starts expanded; navigating opens the
// new section and closes the old one.
function isCurrentSection(section) {
    return section.items.some((item) => item.path === route.path);
}
</script>

<template>
    <nav aria-label="Documentation" class="space-y-1 text-sm text-muted">
        <details
            v-for="section in navigation"
            :key="section.folder"
            class="group"
            :open="isCurrentSection(section)"
        >
            <summary
                class="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 font-semibold text-ink transition-colors hover:bg-ink/5 [&::-webkit-details-marker]:hidden"
            >
                <span>{{ section.title }}</span>
                <svg
                    class="size-4 shrink-0 transition-transform group-open:rotate-90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="m9 6 6 6-6 6" />
                </svg>
            </summary>

            <ul class="mt-1 ml-3 space-y-0.5 border-l border-line pl-3">
                <li v-for="item in section.items" :key="item.path">
                    <RouterLink
                        :to="item.path"
                        class="block rounded-md px-3 py-1.5 transition-colors hover:text-ink"
                        active-class="font-medium text-accent"
                    >
                        {{ item.title }}
                    </RouterLink>
                </li>
            </ul>
        </details>
    </nav>
</template>
