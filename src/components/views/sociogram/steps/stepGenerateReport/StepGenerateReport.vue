<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
//   -- From vue
import { computed, toRaw } from "vue";

//   -- From vue-router
import { useRouter } from "vue-router";

//   -- From pinia
import { storeToRefs } from "pinia";

//   -- From stores
import { useSociogramStore } from "@/stores/sociogram";

//   -- From components
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/common/SociogramNavigation.vue";
import GenerateReportMemberCard from "@/components/views/sociogram/steps/stepGenerateReport/GenerateReportMemberCard.vue";

//   -- From composables
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
    "sociogram-edit-member",
]);

// --- Routers ------------
const router = useRouter();

// --- Stores -------------
const sociogramStore = useSociogramStore();
const { members } = storeToRefs(sociogramStore);

// --- State --------------

// --- Composables --------
const { validate } = useSociogramValidateData(true);
const { goToStep, restart } = useSociogramNavigation(emit);

// --- Computed -----------
// Resolve the member ids stored on likes/dislikes to display names.
const namesById = computed(
    () => new Map(members.value.map((member) => [member.id, member.name])),
);

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
  const { valid, error } = validate({ members: toRaw(members.value) });
  if (!valid) {
    console.log(error)
    router.push({ name: "sociogramValidatioError", query: { to: "/docs" } });
    return;
  };
  router.replace({ name: "report" });
}
</script>

<template>
    <section class="card space-y-6">

        <StepHeader>
            <template #eyebrow>Passaggio 4 di 4</template>
            <template #title>Riepilogo</template>
            Controlla i dati raccolti nei passaggi precedenti prima di generare
            il report.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <section class="space-y-4">
            <div class="mt-6">
                <p class="eyebrow">LISTA DEI MEMBRI</p>
            </div>
            <div class="grid gap-x-8 gap-y-5 md:grid-cols-2">
                <GenerateReportMemberCard
                    v-for="member in summary"
                    :key="member.id"
                    :member="member"
                    @sociogram-edit-member="$emit('sociogram-edit-member', $event)"
                />
            </div>
        </section>
    </section>

    <SociogramNavigation
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="true"
        :enable-archive="true"
        :enable-next="true"
        :enable-restart="true"
        @sociogram-navigation-previous="goToStep('setPreferences')"
        @sociogram-navigation-restart="restart"
        @sociogram-navigation-next="goNext"
    />
</template>
