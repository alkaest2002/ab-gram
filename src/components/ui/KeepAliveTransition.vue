<script setup>
// --- Vue ----------------
import { onActivated, onDeactivated, ref } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------

// --- Emits --------------

// --- State --------------
const rootEl = ref(null);

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onActivated(fadeIn);
onDeactivated(() => window.scrollTo(0, 0));

// --- Methods ------------
function fadeIn() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = rootEl.value;
    if (!el) return;

    // Trick to replay the fade-in animation
    el.classList.remove("animate-fade-in");
    void el.offsetWidth;
    el.classList.add("animate-fade-in");
}
</script>

<template>
    <div ref="rootEl">
        <slot />
    </div>
</template>
