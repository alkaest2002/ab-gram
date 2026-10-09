<script setup>
// --- Vue ----------------
import { ref, watch } from "vue";

// --- Routers ------------
import { RouterView, useRoute } from "vue-router";

// --- Stores -------------

// --- Components ---------
import ContentTransition from "@/components/ui/ContentTransition.vue";
import DocsSidebar from "@/components/views/docs/DocsSidebar.vue";
import DocsToc from "@/components/views/docs/DocsToc.vue";
import DocsPager from "@/components/views/docs/DocsPager.vue";

// --- Composables --------
import { useToc } from "@/composables/docs/useToc";
import { usePrevNext } from "@/composables/docs/usePrevNext";
import { useMathjax } from "@/composables/docs/useMathjax";


// --- Props --------------

// --- Emits --------------

// --- State --------------
const route = useRoute();
const articleRef = ref(null);

const { headings } = useToc(articleRef);
const { prev, next } = usePrevNext();
const { typeset } = useMathjax(articleRef);

// Re-run MathJax whenever a different docs page (and its Markdown) renders.
watch(() => route.path, typeset);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!-- Two columns: sidebar on the left, page content on the right. -->
    <div
        class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-14"
    >
        <aside
            class="w-full shrink-0 lg:sticky lg:top-(--header-h) lg:max-h-[calc(100dvh-var(--header-h))] lg:w-64 lg:overflow-y-auto lg:pt-6"
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
                    <ContentTransition>
                        <component :is="Component" />
                    </ContentTransition>
                </RouterView>
            </article>

            <DocsPager :prev="prev" :next="next" />
        </div>
    </div>
</template>
