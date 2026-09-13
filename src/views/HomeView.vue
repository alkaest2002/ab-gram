<script setup>
import { RouterLink } from "vue-router";

import SociogramPreview from "@/components/home/SociogramPreview.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

/**
 * The five readings are the vocabulary of the graph above: each entry reuses the
 * same mark that appears in the sociogram, so the legend isn't decoration
 * but the key to reading the drawing.
 *
 * `tone` chooses the mark's color, `double` adds the tip at the start too,
 * `dashed` dashes it: the same three variables as the drawing.
 */
const readings = [
    {
        kind: "choice",
        tone: "accent",
        title: "Preferenze",
        text: "Chi indica chi. La freccia parte da chi sceglie e arriva a chi è stato scelto.",
    },
    {
        kind: "mutual",
        tone: "accent",
        double: true,
        title: "Preferenze reciproche",
        text: "Le coppie che si scelgono a vicenda: il legame più stabile del gruppo.",
    },
    {
        kind: "reject",
        tone: "reject",
        dashed: true,
        title: "Rifiuti",
        text: "Le preferenze negative: dicono con chi una persona preferirebbe non lavorare.",
    },
    {
        kind: "reject-mutual",
        tone: "reject",
        dashed: true,
        double: true,
        title: "Rifiuti reciproci",
        text: "Due persone che si escludono a vicenda: la tensione da sciogliere per prima.",
    },
    {
        kind: "alone",
        tone: "muted",
        title: "Isolamento",
        text: "Chi esprime preferenze senza riceverne. Iris, Luca e Marta, nel grafo qui sopra.",
    },
];
</script>

<template>
    <div class="page home">
        <section class="hero space-y-5">
            <h1 class="hero-title">
                Analizza le <em>dinamiche dei gruppi</em>
            </h1>

            <p class="lede">
                Registra preferenze e rifiuti dei membri di un gruppo: AB-Grid
                costruisce il sociogramma, calcola gli indici sociometrici e
                prepara il report da interpretare.
            </p>
        </section>

        <SociogramPreview />

        <section class="space-y-6">
            <div class="space-y-3">
                <h2>Legenda</h2>
            </div>

            <ul class="readings">
                <li
                    v-for="reading in readings"
                    :key="reading.kind"
                    class="reading"
                >
                    <span
                        class="reading-glyph"
                        :class="`glyph-${reading.tone}`"
                        aria-hidden="true"
                    >
                        <svg viewBox="0 0 32 32">
                            <circle
                                v-if="reading.kind === 'alone'"
                                class="is-dashed"
                                cx="16"
                                cy="16"
                                r="10.5"
                            />
                            <template v-else>
                                <path
                                    :class="{ 'is-dashed': reading.dashed }"
                                    d="M5 16h22"
                                />
                                <path d="M22 11l5 5-5 5" />
                                <path
                                    v-if="reading.double"
                                    d="M10 11l-5 5 5 5"
                                />
                            </template>
                        </svg>
                    </span>

                    <div class="space-y-1.5">
                        <h3>{{ reading.title }}</h3>
                        <p class="text-sm">{{ reading.text }}</p>
                    </div>
                </li>
            </ul>
        </section>

        <section class="band">
            <div class="space-y-2.5">
                <p class="flow">
                    <span>Membri</span>
                    <span class="flow-sep" aria-hidden="true">→</span>
                    <span>Preferenze</span>
                    <span class="flow-sep" aria-hidden="true">→</span>
                    <span>Report</span>
                </p>
                <p class="max-w-[52ch] text-sm">
                    Tre passaggi, nessun account. I dati restano sul tuo
                    dispositivo: il calcolo avviene nel browser. Leggi
                    <RouterLink to="/privacy" class="link"
                        >l'informativa privacy</RouterLink
                    >
                </p>
            </div>

            <BaseButton to="/app">Apri l'app</BaseButton>
        </section>
    </div>
</template>

<style scoped>
/* The hero is plain type on white: the bold headline and its blue-to-red
   underline carry it, with no background pattern behind. */
.hero {
    padding-block: 1.5rem 0.5rem;
}
</style>
