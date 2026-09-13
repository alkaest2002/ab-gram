<script setup>
import { useId } from "vue";
import { RouterLink } from "vue-router";

// Unique gradient id per instance: header and footer both render the logo.
const edgeId = useId();
</script>

<template>
    <!--
      Mark: the smallest possible sociogram. Node A (blue, the accepted one) and
      node B (red, the rejected one) joined by a directed edge that fades blue to
      red — the same brand pair that underlines the hero title.
    -->
    <RouterLink to="/" class="logo" aria-label="AB-Grid, torna alla home">
        <svg
            class="logo-mark"
            viewBox="0 0 56 24"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient
                    :id="edgeId"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                >
                    <stop offset="0" stop-color="var(--color-accent)" />
                    <stop offset="1" stop-color="var(--color-reject)" />
                </linearGradient>
            </defs>

            <!-- Directed edge: the preference from A to B. -->
            <line
                x1="20"
                y1="12"
                x2="31"
                y2="12"
                :stroke="`url(#${edgeId})`"
                stroke-width="2"
                stroke-linecap="round"
            />
            <path
                d="M36 12 L31 9.5 L31 14.5 Z"
                fill="var(--color-reject)"
            />

            <!-- Node A -->
            <circle cx="10" cy="12" r="10" fill="var(--color-accent)" />
            <text x="10" y="12" dy="0.34em" class="logo-initial">A</text>

            <!-- Node B -->
            <circle cx="46" cy="12" r="10" fill="var(--color-reject)" />
            <text x="46" y="12" dy="0.34em" class="logo-initial">B</text>
        </svg>

        <span class="logo-word">Grid</span>
    </RouterLink>
</template>
