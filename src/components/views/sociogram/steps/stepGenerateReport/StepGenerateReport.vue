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
// Ask the parent to open the preferences step for a single member.
function openMember(memberId) {
    emit("sociogram-edit-member", memberId);
}

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
            <ul class="grid gap-x-8 gap-y-5 md:grid-cols-2">
                <li
                    v-for="member in summary"
                    :key="member.id"
                    class="card p-4 cursor-pointer transition-colors hover:border-accent"
                    role="button"
                    tabindex="0"
                    :aria-label="`Modifica le preferenze di ${member.name}`"
                    @click="openMember(member.id)"
                    @keydown.enter.prevent="openMember(member.id)"
                    @keydown.space.prevent="openMember(member.id)"
                >
                    <div class="flex items-center gap-3">
                        <svg
                            viewBox="0 0 32 32"
                            class="size-9 shrink-0"
                            aria-hidden="true"
                        >
                            <circle
                                cx="16"
                                cy="16"
                                r="14.3"
                                class="fill-canvas stroke-ink"
                                stroke-width="1.4"
                            />
                            <text
                                x="16"
                                y="16"
                                dy="0.34em"
                                text-anchor="middle"
                                class="fill-ink font-mono text-[13px] font-medium"
                            >
                                {{ member.id }}
                            </text>
                        </svg>
                        <p
                            class="min-w-0 font-display text-base font-bold leading-snug tracking-[-0.01em] text-ink"
                        >
                            {{ member.name }}
                        </p>
                    </div>

                    <div class="space-y-3 pl-12">
                        <div class="space-y-1.5">
                            <div
                                class="flex items-center justify-between gap-3"
                            >
                                <span class="eyebrow flex items-center gap-1.5">
                                    <span>{{ member.likes.length }} {{
                                        member.likes.length == 1
                                            ? "Scelta"
                                            : "Scelte"
                                    }}</span>
                                </span>
                            </div>
                            <p
                                v-if="member.likes.length"
                                class="font-mono text-[13px] font-medium leading-[1.45] text-accent"
                            >
                                {{ member.likesText }}
                            </p>
                            <p
                                v-else
                                class="text-[13px] leading-[1.45] text-muted"
                            >
                                Nessuna scelta
                            </p>
                        </div>

                        <div class="space-y-1.5">
                            <div
                                class="flex items-center justify-between gap-3"
                            >
                                <span class="eyebrow flex items-center gap-1.5">
                                    <span>{{ member.dislikes.length }} {{
                                        member.dislikes.length == 1
                                            ? "Rifiuto"
                                            : "Rifiuti"
                                    }}</span>
                                </span>
                            </div>
                            <p
                                v-if="member.dislikes.length"
                                class="font-mono text-[13px] font-medium leading-[1.45] text-reject"
                            >
                                {{ member.dislikesText }}
                            </p>
                            <p
                                v-else
                                class="text-[13px] leading-[1.45] text-muted"
                            >
                                Nessun rifiuto
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
    </section>

    <SociogramNavigation
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="true"
        :enable-archive="true"
        :enable-next="true"
        @sociogram-navigation-previous="goToStep('setPreferences')"
        @sociogram-navigation-restart="restart"
        @sociogram-navigation-next="goNext"
    />
</template>
