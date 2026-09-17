<script setup>
import { computed, ref } from "vue";

import { getMembersNameIssues } from "@/utils/members";

import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps({
  /** The members. */
  members: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:member", "remove:member"]);

// Starts read-only: the list is a preview of what was loaded. The button below
// switches to editing, where each name becomes an input and can be removed.
const isEditing = ref(false);

function toggleEditing() {
  isEditing.value = !isEditing.value;
}

// Full class strings (not interpolated) so Tailwind can see every utility.
const inputClass = computed(() =>
  isEditing.value
    ? "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink transition-colors focus:border-accent outline-none"
    : "w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm text-ink transition-colors outline-none"
);

/** Total number of members. */
const membersCount = computed(() => props.members.length);

/** Empty and duplicated names, derived from the shared member helpers. */
const nameIssues = computed(() => getMembersNameIssues(props.members));
const duplicatedNamesCount = computed(() => nameIssues.value.duplicateNamesCount);
const emptyNamesCount = computed(() => nameIssues.value.emptyNamesCount);

// Issue counts read red when they need attention, muted once they're resolved.
// Members is the baseline and always reads ink.
const duplicatedTone = computed(() =>
  duplicatedNamesCount.value > 0 ? "text-reject" : "text-muted"
);
const emptyTone = computed(() =>
  emptyNamesCount.value > 0 ? "text-reject" : "text-muted"
);

function updateMember(memberId, key, value) {
  emit("update:member", { memberId, key, value });
}

function removeMember(memberId) {
  emit("remove:member", memberId);
}
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="members.length > 0"
      class="flex flex-wrap items-center justify-between gap-3"
    >
      <div>
        <p class="eyebrow">Elenco membri</p>
        <p class="mt-1 text-sm text-muted">
          {{
            isEditing
              ? "Modifica o rimuovi i nomi prima di proseguire."
              : "Anteprima dell'elenco caricato."
          }}
        </p>
      </div>

      <BaseButton variant="outline" @click="toggleEditing">
        {{ isEditing ? "Fine modifica" : "Modifica nomi" }}
      </BaseButton>
    </div>

    <dl
      v-if="members.length > 0"
      class="grid grid-cols-1 divide-y divide-line rounded-lg border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      <!-- Membri: a filled dot, the baseline reading of the group's size. -->
      <div class="flex flex-col px-5 py-4">
        <dt class="eyebrow order-2 mt-2">Membri</dt>
        <dd class="order-1 flex items-center gap-2.5 text-ink">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink"
          >
            <svg class="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="6.5" fill="currentColor" />
            </svg>
          </span>
          <span class="font-mono text-2xl leading-none font-semibold">
            {{ membersCount }}
          </span>
        </dd>
      </div>

      <!-- Nomi duplicati: two overlapping marks — the same name twice. -->
      <div class="flex flex-col px-5 py-4">
        <dt class="eyebrow order-2 mt-2">Nomi duplicati</dt>
        <dd class="order-1 flex items-center gap-2.5" :class="duplicatedTone">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg border border-line"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              aria-hidden="true"
            >
              <circle cx="10" cy="12" r="5.5" />
              <circle cx="14" cy="12" r="5.5" />
            </svg>
          </span>
          <span class="font-mono text-2xl leading-none font-semibold">
            {{ duplicatedNamesCount }}
          </span>
        </dd>
      </div>

      <!-- Nomi vuoti: a dashed, hollow circle — the graph's mark for absence. -->
      <div class="flex flex-col px-5 py-4">
        <dt class="eyebrow order-2 mt-2">Nomi vuoti</dt>
        <dd class="order-1 flex items-center gap-2.5" :class="emptyTone">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg border border-line"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-dasharray="3 3.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="6.5" />
            </svg>
          </span>
          <span class="font-mono text-2xl leading-none font-semibold">
            {{ emptyNamesCount }}
          </span>
        </dd>
      </div>
    </dl>

    <p v-if="members.length === 0" class="text-sm text-muted">
      Nessun membro caricato.
    </p>

    <ol v-else class="list-none space-y-1">
      <li
        v-for="member in members"
        :key="member.id"
        class="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors"
        :class="isEditing ? 'hover:bg-ink/5' : ''"
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
          :aria-label="`Nome del membro ${member.id}`"
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
