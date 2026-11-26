<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
  <div class="space-y-8 sm:space-y-10">
    <header class="mx-auto max-w-2xl space-y-3">
      <p class="eyebrow">Un esempio</p>
      <h2 class="text-2xl">Il gruppo a colpo d'occhio</h2>
    </header>

    <figure class="graph rounded-lg">
      <div class="graph-stage">
        <svg
          viewBox="0 -4 560 400"
          class="graph-svg"
          role="img"
          aria-label="Sociogramma di un gruppo di dieci persone. Emma riceve tre scelte ed è al
            centro del grafico; Milo e Emma, Elsa e Fabio formano due coppie reciproche. Anna e
            Milo si rifiutano a vicenda, Dario rifiuta Gina, Gina rifiuta Iris ed Elsa rifiuta Luca.
            Iris, Luca e Marta scelgono senza essere scelti: Iris e Luca ricevono un rifiuto, Marta
            non riceve né scelte né rifiuti."
        >
          <defs>
            <marker
              id="tip-choice"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path class="tip tip-choice" d="M0 0 L10 5 L0 10 Z" />
            </marker>
            <marker
              id="tip-mutual"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path class="tip tip-mutual" d="M0 0 L10 5 L0 10 Z" />
            </marker>
            <marker
              id="tip-reject"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto-start-reverse"
            >
              <path class="tip tip-reject" d="M0 0 L10 5 L0 10 Z" />
            </marker>
          </defs>

          <!-- Each endpoint is one outer radius (r + 0.7) toward the curve's control point. -->
          <!-- Preferences -->
          <g class="edge edge-choice" marker-end="url(#tip-choice)">
            <!-- Anna → Emma -->
            <path d="M127.335 134.976 Q186.9 168.1 247.888 179.826" />
            <!-- Dario → Emma -->
            <path d="M429.78 127.041 Q362.9 139.9 308.578 170.108" />
            <!-- Milo → Dario -->
            <path d="M306.363 62.23 Q374.1 73.1 433.075 108.312" />
            <!-- Emma → Gina -->
            <path d="M308.578 201.892 Q362.9 232.1 429.78 244.959" />
            <!-- Gina → Fabio -->
            <path d="M433.075 263.688 Q374.1 298.9 306.363 309.77" />
            <!-- Elsa → Anna -->
            <path d="M99.798 223.633 Q93.8 186 99.798 148.367" />
            <!-- Iris → Gina -->
            <path d="M510 317.3 Q510 281 479.156 263.293" />
            <!-- Luca → Fabio -->
            <path d="M72.593 342.293 Q166 351 254.604 322.243" />
            <!-- Marta → Milo -->
            <path d="M64.581 45.582 Q162 36 253.752 53.106" />
          </g>

          <!-- Mutual pairs -->
          <g class="edge edge-mutual" marker-start="url(#tip-mutual)" marker-end="url(#tip-mutual)">
            <!-- Milo ↔ Emma -->
            <path d="M276.607 84.484 Q271.8 122 275.844 153.565" />
            <!-- Elsa ↔ Fabio -->
            <path d="M130.418 253.871 Q185.9 262 256.631 301.086" />
          </g>

          <!-- Rejections -->
          <g class="edge edge-reject" marker-end="url(#tip-reject)">
            <!-- Dario ⇢ Gina -->
            <path d="M460.202 148.367 Q466.2 186 460.202 223.633" />
            <!-- Gina ⇢ Iris -->
            <path d="M456 276.7 Q456 310 488.751 329.408" />
            <!-- Elsa ⇢ Luca -->
            <path d="M92.446 274.071 Q80 300 63.43 320.713" />
          </g>

          <!-- Mutual rejections -->
          <g class="edge edge-reject" marker-start="url(#tip-reject)" marker-end="url(#tip-reject)">
            <!-- Anna ⇠⇢ Milo -->
            <path d="M130.418 118.129 Q185.9 110 256.631 70.914" />
          </g>

          <g class="nodes">
            <g transform="translate(104 122)">
              <circle class="dot" r="26" />
              <text class="initial" dy="0.34em">A</text>
              <text class="name name-above" y="-26">Anna</text>
            </g>

            <g transform="translate(280 58)">
              <circle class="dot" r="26" />
              <text class="initial" dy="0.34em">B</text>
              <text class="name name-above" y="-26">Milo</text>
            </g>

            <!-- The star of the group: filled, a bit larger. -->
            <g class="is-star" transform="translate(280 186)">
              <circle class="dot" r="32" />
              <text class="initial" dy="0.34em">C</text>
              <text class="name name-below" y="32">Emma</text>
            </g>

            <g transform="translate(456 122)">
              <circle class="dot" r="26" />
              <text class="initial" dy="0.34em">D</text>
              <text class="name name-above" y="-26">Dario</text>
            </g>

            <!-- Name to the side, like Gina's: Fabio's arrow comes in from below. -->
            <g transform="translate(104 250)">
              <circle class="dot" r="26" />
              <text class="initial" dy="0.34em">E</text>
              <text class="name name-before" x="-26" dy="0.34em">Elsa</text>
            </g>

            <g transform="translate(280 314)">
              <circle class="dot" r="26" />
              <text class="initial" dy="0.34em">F</text>
              <text class="name name-below" y="26">Fabio</text>
            </g>

            <!-- Name to the side: arcs pass below and above. -->
            <g transform="translate(456 250)">
              <circle class="dot" r="26" />
              <text class="initial" dy="0.34em">G</text>
              <text class="name name-side" x="26" dy="0.34em">Gina</text>
            </g>

            <!-- The isolated one: dashed outline, outside the group's ring. -->
            <g transform="translate(510 342)">
              <circle class="dot" r="24" />
              <text class="initial" dy="0.34em">I</text>
              <text class="name name-below" y="24">Iris</text>
            </g>

            <!-- Isolated and rejected: Luca chooses Fabio, Elsa rejects him. -->
            <g transform="translate(48 340)">
              <circle class="dot" r="24" />
              <text class="initial" dy="0.34em">L</text>
              <text class="name name-below" y="24">Luca</text>
            </g>

            <!-- Isolated and ignored: Marta chooses Milo, nobody chooses her. -->
            <g class="is-alone" transform="translate(40 48)">
              <circle class="dot" r="24" />
              <text class="initial" dy="0.34em">M</text>
              <text class="name name-above" y="-24">Marta</text>
            </g>
          </g>
        </svg>
      </div>

      <figcaption class="graph-caption">10 persone, 13 scelte e 5 rifiuti.</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.graph {
  border: 1px solid var(--color-line);

  background: #fff;
  overflow: hidden;
}

