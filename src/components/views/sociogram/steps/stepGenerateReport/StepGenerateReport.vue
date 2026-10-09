<script setup>
// --- Vue ----------------
import { computed, toRaw } from "vue";

// --- Routers ------------
import { useRouter } from "vue-router";
const router = useRouter();

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import MemberCard from "@/components/views/sociogram/steps/stepGenerateReport/MemberCard.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
    "sociogram-edit-member",
]);

// --- State --------------
const sociogramStore = useSociogramStore();
const { members } = storeToRefs(sociogramStore);
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
            likesText: (member.likes ?? []).map(resolve).sort().join(" · "),
            dislikesText: (member.dislikes ?? []).map(resolve).sort().join(" · "),
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
  router.push({ name: "report" });
}
</script>

<template>
    <section class="card space-y-8">
        <StepHeader eyebrow="Passaggio 3 di 3" title="Riepilogo">
            Controlla i dati raccolti nei passaggi precedenti prima di generare
            il report.
        </StepHeader>

        <section class="space-y-4">
            <div class="grid gap-x-8 gap-y-5 md:grid-cols-2">
                <MemberCard
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
