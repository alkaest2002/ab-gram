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

  /** The members. */
  members: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:member", "remove:member"]);

const isEditing = computed(() => props.mode === "edit");

// Full class strings (not interpolated) so Tailwind can see every utility.
const inputClass = computed(() =>
  isEditing.value
    ? "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition-colors focus:border-accent outline-none"
    : "w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm text-ink transition-colors outline-none"
);

// Names trimmed once, so every stat below compares the same value.
const trimmedNames = computed(() =>
  props.members.map((member) => String(member.name ?? "").trim())
);

/** Total number of members. */
const membersCount = computed(() => props.members.length);

/**
 * Number of duplicated names: extra occurrences beyond the first for each
 * non-empty name. Empty names are reported separately below.
 */
const duplicatedNamesCount = computed(() => {
  const nonEmptyNames = trimmedNames.value.filter(Boolean);
  return nonEmptyNames.length - new Set(nonEmptyNames).size;
});

/** Number of members with an empty (or blank) name. */
const emptyNamesCount = computed(
  () => trimmedNames.value.filter((name) => name === "").length
);

function updateMember(memberId, key, value) {
  emit("update:member", { memberId, key, value });
}

function removeMember(memberId) {
  emit("remove:member", memberId);
}
</script>

<template>
  <div class="space-y-4">
    <dl
      v-if="members.length > 0"
      class="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      <div class="rounded-lg border border-line px-4 py-3">
        <dt class="eyebrow">Membri</dt>
        <dd class="mt-1 font-mono text-xl font-semibold text-ink">
          {{ membersCount }}
        </dd>
      </div>

      <div class="rounded-lg border border-line px-4 py-3">
        <dt class="eyebrow">Nomi duplicati</dt>
        <dd class="mt-1 font-mono text-xl font-semibold text-ink">
          {{ duplicatedNamesCount }}
        </dd>
      </div>

      <div class="rounded-lg border border-line px-4 py-3">
        <dt class="eyebrow">Nomi vuoti</dt>
        <dd class="mt-1 font-mono text-xl font-semibold text-ink">
          {{ emptyNamesCount }}
        </dd>
      </div>
    </dl>

    <p v-if="members.length === 0" class="text-sm text-muted">
      Nessun membro caricato.
    </p>

    <ol v-else class="list-none space-y-2">
      <li
        v-for="(member, index) in members"
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

        <button
          v-if="isEditing"
          type="button"
          class="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-reject/10 hover:text-reject"
          :aria-label="`Elimina il membro ${member.name?.trim() || member.id}`"
          @click="removeMember(member.id)"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </li>
    </ol>
  </div>
</template>
