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
  { label: "GP", extended: "Scelte espresse" },
  { label: "RP", extended: "Scelte ricevute" },
  { label: "MP", extended: "Scelte reciproche" },
  { label: "GR", extended: "Rifiuti espressi" },
  { label: "RR", extended: "Rifiuti ricevuti" },
  { label: "MR", extended: "Rifiuti reciproci" },
  { label: "BNS", extended: "Bonus (scelte ricevute)" },
  { label: "MLS", extended: "Malus (rifiuti ricevuti)" },
  { label: "IM", extended: "Impatto: RP + RR" },
  { label: "BL", extended: "Bilancio: RP - RR" },
  { label: "EI", extended: "Espressività: GP + GR" },
  { label: "OR", extended: "Orientamento: GP - GR" },
  { label: "AI", extended: "Indice di affiliazione: BL + OR" },
  { label: "II", extended: "Indice di influenza: RP + MP" },

  // Individual SNA metrics.
  { label: "CRN", extended: "Numero di coreness (rete delle scelte)" },
  { label: "DG", extended: "Centralità di grado (rete delle scelte)" },
  { label: "CL", extended: "Centralità di vicinanza (rete delle scelte)" },
  { label: "BT", extended: "Centralità di intermediazione (rete delle scelte)" },
  { label: "PK", extended: "Centralità di PageRank (rete delle scelte)" },
  { label: "HA", extended: "HITS autorità (rete delle scelte)" },
  { label: "HU", extended: "HITS hub (rete delle scelte)" },

  // SNA structures.
  { label: "DYA", extended: "Diadi asimmetriche (rete delle scelte)" },
  { label: "DYS", extended: "Diadi simmetriche (rete delle scelte)" },
  { label: "CLQ", extended: "Clique (rete delle scelte)" },
  { label: "WCC", extended: "Componenti debolmente connesse (rete delle scelte)" },
  { label: "SCC", extended: "Componentifortemente connesse (rete delle scelte)" },
  { label: "SCM", extended: "Componentiforte connesse e reciproche (rete delle scelte)" },
  { label: "LVN", extended: "Comunità di Louvain (rete delle scelte)" },
  { label: "LDN", extended: "Comunità di Leiden (rete delle scelte)" },

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
      <dl>
        <div
          v-for="entry in entries"
          :key="entry.label"
          class="flex items-center gap-[2mm] py-[1mm] border-b border-line last:border-b-0"
        >
          <dt
            class="w-[16mm] shrink-0 whitespace-nowrap font-mono text-[9pt] font-semibold tracking-[0.06em] text-ink"
          >
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
