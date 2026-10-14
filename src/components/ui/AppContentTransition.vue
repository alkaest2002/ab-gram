<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------
defineProps({
    appear: {
        type: Boolean,
        default: false,
    },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!-- Enter-only fade: the outgoing element is removed immediately (no leave
         animation), so each instance is self-contained and two transitions on
         different parts of the tree can never race each other. -->
    <Transition
        :appear="appear"
        enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 motion-safe:translate-y-1"
    >
        <slot />
    </Transition>
</template>
