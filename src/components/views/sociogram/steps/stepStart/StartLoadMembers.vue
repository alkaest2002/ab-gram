<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["sociogram-start-load-members"]);

// --- State --------------

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
            Crea un nuovo sociogramma a partire da una lista di nomi.
        </p>
    </div>
    <BaseButton
        buttonVariant="solid"
        @click="emit('sociogram-start-load-members')"
    >
        Crea progetto
    </BaseButton>
</template>
