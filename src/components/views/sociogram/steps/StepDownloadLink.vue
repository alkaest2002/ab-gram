<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------

// --- Utilities ----------

// --- Props --------------
defineProps({
    /** Eyebrow title shown above the explanation. */
    title: { type: String, required: true },
    /** Download URL (e.g. a data: URI). */
    href: { type: String, required: true },
    /** Filename suggested to the browser on download. */
    filename: { type: String, required: true },
    /** Text shown inside the badge link. */
    label: { type: String, required: true },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div>
        <div>
            <p class="eyebrow">{{ title }}</p>
            <p class="mt-1 text-xs text-muted">
                <slot />
            </p>
        </div>

        <a
            :href="href"
            :download="filename"
            class="badge mt-3 mb-3 px-3"
        >
            {{ label }}
        </a>
    </div>
</template>
