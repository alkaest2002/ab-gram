<script setup>
// Static table of contents mirroring the articles rendered in Privacy.vue.
// Leaf articles link straight to their heading; "Servizi di terze parti"
// is a collapsible branch with a nested list for its sub-articles.
const sections = [
    { id: "titolare", label: "1. Titolare del trattamento" },
    { id: "dati-trattati", label: "2. Dati trattati e finalità" },
    { id: "base-giuridica", label: "3. Base giuridica" },
    {
        id: "servizi-terze-parti",
        label: "4. Servizi di terze parti",
        children: [
            { id: "google-fonts", label: "4.1 Google Fonts" },
            { id: "github-pages", label: "4.2 GitHub Pages (hosting)" },
        ],
    },
    { id: "cookie", label: "5. Cookie" },
    { id: "conservazione", label: "6. Conservazione dei dati" },
    { id: "diritti-interessato", label: "7. Diritti dell'interessato" },
    { id: "diritto-di-reclamo", label: "8. Diritto di reclamo" },
    { id: "modifiche", label: "9. Modifiche alla presente informativa" },
];

// Same-page anchor: scroll directly instead of routing. `scrollIntoView`
// respects the `scroll-mt-*` offset on headings.
function scrollToHeading(id, event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
}
</script>

<template>
    <nav
        aria-label="Indice dell'informativa"
        class="space-y-1 text-sm text-muted select-none"
    >
        <template v-for="section in sections" :key="section.id">
            <!-- Leaf article: a plain link styled like a section title. -->
            <a
                v-if="!section.children"
                :href="`#${section.id}`"
                class="block rounded-md px-3 py-2 font-semibold text-ink transition-colors hover:bg-ink/5"
                @click="scrollToHeading(section.id, $event)"
            >
                {{ section.label }}
            </a>

            <!-- Branch article: collapsible, with a chevron and nested links. -->
            <details v-else class="group" open>
                <summary
                    class="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 font-semibold text-ink transition-colors hover:bg-ink/5 [&::-webkit-details-marker]:hidden"
                >
                    <span>{{ section.label }}</span>
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
                    <li v-for="child in section.children" :key="child.id" class="text-xs">
                        <a
                            :href="`#${child.id}`"
                            class="block rounded-md px-3 py-1.5 transition-colors hover:text-ink"
                            @click="scrollToHeading(child.id, $event)"
                        >
                            {{ child.label }}
                        </a>
                    </li>
                </ul>
            </details>
        </template>
    </nav>
</template>
