<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const readings = [
    {
        kind: "choice",
        tone: "accent",
        title: "Scelte",
        text: "Chi vuole interagire con chi: la freccia parte da chi sceglie e arriva a chi è stato scelto.",
    },
    {
        kind: "mutual",
        tone: "accent",
        double: true,
        title: "Scelte reciproche",
        text: "Le coppie che si scelgono a vicenda: il legame diadico più stabile del gruppo.",
    },
    {
        kind: "reject",
        tone: "reject",
        dashed: true,
        title: "Rifiuti",
        text: "Le preferenze negative: dicono con chi una persona preferirebbe non interagire.",
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
        text: "Chi non riceve alcuna scelta positiva e rimane ai margini del gruppo.",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
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

                <div>
                    <h3>{{ reading.title }}</h3>
                    <p class="text-sm">{{ reading.text }}</p>
                </div>
            </li>
        </ul>
    </section>
</template>

<style scoped>
/* The list is a ruled column: hairline rules above, below and between rows. */
.readings {
    border-block: 1px solid var(--color-line);
}

.reading + .reading {
    border-top: 1px solid var(--color-line);
}

.reading {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding-block: 1.25rem;
}

.reading-glyph {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    margin-top: 0.125rem;
    border: 1px solid var(--color-line);
    border-radius: 0.5rem;
    background-color: #fafafa;
}

.reading-glyph svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.is-dashed {
    stroke-dasharray: 4.5 4.5;
}

circle.is-dashed {
    stroke-dasharray: 3 4;
}

.glyph-accent {
    color: var(--color-accent);
}

.glyph-reject {
    color: var(--color-reject);
}

.glyph-muted {
    color: var(--color-muted);
}
</style>
