<script setup>
// --- Vue ----------------
import { computed, nextTick, ref, watch } from "vue";

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import LoadMembersListEditorStats from "./LoadMembersListEditorStats.vue";

// --- Composables --------
import { getMembersNameIssues } from "@/utils/sociogram/memberHelpers";
import { MEMBERS_INDICES } from "@/utils/sociogram/sociogramValidationFunctions";

// --- Props --------------
const props = defineProps({
  /** The members. */
  members: {
    type: Array,
    default: () => [],
  },
});

// --- Emits --------------
const emit = defineEmits([
  "sociogram-update-member",
  "sociogram-add-member",
  "sociogram-remove-member",
]);

// --- State --------------
// Inline editing state. The list is a preview: clicking a name makes it
// editable. Enter commits the change, Esc (or clicking away) cancels it by restoring the previous name.
const editingId = ref(null);
const originalName = ref(null);

// --- Computed -----------
/** Total number of members. */
const membersCount = computed(() => props.members.length);

/** Empty and duplicated names, derived from the shared member helpers. */
const nameIssues = computed(() => getMembersNameIssues(props.members));
const duplicatedNamesCount = computed(() => nameIssues.value.duplicateNamesCount);
const emptyNamesCount = computed(() => nameIssues.value.emptyNamesCount);

/** First id from the shared sequence not yet used by any member, or null once every index is used. */
const nextMemberId = computed(() => {
  const usedIds = new Set(props.members.map((member) => member.id));
  return MEMBERS_INDICES.find((id) => !usedIds.has(id)) ?? null;
});

/** Whether another member can still be added from the index sequence. */
const hasAvailableIndices = computed(() => nextMemberId.value !== null);

/** Adding requires a free index and no blank name to review first. */
const canAddMember = computed(
  () => hasAvailableIndices.value && emptyNamesCount.value === 0,
);

// --- Watchers -----------
// Focus the newly added member's input when it renders.
watch(
  () => props.members.length,
  async (newLength, oldLength) => {
    if (newLength > oldLength) {
      await nextTick();
      const addedMember = props.members[props.members.length - 1];
      const input = document.querySelector(`[data-member-id="${addedMember.id}"]`);
      input?.focus();
    }
  }
);

// --- Lifecycle ----------

// --- Methods ------------
function isEditing(member) {
  return editingId.value === member.id;
}

function startEditing(member) {
  if (isEditing(member)) return;
  editingId.value = member.id;
  originalName.value = member.name;
}

function commitEditing() {
  editingId.value = null;
  originalName.value = null;
}

function cancelEditing() {
  if (editingId.value !== null) {
    emit("sociogram-update-member", {
      memberId: editingId.value,
      key: "name",
      value: originalName.value,
    });
  }
  editingId.value = null;
  originalName.value = null;
}

function inputClass(member) {
  return isEditing(member)
    ? `w-full border border-line bg-white px-3 py-2 text-sm text-ink transition-colors focus:border-accent outline-none`
    : `w-full border border-transparent bg-transparent px-3 py-2 text-sm text-ink transition-colors outline-none`;
}

function updateMember(memberId, key, value) {
  emit("sociogram-update-member", { memberId, key, value });
}

function removeMember(memberId) {
  if (isEditing({ id: memberId })) {
    commitEditing();
  }
  emit("sociogram-remove-member", memberId);
}

function addMember() {
  if (!canAddMember.value) return;
  editingId.value = nextMemberId.value;
  originalName.value = "";
  emit("sociogram-add-member");
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="members.length > 0">
      <p class="eyebrow">Elenco dei nomi</p>
      <p class="mt-1 text-sm text-muted">
        {{
          editingId !== null
            ? "Premi Invio per confermare, Esc per annullare."
            : "Clicca su un nominativo per modificarlo."
        }}
      </p>
    </div>

    <LoadMembersListEditorStats
      v-if="members.length > 0"
      :members-count="membersCount"
      :duplicated-names-count="duplicatedNamesCount"
      :empty-names-count="emptyNamesCount"
    />

    <p v-if="members.length === 0" class="text-sm text-muted">
      Nessun membro caricato.
    </p>

    <div v-else class="rounded-lg border border-line">
      <ol class="list-none divide-y divide-line">
        <li
          v-for="member in members"
          :key="member.id"
          class="flex items-center gap-3 px-3 transition-colors"
        >
          <span
            class="w-6 shrink-0 text-right font-mono text-xs text-muted"
            aria-hidden="true"
          >
            {{ member.id }}
          </span>

          <input
            class="truncate"
            :data-member-id="member.id"
            :value="member.name"
            :readonly="!isEditing(member)"
            :class="[inputClass(member), isEditing(member) ? 'cursor-text' : 'cursor-pointer']"
            :aria-label="`Nome del membro ${member.id}`"
            @input="updateMember(member.id, 'name', $event.target.value)"
            @click="startEditing(member)"
            @keydown.enter.prevent="commitEditing"
            @keydown.esc.prevent="cancelEditing"
            @blur="commitEditing"
          />

          <button
            type="button"
            class="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-reject/10 hover:text-reject"
            :aria-label="`Elimina il membro ${member.name?.trim() || member.id}`"
            @click="removeMember(member.id)"
          >
            <svg
              class="size-4"
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

      <button
        v-if="hasAvailableIndices"
        type="button"
        class="flex w-full items-center justify-center rounded-b-lg border-t border-line px-3 py-2 text-gray-600 transition-colors bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!canAddMember"
        aria-label="Aggiungi membro"
        @click="addMember"
      >
        <svg
          class="size-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  </div>
</template>
