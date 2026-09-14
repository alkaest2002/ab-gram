<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * "edit" shows editable input boxes; "view" renders the same boxes read-only
   * with a muted, borderless appearance.
   */
  mode: {
    type: String,
    default: "edit",
    validator: (value) => ["view", "edit"].includes(value),
  },
});

// v-model: the member-name list owned by the parent view.
const model = defineModel({ type: Array, default: () => [] });

const isEditing = computed(() => props.mode === "edit");

// Full class strings (not interpolated) so Tailwind can see every utility.
const inputClass = computed(() =>
  isEditing.value
    ? "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition-colors focus:border-accent"
    : "w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm text-ink transition-colors"
);

function updateMember(index, value) {
  const next = [...model.value];
  next[index] = value;
  model.value = next;
}
</script>

<template>
  <div class="space-y-2">
    <p v-if="model.length === 0" class="text-sm text-muted">
      Nessun membro caricato.
    </p>

    <ol v-else class="list-none space-y-2">
      <li
        v-for="(name, index) in model"
        :key="index"
        class="flex items-center gap-3"
      >
        <span
          class="w-6 shrink-0 text-right font-mono text-xs text-muted"
          aria-hidden="true"
        >
          {{ index + 1 }}
        </span>

        <input
          :value="name"
          :readonly="!isEditing"
          :class="inputClass"
          :aria-label="`Nome del membro ${index + 1}`"
          @input="updateMember(index, $event.target.value)"
        />
      </li>
    </ol>
  </div>
</template>
