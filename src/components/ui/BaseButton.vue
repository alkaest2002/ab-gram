<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    /** If present, the button becomes a route link. */
    to: { type: [String, Object], default: null },
    variant: {
        type: String,
        default: "solid",
        validator: (value) => ["solid", "soft"].includes(value),
    },
});

// Classes written out in full: Tailwind doesn't see ones built by interpolation.
const classes = computed(() => ["btn", props.variant === "soft" && "btn-soft"]);
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
