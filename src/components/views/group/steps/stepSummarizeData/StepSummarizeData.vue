<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { computed, toRaw } from "vue";

import { useRouter } from "vue-router";

import { storeToRefs } from "pinia";

import { useGroupStore } from "@/stores/group";
import { useAppStore } from "@/stores/app";

import StepHeader from "@/components/views/group/common/StepHeader.vue";
import StepsNavigation from "@/components/views/group/common/stepsNavigation.vue";
import SummarizeDataMemberCard from "@/components/views/group/steps/stepSummarizeData/SummarizeDataMemberCard.vue";

import { useGroupNavigation } from "@/composables/groups/useGroupNavigation";
import { useGroupValidateData } from "@/composables/groups/useGroupValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits(["group-go-to-step", "group-restart-app", "group-edit-member"]);

// --- Routers ------------
const router = useRouter();

// --- Stores -------------
const groupStore = useGroupStore();
const { members } = storeToRefs(groupStore);
const appStore = useAppStore();

// --- State --------------

// --- Composables --------
const { validate } = useGroupValidateData(true);
const { goToStep, restart } = useGroupNavigation(emit);

// --- Computed -----------
// Resolve the member ids stored on likes/dislikes to display names.
const namesById = computed(() => new Map(members.value.map((member) => [member.id, member.name])));

const summary = computed(() =>
  members.value.map((member) => {
    const resolve = (id) => namesById.value.get(id) ?? id;
    return {
      id: member.id,
      name: member.name,
      likes: (member.likes ?? []).map(resolve),
      dislikes: (member.dislikes ?? []).map(resolve),
      likesText: (member.likes ?? []).map(resolve).join(" · "),
      dislikesText: (member.dislikes ?? []).map(resolve).join(" · "),
    };
  }),
);

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function goNext() {
  const { isValid, errors } = validate({ members: toRaw(members.value) });
  if (!isValid) {
    appStore.setNotifyData(errors);
    router.push({ name: "groupValidationError" });
    return;
  }
  router.replace({ name: "report" });
}
</script>

<template>
  <section class="card space-y-6">
    <StepHeader>
      <template #eyebrow>Passaggio 4 di 4</template>
      <template #title>Riepilogo</template>
      Controlla i dati raccolti nei passaggi precedenti prima di generare il report.
    </StepHeader>

    <div class="h-px w-full bg-line" aria-hidden="true"></div>

    <section class="space-y-4">
      <div class="mt-6">
        <p class="eyebrow">LISTA DEI MEMBRI</p>
      </div>
      <div class="grid gap-x-8 gap-y-5 md:grid-cols-2">
        <SummarizeDataMemberCard
          v-for="member in summary"
          :key="member.id"
          :member="member"
          @group-edit-member="$emit('group-edit-member', $event)"
        />
      </div>
    </section>
  </section>

  <StepsNavigation
    :show-previous="true"
    :show-next="true"
    :show-restart="true"
    :enable-previous="true"
    :enable-archive="true"
    :enable-next="true"
    :enable-restart="true"
    @group-navigation-previous="goToStep('setPreferences')"
    @group-navigation-restart="restart"
    @group-navigation-next="goNext"
  />
</template>
