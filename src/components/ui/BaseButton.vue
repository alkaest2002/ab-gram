<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    /** If present, the button becomes a route link. */
    to: { type: [String, Object], default: null },
    variant: {
        type: String,
        default: "solid",
        validator: (value) => ["solid", "outline", "red"].includes(value),
    },
});

// Classes written out in full: Tailwind doesn't see ones built by interpolation.
const variantClasses = {
    solid: "btn-solid",
    outline: "btn-outline",
    red: "btn-red",
};

const classes = computed(() => ["btn", variantClasses[props.variant]]);
</script>

<template>
    <component
        :is="to ? RouterLink : 'button'"
        :to="to ?? undefined"
        :class="classes"
    >
        <slot />
    </component>
</template>
