<script setup>
import { onActivated, onDeactivated, ref } from "vue";

const rootEl = ref(null);

// Replay the fade-in whenever this kept-alive subtree is (re)activated.
// Removing and re-adding the class with a forced reflow restarts the animation.
function fadeIn() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = rootEl.value;
    if (!el) return;

    el.classList.remove("animate-fade-in");
    void el.offsetWidth;
    el.classList.add("animate-fade-in");
}

onActivated(fadeIn);
onDeactivated(() => window.scrollTo(0, 0));

</script>

<template>
    <div ref="rootEl">
        <slot />
    </div>
</template>
