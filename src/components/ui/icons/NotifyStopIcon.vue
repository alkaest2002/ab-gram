<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!-- Stop sign: a barred circle (the European "no entry" mark) — the
         universal "stopped" symbol, in the app's muted colour (this is a
         user action, not an error). -->
    <svg
        viewBox="0 0 64 64"
        class="size-14 shrink-0"
        aria-hidden="true"
    >
        <circle
            cx="32"
            cy="32"
            r="23"
            class="fill-none stroke-muted stroke-[1.5]"
        />
        <line
            x1="16"
            y1="16"
            x2="48"
            y2="48"
            class="stroke-muted stroke-[1.5]"
            stroke-linecap="round"
        />
    </svg>
</template>
