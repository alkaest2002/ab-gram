<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed } from "vue";

//   -- From vue-router
import { RouterLink } from "vue-router";

// --- Props --------------
const props = defineProps({
    to: { type: [String, Object], default: null },
    replace: { type: Boolean, default: false },
    buttonVariant: {
        type: String,
        default: "solid",
        validator: (value) => ["solid", "outline", "red"].includes(value),
    },
});

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------
// Classes written out in full: Tailwind doesn't see ones built by interpolation.
const variantClasses = {
    solid: "btn-solid",
    outline: "btn-outline",
    red: "btn-red",
};

// --- Composables --------

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
        :replace="to ? replace : undefined"
        :class="classes"
    >
        <slot name="icon" />
        <slot />
    </component>
</template>
