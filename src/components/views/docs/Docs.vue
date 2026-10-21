<script setup>
// --- Imports ------------
//   -- From vue
import { onBeforeUnmount, ref, watch } from "vue";

//   -- From vue-router
import { onBeforeRouteUpdate, RouterView, useRoute } from "vue-router";

//   -- From components
import AppContentTransition from "@/components/ui/AppContentTransition.vue";
import DocsSidebar from "@/components/views/docs/DocsSidebar.vue";
import DocsToc from "@/components/views/docs/DocsToc.vue";
import DocsPager from "@/components/views/docs/DocsPager.vue";

//   -- From composables
import { useToc } from "@/composables/docs/useToc";
import { usePrevNext } from "@/composables/docs/usePrevNext";
import { useMathjax } from "@/composables/docs/useMathjax";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------
const route = useRoute();

// --- Stores -------------

// --- State --------------
const articleRef = ref(null);

// --- Composables --------
const { headings } = useToc(articleRef);
const { prev, next } = usePrevNext();
const { typeset, clear } = useMathjax(articleRef);

// --- Computed -----------

// --- Watchers -----------
// Re-run MathJax whenever a different docs page (and its Markdown) renders.
watch(() => route.path, typeset);

// --- Lifecycle ----------
// Forget old math before the article content is swapped, so MathJax doesn't
// retain orphaned expressions (memory growth) and equation numbering resets.
onBeforeRouteUpdate(clear);

// Also release math when leaving the docs section entirely.
onBeforeUnmount(clear);

// --- Methods ------------
</script>

<template>
    <!-- Two columns: sidebar on the left, page content on the right. -->
    <div
        class="flex w-full flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-14"
    >
        <aside
            class="hidden w-full shrink-0 lg:block lg:w-64"
        >
            <DocsSidebar />
        </aside>

        <div class="min-w-0 flex-1">
            <DocsToc :headings="headings" />

            <article
                ref="articleRef"
                class="prose prose-neutral max-w-none prose-headings:scroll-mt-20"
            >
                <h1>{{ route.meta.title }}</h1>
                <RouterView v-slot="{ Component }">
                    <AppContentTransition>
                        <component :is="Component" />
                    </AppContentTransition>
                </RouterView>
            </article>

            <DocsPager :prev="prev" :next="next" />
        </div>
    </div>
</template>
