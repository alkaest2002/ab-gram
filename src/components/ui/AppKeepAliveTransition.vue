<script setup>
// --- Imports ------------
//   -- From vue
import { onActivated, onDeactivated, ref } from "vue";

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
const rootEl = ref(null);

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onActivated(fadeIn);
onDeactivated(() => window.scrollTo(0, 0));

// --- Methods ------------
function fadeIn() {
    // Return early if motion is reduced
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Get element or return if not available
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
