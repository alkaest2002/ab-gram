<script setup>
// --- Imports ------------
//   -- From components
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-start-load-members"]);

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="space-y-1">
        <p class="eyebrow">Nuovo progetto</p>
        <h3>Carica una nuova lista di nomi</h3>
        <p class="text-sm">
            Crea un nuovo progettoa partire da una lista di nomi.
        </p>
    </div>
    <BaseButton
        buttonVariant="solid"
        @click="emit('sociogram-start-load-members')"
    >
        Crea progetto
    </BaseButton>
</template>
