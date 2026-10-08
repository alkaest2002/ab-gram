<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const steps = [
    {
        title: "Gruppo",
        text: "Inserisci i membri che compongono il gruppo.",
    },
    {
        title: "Scelte e rifiuti",
        text: "Indica le scelte e i rifiuti di tutti i membri del gruppo.",
    },
    {
        title: "Sociogramma",
        text: "AB-Grid calcola, in modo automatico, indici e grafici.",
    },
];

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div>
        <header class="mx-auto max-w-2xl space-y-3">
            <p class="eyebrow">3 soli passaggi</p>
            <h2 class="text-2xl">Dal gruppo al sociogramma</h2>
        </header>

        <ol
            class="mx-auto mt-10 grid list-none grid-cols-1 gap-11 p-0 sm:grid-cols-3"
        >
            <li
                v-for="(step, i) in steps"
                :key="step.title"
                class="relative flex flex-col items-center rounded-lg border border-line bg-white px-5 pt-0 pb-6"
            >
                <!-- Numbered node, like a member of the graph. -->
                <span
                    class="-mt-4 grid size-8 place-items-center rounded-full font-mono text-sm font-semibold text-white ring-4 ring-white"
                    :class="i === steps.length - 1 ? 'bg-accent' : 'bg-ink'"
                    aria-hidden="true"
                >
                    {{ i + 1 }}
                </span>

                <!-- Mini graph: the step as the sociogram would draw it. -->
                <svg
                    class="mt-5 h-12 w-24"
                    viewBox="0 0 96 48"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <!-- 1 · Gruppo: members, not yet connected -->
                    <g v-if="i === 0" class="text-ink">
                        <circle cx="48" cy="10" r="6" />
                        <circle cx="16" cy="40" r="6" />
                        <circle cx="80" cy="40" r="6" />
                    </g>

                    <!-- 2 · Scelte e rifiuti: a choice and a rejection -->
                    <g v-else-if="i === 1">
                        <g class="text-ink">
                            <circle cx="48" cy="10" r="6" />
                            <circle cx="16" cy="40" r="6" />
                            <circle cx="80" cy="40" r="6" />
                        </g>
                        <g class="text-accent">
                            <path d="M20.4 35.9 43.6 14.1" />
                            <path d="M41.3 20.4 43.6 14.1 37.2 16" />
                        </g>
                        <g class="text-reject">
                            <path d="M52.4 14.1 75.6 35.9" />
                            <path d="M69.2 34 75.6 35.9 73.3 29.6" />
                        </g>
                    </g>

                    <!-- 3 · Sociogramma: reciprocal pair, star, isolate -->
                    <g v-else>
                        <g class="text-accent">
                            <path d="M20.4 35.9 43.6 14.1" />
                            <path d="M41.3 20.4 43.6 14.1 37.2 16" />
                            <path d="M22.8 29.6 20.4 35.9 26.9 34" />
                        </g>
                        <circle
                            cx="48"
                            cy="10"
                            r="6"
                            class="text-ink"
                            fill="currentColor"
                        />
                        <circle
                            cx="16"
                            cy="40"
                            r="6"
                            class="text-ink"
                            fill="currentColor"
                        />
                        <circle
                            cx="80"
                            cy="40"
                            r="6"
                            class="text-ink"
                            stroke-dasharray="2.5 3"
                        />
                    </g>
                </svg>

                <h3 class="mt-5 text-base font-semibold text-ink">
                    {{ step.title }}
                </h3>
                <p class="mt-2 max-w-[28ch] text-sm">{{ step.text }}</p>
            </li>
        </ol>
    </div>
</template>
