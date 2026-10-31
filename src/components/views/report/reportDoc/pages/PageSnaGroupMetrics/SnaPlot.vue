<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
    // Injected SVG markup for the network plot.
    svg: { type: String, default: "" },
    // Accent hue shared by the plot, legend swatches and arrow glyphs.
    accentColor: { type: String, default: "" },
    // Preference type, selects the per-type legend text below.
    typeOfSna: { type: String, default: "likes" },
});

// --- Emits --------------
const emit = defineEmits(["open-modal"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Per-type legend text for the directed and mutual edge glyphs.
const LEGEND_CONFIG = {
    likes: {
        directed: "Scelta non reciproca",
        mutual: "Scelta reciproca",
    },
    dislikes: {
        directed: "Rifiuto non reciproco",
        mutual: "Rifiuto reciproco",
    },
};

// --- Composables --------

// --- Computed -----------
const legend = computed(() => LEGEND_CONFIG[props.typeOfSna] ?? LEGEND_CONFIG.likes);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="sna-plot border-b border-line pb-1">
        <div class="plot-svg relative">
            <div class="h-full w-full" v-html="svg"></div>
            <button
                type="button"
                class="absolute bottom-2 right-2 z-10 print:hidden flex h-5 w-5 items-center justify-center rounded-full border border-line bg-canvas/90 text-sm leading-none text-muted shadow-sm transition-colors hover:text-ink"
                aria-label="Rigenera il grafico"
                title="Rigenera il grafico"
                @click="emit('open-modal')"
            >
                +
            </button>
        </div>
        <div class="plot-legend">
            <div class="flex flex-wrap gap-x-[5mm] gap-y-[1mm]">
                <span class="inline-flex items-center gap-[1.5mm]">
                    <span
                        class="inline-block h-[2.5mm] w-[2.5mm] rounded-full"
                        :style="{ backgroundColor: accentColor }"
                    ></span>
                    <span class="font-mono text-[7.5pt] text-muted">Membro</span>
                </span>
                <span class="inline-flex items-center gap-[1.5mm]">
                    <svg class="h-auto w-[4.5mm]" viewBox="0 0 22 12" aria-hidden="true">
                        <line x1="1" y1="6" x2="15" y2="6" :stroke="accentColor" stroke-width="1" />
                        <polyline points="11,1.5 16,6 11,10.5" fill="none" :stroke="accentColor" stroke-width="1" />
                    </svg>
                    <span class="font-mono text-[7.5pt] text-muted">{{ legend.directed }}</span>
                </span>
                <span class="inline-flex items-center gap-[1.5mm]">
                    <span
                        class="inline-block h-[1mm] w-[4.5mm] rounded-full"
                        :style="{ backgroundColor: accentColor }"
                    ></span>
                    <span class="font-mono text-[7.5pt] text-muted">{{ legend.mutual }}</span>
                </span>
                <span class="inline-flex items-center gap-[1.5mm]">
                    <span class="inline-block h-[2.5mm] w-[2.5mm] rounded-full bg-black"></span>
                    <span class="font-mono text-[7.5pt] text-muted">Membro isolato</span>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Plot band: 60% of the content cell. */
.sna-plot {
    flex: 0 0 60%;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

/* The SVG fills the plot band minus the thin legend strip. */
.plot-svg {
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
}
.plot-legend {
    flex: 0 0 6mm;
    display: flex;
    align-items: center;
}

/* The SVG is injected via v-html, so it has no scoped attribute; :deep reaches
   it from the .plot-svg wrapper. It fills the wrapper and the default
   `preserveAspectRatio="xMidYMid meet"` keeps the graph's aspect ratio. */
.plot-svg :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