/* Dot grid: the lattice of the sociometric matrix the graph is born from. */
.graph-stage {
  position: relative;
  isolation: isolate;
  padding: 2rem 1.5rem 1.5rem;
}

.graph-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(
    color-mix(in oklab, var(--color-accent) 22%, transparent) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at 50% 45%, #000 55%, transparent 88%);
}

/* Beyond 560px the drawing doesn't grow: at its natural size one
   viewBox unit equals one pixel, so the names stay at the intended size. */
.graph-svg {
  display: block;
  width: 100%;
  max-width: 600px;
  height: auto;
  margin-inline: auto;
}

.graph-caption {
  border-top: 1px solid var(--color-line);
  padding: 0.8125rem 1.25rem;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

/* --- edges --- */
.edge path {
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: butt;
}

.edge-choice path,
.edge-mutual path {
  stroke: var(--color-accent);
}

.edge-reject path {
  stroke: var(--color-reject);
  stroke-dasharray: 5 5;
}

.tip-choice,
.tip-mutual {
  fill: var(--color-accent);
}

.tip-reject {
  fill: var(--color-reject);
}

/* --- nodes --- */
.dot {
  fill: #fff;
  stroke: var(--color-ink);
  stroke-width: 1.4;
}

.is-star .dot {
  fill: var(--color-accent);
  stroke: var(--color-accent);
}

.is-alone .dot {
  stroke: var(--color-muted);
  stroke-dasharray: 3 4;
}

.initial {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 500;
  text-anchor: middle;
  fill: var(--color-ink);
}

.is-star .initial {
  fill: var(--color-canvas);
}

.is-alone .initial {
  fill: var(--color-muted);
}

/* White halo around the name: keeps it readable even where an arc passes. */
.name {
  --name-gap: 10px;
  font-family: var(--font-sans);
  font-size: 15px;
  text-anchor: middle;
  fill: var(--color-muted);
  stroke: #fff;
  stroke-width: 4.5;
  paint-order: stroke;
}

.name-above {
  transform: translateY(calc(-1 * var(--name-gap)));
}

.name-below {
  /* SVG positions text by its baseline; clear the node with the top of the capitals. */
  transform: translateY(calc(var(--name-gap) + 1cap));
}

.name-side {
  text-anchor: start;
  transform: translateX(var(--name-gap));
}

.name-before {
  text-anchor: end;
  transform: translateX(calc(-1 * var(--name-gap)));
}
</style>
