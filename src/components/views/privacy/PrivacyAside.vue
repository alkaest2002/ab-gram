<script setup>
// Static table of contents mirroring the articles rendered in Privacy.vue.
// Leaf entries link straight to their heading; the "Servizi di terze parti"
// entry carries a nested list for its sub-articles.
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
        class="rounded-lg border border-line p-4"
    >
        <p class="text-xs font-semibold tracking-wider text-muted uppercase">
            Indice
        </p>
        <ul class="mt-3 space-y-1 text-sm">
            <li v-for="section in sections" :key="section.id">
                <a
                    :href="`#${section.id}`"
                    class="block rounded-md px-3 py-1.5 text-muted transition-colors hover:text-ink"
                    @click="scrollToHeading(section.id, $event)"
                >
                    {{ section.label }}
                </a>
                <ul
                    v-if="section.children"
                    class="mt-0.5 ml-3 space-y-0.5 border-l border-line pl-3"
                >
                    <li
                        v-for="child in section.children"
                        :key="child.id"
                        class="text-xs"
                    >
                        <a
                            :href="`#${child.id}`"
                            class="block rounded-md px-3 py-1.5 text-muted transition-colors hover:text-ink"
                            @click="scrollToHeading(child.id, $event)"
                        >
                            {{ child.label }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>
