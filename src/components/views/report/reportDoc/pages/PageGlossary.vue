<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BasePage from "./BasePage.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
// Static reference glossary: one entry per metric, component and edge label
// shown across the report, each with a short extended definition. `code` is the
// compact label used on the member page (T1..T6 for edges, DYD..SCM for
// components) where one exists. Entries are sorted alphabetically below.
const GLOSSARY = [
    // Moreno individual indices.
    { label: "GP", definition: "Scelte date positive: quante preferenze il membro ha espresso verso gli altri." },
    { label: "RP", definition: "Scelte ricevute positive: quante preferenze il membro ha ricevuto dagli altri." },
    { label: "MP", definition: "Reciprocità positiva: con quante persone il membro ha una scelta ricambiata." },
    { label: "GR", definition: "Scelte date negative: quanti rifiuti il membro ha espresso verso gli altri." },
    { label: "RR", definition: "Scelte ricevute negative: quanti rifiuti il membro ha ricevuto dagli altri." },
    { label: "MR", definition: "Reciprocità negativa: con quante persone il membro ha un rifiuto ricambiato." },
    { label: "IM", definition: "Impatto: il totale delle opinioni ricevute, positive e negative. Misura quanto il membro è visibile." },
    { label: "BL", definition: "Bilancio: la differenza tra preferenze e rifiuti ricevuti. Positivo se il membro è più scelto che rifiutato." },
    { label: "EI", definition: "Espressività: il totale delle opinioni espresse. Misura quanto il membro si espone." },
    { label: "OR", definition: "Orientamento: la differenza tra preferenze e rifiuti espressi. Positivo se il membro sceglie più di quanto rifiuti." },
    { label: "AI", definition: "Affiliazione: la somma di bilancio e orientamento. Unisce l'accoglienza ricevuta e quella offerta." },
    { label: "II", definition: "Influenza: le preferenze ricevute più le preferenze reciproche; le scelte ricambiate pesano il doppio." },

    // SNA individual centralities.
    { label: "DG", definition: "Centralità di grado: quanti legami ha il membro rispetto al massimo possibile. È la misura più intuitiva di popolarità." },
    { label: "CL", definition: "Centralità di vicinanza: quanti pochi passaggi servono in media per raggiungere gli altri membri." },
    { label: "BT", definition: "Centralità di intermediazione: quanto il membro fa da ponte, trovandosi sui percorsi più brevi tra gli altri." },
    { label: "PK", definition: "PageRank: l'importanza dei legami ricevuti, pesata dall'importanza di chi li esprime." },
    { label: "HA", definition: "HITS — autorità: quanto il membro è un riferimento, perché scelto da chi sa scegliere bene." },
    { label: "HU", definition: "HITS — hub: quanto il membro sa indicare i riferimenti giusti, scegliendo persone autorevoli." },

    // SNA group-level metrics.
    { label: "Numero di membri nel gruppo", definition: "Il numero totale di membri (nodi) che compongono la rete." },
    { label: "Totale scelte effettuate", definition: "Il numero di legami diretti presenti nella rete; per la rete dei rifiuti, il totale dei rifiuti espressi." },
    { label: "Totale scelte reciproche effettuate", definition: "Il numero di legami il cui legame inverso esiste anch'esso, cioè le scelte ricambiate." },
    { label: "Densità della rete", definition: "La proporzione dei legami possibili effettivamente presenti: 0 senza legami, 1 in una rete completa." },
    { label: "Centralizzazione della rete", definition: "Quanto la centralità è concentrata attorno al membro più centrale: 0 se distribuita, 1 se concentrata in un solo membro." },
    { label: "Reciprocità della rete", definition: "La proporzione di legami ricambiati: 0 nessuna reciprocità, 1 se tutti i legami sono reciproci." },
    { label: "Transitività della rete", definition: "Il clustering globale: quanto è probabile che due membri legati a una stessa persona siano legati tra loro." },

    // SNA components.
    { label: "Diadi", code: "DYD", definition: "Una coppia di membri che si scelgono a vicenda. È l'unità minima di reciprocità." },
    { label: "Clique", code: "CLQ", definition: "Un sottogruppo in cui ogni membro è collegato direttamente a tutti gli altri, ignorando la direzione." },
    { label: "Componenti debolmente connesse", code: "WCC", definition: "Gruppi raggiungibili tra loro ignorando la direzione delle frecce: basta un percorso in qualunque verso." },
    { label: "Componenti fortemente connesse", code: "SCC", definition: "Gruppi raggiungibili tra loro seguendo la direzione delle frecce in entrambi i sensi." },
    { label: "Componenti fortemente reciproche", code: "SCM", definition: "Gruppi raggiungibili tra loro usando solo i legami reciproci, cioè le scelte ricambiate." },

    // Edge types.
    { label: "Scelte reciproche", code: "T1", definition: "I due membri si scelgono a vicenda, senza alcun rifiuto. È il legame più positivo possibile." },
    { label: "Scelte non reciproche", code: "T2", definition: "Un membro sceglie l'altro, che non risponde né con una scelta né con un rifiuto." },
    { label: "Rifiuti non reciproci", code: "T3", definition: "Un membro rifiuta l'altro, che non esprime né una scelta né un rifiuto." },
    { label: "Rifiuti reciproci", code: "T4", definition: "I due membri si rifiutano a vicenda, senza alcuna scelta." },
    { label: "Scelte contraccambiate da rifiuti", code: "T5", definition: "Un membro sceglie l'altro, che però lo rifiuta: i sentimenti vanno in direzioni opposte." },
    { label: "Rifiuti contraccambiati da scelte", code: "T6", definition: "Un membro rifiuta l'altro, che però lo sceglie." },
    { label: "Scelte e rifiuti insieme", definition: "Un membro prova sentimenti ambivalenti: sceglie e rifiuta la stessa persona." },
];

// Alphabetical order, case- and accent-insensitive (Italian collation).
const entries = [...GLOSSARY].sort((a, b) =>
    a.label.localeCompare(b.label, "it", { sensitivity: "base" }),
);

// Balanced two-column split: the first column takes the extra item on odd
// counts, matching balanced column fill.
const half = Math.ceil(entries.length / 2);
const columns = [entries.slice(0, half), entries.slice(half)];

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
                    <div v-for="entry in column" :key="entry.label" class="pb-[2mm]">
                        <dt class="font-mono text-[8pt] font-semibold tracking-[0.06em] uppercase text-ink">
                            {{ entry.label }}
                            <span v-if="entry.code" class="ml-[1mm] font-medium text-muted">({{ entry.code }})</span>
                        </dt>
                        <dd class="mt-[0.4mm] text-[8pt] leading-[1.35] text-muted">
                            {{ entry.definition }}
                        </dd>
                    </div>
                </dl>
            </div>
        </template>
    </BasePage>
</template>
