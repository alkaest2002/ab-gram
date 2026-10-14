<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------
import { RouterLink } from "vue-router";

// --- Stores -------------

// --- Components ---------

// --- Composables --------

// --- Props --------------
const props = defineProps({
    to: { type: [String, Object], default: null },
    buttonVariant: {
        type: String,
        default: "solid",
        validator: (value) => ["solid", "outline", "red"].includes(value),
    },
});

// --- Emits --------------

// --- State --------------
// Classes written out in full: Tailwind doesn't see ones built by interpolation.
const variantClasses = {
    solid: "btn-solid",
    outline: "btn-outline",
    red: "btn-red",
};

// --- Computed -----------
const classes = computed(() => ["btn", variantClasses[props.buttonVariant]]);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <component
        :is="to ? RouterLink : 'button'"
        :to="to ?? undefined"
        :class="classes"
    >
        <slot name="icon" />
        <slot />
    </component>
</template>
