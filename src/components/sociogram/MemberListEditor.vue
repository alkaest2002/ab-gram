<script setup>
import { computed, onMounted } from "vue";

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

  /** The members. */
  members: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:member"]);

const isEditing = computed(() => props.mode === "edit");

// Full class strings (not interpolated) so Tailwind can see every utility.
const inputClass = computed(() =>
  isEditing.value
    ? "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition-colors focus:border-accent outline-none"
    : "w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm text-ink transition-colors outline-none"
);

function updateMember(memberId, key, value) {
  emit("update:member", { memberId, key, value });
}
</script>

<template>
  <div class="space-y-2">
    <p v-if="members.length === 0" class="text-sm text-muted">
      Nessun membro caricato.
    </p>

    <ol v-else class="list-none space-y-2">
      <li
        v-for="member in members"
        :key="member.id"
        class="flex items-center gap-3"
      >
        <span
          class="w-6 shrink-0 text-right font-mono text-xs text-muted"
          aria-hidden="true"
        >
          {{ member.id }}
        </span>

        <input
          :value="member.name"
          :readonly="!isEditing"
          :class="inputClass"
          :aria-label="`Nome del membro ${index + 1}`"
          @input="updateMember(member.id, 'name', $event.target.value)"
        />
      </li>
    </ol>
  </div>
</template>
