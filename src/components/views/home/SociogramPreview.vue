<template>
    <figure class="graph">
        <div class="graph-stage">
            <svg
                viewBox="0 -4 560 400"
                class="graph-svg"
                role="img"
                aria-label="Sociogramma di un gruppo di dieci persone. Emma riceve tre preferenze ed è al
          centro del grafo; Bruno e Emma, Elsa e Milo formano due coppie reciproche. Anna e
          Bruno si rifiutano a vicenda, Dario rifiuta Gina, Gina rifiuta Iris ed Elsa rifiuta Luca.
          Iris, Luca e Marta scelgono senza essere scelti: Iris e Luca ricevono un rifiuto, Marta
          non riceve né preferenze né rifiuti."
            >
                <defs>
                    <marker
                        id="tip-choice"
                        viewBox="0 0 10 10"
                        refX="9"
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
                        refX="9"
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
                        refX="9"
                        refY="5"
                        markerWidth="5.5"
                        markerHeight="5.5"
                        orient="auto-start-reverse"
                    >
                        <path class="tip tip-reject" d="M0 0 L10 5 L0 10 Z" />
                    </marker>
                </defs>

                <!-- Preferences -->
                <g class="edge edge-choice" marker-end="url(#tip-choice)">
                    <!-- Anna → Emma -->
                    <path d="M131.1 137.1 Q186.9 168.1 236.8 177.7" />
                    <!-- Dario → Emma -->
                    <path d="M425.6 127.9 Q362.9 139.9 318.5 164.6" />
                    <!-- Bruno → Dario -->
                    <path d="M310.6 62.9 Q374.1 73.1 423.4 102.5" />
                    <!-- Emma → Gina -->
                    <path d="M312.3 204 Q362.9 232.1 418.7 242.8" />
                    <!-- Gina → Milo -->
                    <path d="M429.4 265.9 Q374.1 298.9 317.5 308" />
                    <!-- Elsa → Anna -->
                    <path d="M99.1 219.4 Q93.8 186 98 159.5" />
                    <!-- Iris → Gina -->
                    <path d="M499.5 315 Q490.4 291.7 480.2 279.3" />
                    <!-- Luca → Milo -->
                    <path d="M72 337 Q163 320 254 317" />
                    <!-- Marta → Bruno -->
                    <path d="M64 49 Q159 46 254 57" />
                </g>

                <!-- Mutual pairs -->
                <g
                    class="edge edge-mutual"
                    marker-start="url(#tip-mutual)"
                    marker-end="url(#tip-mutual)"
                >
                    <!-- Bruno ↔ Emma -->
                    <path d="M275.2 95.7 Q271.8 122 274.4 142.4" />
                    <!-- Elsa ↔ Milo -->
                    <path d="M136.6 269.5 Q185.9 298.9 242.5 308" />
                </g>

                <!-- Rejections -->
                <g class="edge edge-reject" marker-end="url(#tip-reject)">
                    <!-- Dario ⇢ Gina -->
                    <path d="M460.9 152.6 Q466.2 186 462 212.5" />
                    <!-- Gina ⇢ Iris -->
                    <path d="M467.3 278.9 Q475.6 300.3 487.1 314.2" />
                    <!-- Elsa ⇢ Luca -->
                    <path d="M90 272 Q80 300 61 320" />
                </g>

                <!-- Mutual rejections -->
                <g
                    class="edge edge-reject"
                    marker-start="url(#tip-reject)"
                    marker-end="url(#tip-reject)"
                >
                    <!-- Anna ⇠⇢ Bruno -->
                    <path d="M136.6 102.5 Q185.9 73.1 242.5 64" />
                </g>

                <g class="nodes">
                    <g transform="translate(104 122)">
                        <circle class="dot" r="26" />
                        <text class="initial" dy="0.34em">A</text>
                        <text class="name" y="-39">Anna</text>
                    </g>

                    <g transform="translate(280 58)">
                        <circle class="dot" r="26" />
                        <text class="initial" dy="0.34em">B</text>
                        <text class="name" y="-39">Bruno</text>
                    </g>

                    <!-- The star of the group: filled, a bit larger. -->
                    <g class="is-star" transform="translate(280 186)">
                        <circle class="dot" r="32" />
                        <text class="initial" dy="0.34em">C</text>
                        <text class="name" y="50">Emma</text>
                    </g>

                    <g transform="translate(456 122)">
                        <circle class="dot" r="26" />
                        <text class="initial" dy="0.34em">D</text>
                        <text class="name" y="-39">Dario</text>
                    </g>

                    <!-- Name to the side, like Gina's: Milo's arrow comes in from below. -->
                    <g transform="translate(104 250)">
                        <circle class="dot" r="26" />
                        <text class="initial" dy="0.34em">E</text>
                        <text class="name name-before" x="-36" dy="0.34em">
                            Elsa
                        </text>
                    </g>

                    <g transform="translate(280 314)">
                        <circle class="dot" r="26" />
                        <text class="initial" dy="0.34em">F</text>
                        <text class="name" y="41">Milo</text>
                    </g>

                    <!-- Name to the side: arcs pass below and above. -->
                    <g transform="translate(456 250)">
                        <circle class="dot" r="26" />
                        <text class="initial" dy="0.34em">G</text>
                        <text class="name name-side" x="36" dy="0.34em">
                            Gina
                        </text>
                    </g>

                    <!-- The isolated one: dashed outline, outside the group's ring. -->
                    <g class="is-alone" transform="translate(510 342)">
                        <circle class="dot" r="24" />
                        <text class="initial" dy="0.34em">I</text>
                        <text class="name" y="39">Iris</text>
                    </g>

                    <!-- Isolated and rejected: Luca chooses Milo, Elsa rejects him. -->
                    <g class="is-alone" transform="translate(48 340)">
                        <circle class="dot" r="24" />
                        <text class="initial" dy="0.34em">L</text>
                        <text class="name" y="39">Luca</text>
                    </g>

                    <!-- Isolated and ignored: Marta chooses Bruno, nobody chooses her. -->
                    <g class="is-alone" transform="translate(40 48)">
                        <circle class="dot" r="24" />
                        <text class="initial" dy="0.34em">M</text>
                        <text class="name" y="-39">Marta</text>
                    </g>
                </g>
            </svg>
        </div>

        <figcaption class="graph-caption">
            10 persone, 13 scelte e 5 rifiuti.
        </figcaption>
    </figure>
</template>

<style scoped>
.graph {
    border: 1px solid var(--color-line);
    border-radius: 1.25rem;
    background: #fff;
    overflow: hidden;
}

/* Dot grid: the lattice of the sociometric matrix the graph is born from. */
.graph-stage {
    position: relative;
    isolation: isolate;
    padding: 1rem 1.25rem 0.5rem;
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
    max-width: 560px;
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
    stroke-linecap: round;
}

.edge-choice path {
    stroke: color-mix(in oklab, var(--color-accent) 65%, transparent);
}

.edge-mutual path {
    stroke: color-mix(in oklab, var(--color-accent) 65%, transparent);
}

.edge-reject path {
    stroke: var(--color-reject);
    stroke-dasharray: 5 5;
}

.tip-choice {
    fill: color-mix(in oklab, var(--color-accent) 65%, transparent);
}

.tip-mutual {
    fill: color-mix(in oklab, var(--color-accent) 65%, transparent);
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
    font-family: var(--font-sans);
    font-size: 15px;
    text-anchor: middle;
    fill: var(--color-muted);
    stroke: #fff;
    stroke-width: 4.5;
    paint-order: stroke;
}

.name-side {
    text-anchor: start;
}

.name-before {
    text-anchor: end;
}
</style>
