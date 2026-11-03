<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From relative.
import BasePage from "../BasePage.vue";

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
    { label: "BNS", extended: "Bonus (scelte ricevute)" },
    { label: "MLS", extended: "Malus (rifiuti ricevuti)" },
    { label: "IM", extended: "Impatto" },
    { label: "BL", extended: "Bilancio" },
    { label: "EI", extended: "Espressività" },
    { label: "OR", extended: "Orientamento" },
    { label: "AI", extended: "Indice di affiliazione" },
    { label: "II", extended: "Indice di influenza" },

    // SNA individual centralities.
    { label: "DG", extended: "Centralità di grado (inDegree)" },
    { label: "CL", extended: "Centralità di vicinanza" },
    { label: "BT", extended: "Centralità di intermediazione" },
    { label: "PK", extended: "Centralità di PageRank" },
    { label: "HA", extended: "HITS autorità" },
    { label: "HU", extended: "HITS hub" },

    // SNA components. In the member pages these labels are prefixed by "L-" for
    // likes (scelte).
    { label: "L-DYD", extended: "Diadi (scelte)" },
    { label: "L-CLQ", extended: "Clique (scelte)" },
    { label: "L-WCC", extended: "Componenti debolmente connesse (scelte)" },
    { label: "L-SCC", extended: "Componenti fortemente connesse (scelte)" },
    { label: "L-SCM", extended: "Componenti fortemente connesse e reciproche (scelte)" },
    { label: "L-LVN", extended: "Comunità di Louvain (scelte)" },

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
            <dl class="min-w-0">
                <div
                    v-for="entry in entries"
                    :key="entry.label"
                    class="flex items-center gap-[2mm] py-[1mm] border-b border-line"
                >
                    <dt class="w-[12mm] shrink-0 font-mono text-[9pt] font-semibold tracking-[0.06em] text-ink">
                        {{ entry.label }}
                    </dt>
                    <dd class="min-w-0 text-[9pt] leading-[1.35] text-muted">
                        {{ entry.extended }}
                    </dd>
                </div>
            </dl>
        </template>
    </BasePage>
</template>
