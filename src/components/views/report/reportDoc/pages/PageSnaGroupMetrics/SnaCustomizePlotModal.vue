<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue.
import { computed } from "vue";

// --- Props --------------
const props = defineProps({
  // Whether the modal is visible.
  open: { type: Boolean, default: false },
  // Whether a regeneration is running: disables the form and swaps the
  // cancel/submit buttons for an interrupt button.
  regenerating: { type: Boolean, default: false },
  error: { type: String, default: "" },
  // ForceAtlas2 settings, bound two-way from the parent container.
  scalingRatio: { type: Number, default: 0.6 },
  gravity: { type: Number, default: 1.1 },
  // Per-node metadata for the emphasis controls.
  nodeInfo: { type: Array, default: () => [] },
  // Accent color used by the plot, drives the node circle previews.
  accentColor: { type: String, default: "" },
  // Current emphasis state, owned by the parent via useNodeEmphasis.
  activeFilter: { type: String, default: "all-on" },
  emphasizedNodes: { type: Set, default: () => new Set() },
  minInDegree: { type: Number, default: 1 },
});

// --- Emits --------------
const emit = defineEmits([
  "update:scalingRatio",
  "update:gravity",
  "update:minInDegree",
  "close",
  "stop",
  "confirm",
  "apply-filter",
  "toggle-node",
]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------
// v-model: read each setting from its prop and write it back by emitting
// `update:*`, so the parent container stays the single source of truth.
const scalingRatio = computed({
  get: () => props.scalingRatio,
  set: (value) => emit("update:scalingRatio", Number(value) || 0),
});
const gravity = computed({
  get: () => props.gravity,
  set: (value) => emit("update:gravity", Number(value) || 0),
});

const minInDegree = computed({
  get: () => props.minInDegree,
  set: (value) => {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    emit("update:minInDegree", n);
  },
});

// Maximum in-degree across all nodes, used as the upper bound for the input.
const maxInDegree = computed(() => props.nodeInfo.reduce((max, n) => Math.max(max, n.inDegree), 0));

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <!-- Teleported to <body> so it escapes the fixed-height, overflow-hidden
         report page that would otherwise clip it. -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 print:hidden"
      @click.self="emit('close')"
    >
      <div
        class="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-canvas p-4 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sna-customize-title"
      >
        <h3 id="sna-customize-title" class="font-display text-[11pt] font-bold text-ink">
          Personalizza il grafico
        </h3>
        <p class="mt-0.5 text-[9pt] leading-snug text-muted">
          Metti in evidenza una parte della rete o rigenera la disposizione dei nodi.
        </p>

        <!-- ── Emphasis section ─────────────────────────────────────── -->
        <fieldset class="mt-3 space-y-2" :disabled="regenerating">
          <legend
            class="block font-mono text-[8pt] font-semibold uppercase tracking-[0.08em] text-muted"
          >
            Evidenzia
          </legend>

          <!-- Toggle presets + min in-degree — all on one row ──────── -->
          <div class="flex flex-wrap items-center gap-1">
            <button
              type="button"
              class="rounded border px-2 py-0.5 text-[9pt] font-medium transition-all"
              :class="
                activeFilter === 'all-on'
                  ? 'border-ink bg-ink text-white'
                  : 'border-line text-muted hover:bg-line hover:text-ink'
              "
              @click="emit('apply-filter', 'all-on')"
            >
              Tutti visibili
            </button>
            <button
              type="button"
              class="rounded border px-2 py-0.5 text-[9pt] font-medium transition-all"
              :class="
                activeFilter === 'all-off'
                  ? 'border-ink bg-ink text-white'
                  : 'border-line text-muted hover:bg-line hover:text-ink'
              "
              @click="emit('apply-filter', 'all-off')"
            >
              Tutti nascosti
            </button>
            <button
              type="button"
              class="rounded border px-2 py-0.5 text-[9pt] font-medium transition-all"
              :class="
                activeFilter === 'min-in-degree'
                  ? 'border-ink bg-ink text-white'
                  : 'border-line text-muted hover:bg-line hover:text-ink'
              "
              @click="emit('apply-filter', 'min-in-degree')"
            >
              Archi entranti ≥
            </button>
            <input
              v-model.number="minInDegree"
              type="number"
              min="0"
              :max="maxInDegree"
              step="1"
              class="w-12 rounded border border-line bg-canvas px-1.5 py-0.5 text-[9pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
              @focus="emit('apply-filter', 'min-in-degree')"
            />
          </div>

          <!-- (c) Clickable node circles ───────────────────────────── -->
          <div class="flex flex-wrap gap-1">
            <button
              v-for="node in nodeInfo"
              :key="node.id"
              type="button"
              class="inline-flex size-5.5 items-center justify-center rounded-full border-2 border-transparent text-[6.5pt] font-semibold leading-none text-white transition-all hover:opacity-80"
              :class="
                emphasizedNodes.has(node.id) ? '' : 'bg-white! text-[#737373]! border-[#d4d4d4]!'
              "
              :style="{ backgroundColor: accentColor }"
              :title="node.id"
              :aria-pressed="emphasizedNodes.has(node.id)"
              @click="emit('toggle-node', node.id)"
            >
              {{ node.id }}
            </button>
          </div>
        </fieldset>

        <!-- ── ForceAtlas2 section ──────────────────────────────────── -->
        <div class="mt-3 border-t border-line pt-3">
          <span
            class="block font-mono text-[8pt] font-semibold uppercase tracking-[0.08em] text-muted"
          >
            Disposizione (ForceAtlas2)
          </span>

          <form class="mt-1.5 flex items-end gap-2" @submit.prevent="emit('confirm')">
            <label class="flex-1">
              <span class="text-[7.5pt] text-muted">Scaling ratio</span>
              <input
                v-model.number="scalingRatio"
                type="number"
                step="0.1"
                min="0"
                :disabled="regenerating"
                class="mt-0.5 w-full rounded border border-line bg-canvas px-1.5 py-0.5 text-[9pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
              />
            </label>
            <label class="flex-1">
              <span class="text-[7.5pt] text-muted">Gravity</span>
              <input
                v-model.number="gravity"
                type="number"
                step="0.1"
                min="0"
                :disabled="regenerating"
                class="mt-0.5 w-full rounded border border-line bg-canvas px-1.5 py-0.5 text-[9pt] text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
              />
            </label>
            <button
              v-if="regenerating"
              type="button"
              class="shrink-0 rounded bg-reject px-2.5 py-1 text-[9pt] font-medium text-white transition-opacity hover:opacity-90"
              @click="emit('stop')"
            >
              Interrompi
            </button>
            <button
              v-else
              type="submit"
              class="shrink-0 rounded bg-ink px-2.5 py-1 text-[9pt] font-medium text-white transition-opacity hover:opacity-90"
            >
              Rigenera
            </button>
          </form>

          <p v-if="error" class="mt-1 text-[8pt] text-reject">{{ error }}</p>
        </div>

        <!-- ── Footer ───────────────────────────────────────────────── -->
        <div v-if="!regenerating" class="mt-3 border-t border-line pt-3">
          <button
            type="button"
            class="w-full rounded py-1.5 text-[9pt] font-medium text-ink transition-colors hover:bg-line"
            @click="emit('close')"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
