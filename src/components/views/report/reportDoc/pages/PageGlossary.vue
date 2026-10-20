<script setup>
// --- Imports ------------
//   -- From relative
import BasePage from "./BasePage.vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Static glossary of the compact labels shown across the report, each mapped to
// its expanded name. Only entries that have a distinct short code are listed;
// labels that are already spelled out in the report are omitted. Entries are
// sorted alphabetically by code below.
const GLOSSARY = [
    // Moreno individual indices.
    { label: "GP", extended: "Scelte date" },
    { label: "RP", extended: "Scelte ricevute" },
    { label: "MP", extended: "Scelte reciproche" },
    { label: "GR", extended: "Rifiuti dati" },
    { label: "RR", extended: "Rifiuti ricevuti" },
    { label: "MR", extended: "Rifiuti reciproci" },
    { label: "IM", extended: "Impatto" },
    { label: "BL", extended: "Bilancio" },
    { label: "EI", extended: "Espressività" },
    { label: "OR", extended: "Orientamento" },
    { label: "AI", extended: "Indice di affiliazione" },
    { label: "II", extended: "Indice di influenza" },

    // SNA individual centralities.
    { label: "DG", extended: "Centralità di grado" },
    { label: "CL", extended: "Centralità di vicinanza" },
    { label: "BT", extended: "Centralità di intermediazione" },
    { label: "PK", extended: "Centralità di PageRank" },
    { label: "HA", extended: "HITS autorità" },
    { label: "HU", extended: "HITS hub" },

    // SNA components.
    { label: "DYD", extended: "Diadi" },
    { label: "CLQ", extended: "Clique" },
    { label: "WCC", extended: "Componenti debolmente connesse" },
    { label: "SCC", extended: "Componenti fortemente connesse" },
    { label: "SCM", extended: "Componenti fortemente connesse e reciproche" },

    // Edge types.
    { label: "T1", extended: "Scelte reciproche" },
    { label: "T2", extended: "Scelte non reciproche" },
    { label: "T3", extended: "Rifiuti non reciproci" },
    { label: "T4", extended: "Rifiuti reciproci" },
    { label: "T5", extended: "Scelte contraccambiate da rifiuti" },
    { label: "T6", extended: "Rifiuti contraccambiati da scelte" },
];

// Alphabetical order, case-insensitive.
const entries = [...GLOSSARY].sort((a, b) =>
    a.label.localeCompare(b.label, "it", { sensitivity: "base" }),
);

// Balanced two-column split: the first column takes the extra item on odd
// counts, matching balanced column fill.
const half = Math.ceil(entries.length / 2);
const columns = [entries.slice(0, half), entries.slice(half)];

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <BasePage>
        <template #pageTitle>
            <h2 class="text-[16pt]">Glossario</h2>
        </template>

        <template #default>
            <!--
              Two flex columns separated by a vertical line. CSS grid and
              multi-column layout are avoided because Safari collapses them to a
              single column when printing.
            -->
            <div class="flex h-full">
                <dl
                    v-for="(column, index) in columns"
                    :key="index"
                    class="min-w-0 flex-1"
                    :class="index === 1 ? 'border-l border-line pl-[4mm]' : 'pr-[4mm]'"
                >
                    <div
                        v-for="entry in column"
                        :key="entry.label"
                        class="flex items-baseline gap-[2mm] pb-[1.5mm]"
                    >
                        <dt class="w-[9mm] shrink-0 font-mono text-[8.5pt] font-semibold tracking-[0.06em] text-ink">
                            {{ entry.label }}
                        </dt>
                        <dd class="min-w-0 text-[8.5pt] leading-[1.35] text-muted">
                            {{ entry.extended }}
                        </dd>
                    </div>
                </dl>
            </div>
        </template>
    </BasePage>
</template>
