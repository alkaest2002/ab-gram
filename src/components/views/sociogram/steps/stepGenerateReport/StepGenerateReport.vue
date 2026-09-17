<script setup>
// --- Vue ----------------
import { computed } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import StepDownloadLink from "@/components/views/sociogram/steps/StepDownloadLink.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";

// --- Utilities ----------
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart",
    "sociogram-edit-member",
]);

// --- State --------------
const sociogram = useSociogramStore();
const { members, membersCount } = storeToRefs(sociogram);

// --- Computed -----------
const membersLabel = computed(() =>
    membersCount.value === 1 ? "membro" : "membri",
);

const totalChoices = computed(() =>
    members.value.reduce((sum, member) => sum + (member.likes?.length ?? 0), 0),
);

const totalRejections = computed(() =>
    members.value.reduce(
        (sum, member) => sum + (member.dislikes?.length ?? 0),
        0,
    ),
);

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

// Data URL for downloading the current store state, base64-encoded.
const stateFileHref = computed(() => {
    const json = JSON.stringify(sociogram.$state);
    const base64 = encodeBase64(json);
    return `data:text/plain;charset=utf-8,${base64}`;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
// Ask the parent to open the preferences step for a single member.
function openMember(memberId) {
    emit("sociogram-edit-member", memberId);
}

// Base64-encode a string without dropping non-ASCII characters.
function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

const { goToStep, restart } = useSociogramNavigation(emit);
</script>

<template>
    <section class="card space-y-8">
        <StepHeader eyebrow="Passaggio 3 di 3" title="Riepilogo">
            Controlla i dati raccolti nei passaggi precedenti prima di generare
            il report.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <!-- 1 · each person's choices and rejections. -->
        <section class="space-y-4">
            <p class="eyebrow">1 · Scelte e rifiuti</p>

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
                                    <svg
                                        viewBox="0 0 22 6"
                                        class="h-1.5 w-5.5 shrink-0"
                                        aria-hidden="true"
                                    >
                                        <line
                                            x1="1"
                                            y1="3"
                                            x2="21"
                                            y2="3"
                                            stroke-width="2.5"
                                            stroke-linecap="round"
                                            class="stroke-accent"
                                        />
                                    </svg>
                                    <span>{{
                                        member.likes.length == 1
                                            ? "Scelta"
                                            : "Scelte"
                                    }}</span>
                                </span>
                                <span
                                    class="font-mono text-sm font-medium leading-none tabular-nums text-accent"
                                    >{{ member.likes.length }}</span
                                >
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
                                    <svg
                                        viewBox="0 0 22 6"
                                        class="h-1.5 w-5.5 shrink-0"
                                        aria-hidden="true"
                                    >
                                        <line
                                            x1="1"
                                            y1="3"
                                            x2="21"
                                            y2="3"
                                            stroke-width="2.5"
                                            stroke-linecap="round"
                                            stroke-dasharray="5 5"
                                            class="stroke-reject"
                                        />
                                    </svg>
                                    <span>{{
                                        member.dislikes.length == 1
                                            ? "Rifiuto"
                                            : "Rifiuti"
                                    }}</span>
                                </span>
                                <span
                                    class="font-mono text-sm font-medium leading-none tabular-nums text-reject"
                                    >{{ member.dislikes.length }}</span
                                >
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

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <!-- 3 · export the current state for later reuse. -->
        <StepDownloadLink
            title="2. Archivia i dati"
            :href="stateFileHref"
            filename="dati.txt"
            label="dati (.txt)"
        >
            Puoi scaricare i dati raccolti per conservarli e ricaricarli
            nell'app in seguito.
        </StepDownloadLink>
    </section>

    <SociogramNavigation
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="true"
        :enable-restart="true"
        :enable-next="false"
        @sociogram-step-previous="goToStep('setPreferences')"
        @sociogram-step-restart="restart"
    />
</template>
