<script setup>
import { RouterLink } from "vue-router";

defineProps({
    prev: {
        type: Object,
        default: null,
    },
    next: {
        type: Object,
        default: null,
    },
});
</script>

<template>
    <nav
        v-if="prev || next"
        class="mt-14 flex items-center justify-between gap-6 border-t border-line pt-6"
    >
        <div class="min-w-0">
            <RouterLink v-if="prev" :to="prev.path" class="group block text-left">
                <span class="block text-xs font-medium tracking-wider text-muted uppercase">
                    Previous
                </span>
                <span
                    class="mt-1 block truncate font-medium text-ink transition-colors group-hover:text-accent"
                >
                    {{ prev.title }}
                </span>
            </RouterLink>
        </div>

        <div class="min-w-0 text-right">
            <RouterLink v-if="next" :to="next.path" class="group block text-right">
                <span class="block text-xs font-medium tracking-wider text-muted uppercase">
                    Next
                </span>
                <span
                    class="mt-1 block truncate font-medium text-ink transition-colors group-hover:text-accent"
                >
                    {{ next.title }}
                </span>
            </RouterLink>
        </div>
    </nav>
</template>
