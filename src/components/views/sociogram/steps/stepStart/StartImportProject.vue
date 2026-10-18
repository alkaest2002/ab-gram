<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import BaseButton from "@/components/ui/BaseButton.vue";

// --- Composables --------

// --- Data ---------------
import hogwartsDemo from "@/utils/sociogram/hogwarts.json";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-start-import-project",
    "sociogram-start-demo",
]);

// --- State --------------
const sociogramStore = useSociogramStore();

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
/**
 * Load the bundled demo sociogram into the store.
 * Members are cloned so later edits never mutate the imported module data.
 */
function loadDemo() {
    sociogramStore.initMembers(
        hogwartsDemo.map((member) => ({
            id: member.id,
            name: member.name,
            likes: [...(member.likes ?? [])],
            dislikes: [...(member.dislikes ?? [])],
            noLikes: member.noLikes,
            noDislikes: member.noDislikes,
        })),
    );
    emit("sociogram-start-demo");
}
</script>

<template>
    <div class="space-y-1">
        <p class="eyebrow">Progetto archiviato</p>
        <h3>Importa i dati archiviati</h3>
        <p class="text-sm">
            Riprendi un progetto salvato in precedenza, esattamente da
            dove lo avevi lasciato.
        </p>
    </div>
    <div class="flex flex-wrap gap-2">
        <BaseButton
            buttonVariant="outline"
            @click="emit('sociogram-start-import-project')"
        >
            Importa progetto
        </BaseButton>
        <BaseButton buttonVariant="outline" @click="loadDemo">
            Dati demo
        </BaseButton>
    </div>
</template>
