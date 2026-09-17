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
import BaseButton from "@/components/ui/BaseButton.vue";

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
    members.value.reduce(
        (sum, member) => sum + (member.likes?.length ?? 0),
        0,
    ),
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

// Back and restart still work here; "next" is replaced by the report link.
const { goPrevious, restart } = useSociogramNavigation(
    "generateReport",
    false,
    emit,
);
</script>

<template>
    <section class="card space-y-8">
        <StepHeader eyebrow="Passaggio 3 di 3" title="Riepilogo">
            Controlla i dati raccolti nei passaggi precedenti: quando sei
            pronto, AB-Grid calcola la rete e prepara il report.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <!-- 1 · the people, drawn as the nodes they will become. -->
        <section class="space-y-4">
            <p class="eyebrow">1 · Nomi caricati</p>
            <ul class="flex flex-wrap gap-x-6 gap-y-4">
                <li
                    v-for="member in members"
                    :key="member.id"
                    class="flex items-center gap-2.5"
                >
                    <svg viewBox="0 0 32 32" class="size-8" aria-hidden="true">
                        <circle cx="16" cy="16" r="14.3" class="node-circle" />
                        <text
                            x="16"
                            y="16"
                            dy="0.34em"
                            text-anchor="middle"
                            class="node-initial"
                        >
                            {{ member.id }}
                        </text>
                    </svg>
                    <span class="text-sm text-ink">{{ member.name }}</span>
                </li>
            </ul>
        </section>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <!-- 2 · each person's choices and rejections. -->
        <section class="space-y-4">
            <p class="eyebrow">2 · Scelte e rifiuti</p>

            <ul class="grid gap-x-8 gap-y-7 md:grid-cols-2">
                <li
                    v-for="member in summary"
                    :key="member.id"
                    class="space-y-3 card cursor-pointer transition-colors hover:border-accent"
                    role="button"
                    tabindex="0"
                    :aria-label="`Modifica le preferenze di ${member.name}`"
                    @click="openMember(member.id)"
                    @keydown.enter.prevent="openMember(member.id)"
                    @keydown.space.prevent="openMember(member.id)"
                >
                    <div class="flex items-center gap-2.5">
                        <svg
                            viewBox="0 0 32 32"
                            class="size-8"
                            aria-hidden="true"
                        >
                            <circle
                                cx="16"
                                cy="16"
                                r="14.3"
                                class="node-circle"
                            />
                            <text
                                x="16"
                                y="16"
                                dy="0.34em"
                                text-anchor="middle"
                                class="node-initial"
                            >
                                {{ member.id }}
                            </text>
                        </svg>
                        <p class="font-semibold text-ink">{{ member.name }}</p>
                    </div>

                    <div class="member-fields space-y-2.5">
                        <div class="space-y-1">
                            <span class="eyebrow flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 6"
                                    class="mark"
                                    aria-hidden="true"
                                >
                                    <line
                                        x1="1"
                                        y1="3"
                                        x2="21"
                                        y2="3"
                                        class="mark-line mark-choice"
                                    />
                                </svg>
                                <span v-if="member.likes.length == 1" class="eyebrow">{{ member.likes.length }} Scelta</span>
                                <span v-else class="eyebrow">{{ member.likes.length }} Scelte</span>
                            </span>
                            <p
                                v-if="member.likes.length"
                                class="text-sm font-medium leading-relaxed text-accent"
                            >
                                {{ member.likesText }}
                            </p>
                            <p v-else class="text-sm leading-relaxed text-muted">
                                Nessuna scelta
                            </p>
                        </div>

                        <div class="space-y-1">
                            <span class="eyebrow flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 6"
                                    class="mark"
                                    aria-hidden="true"
                                >
                                    <line
                                        x1="1"
                                        y1="3"
                                        x2="21"
                                        y2="3"
                                        class="mark-line mark-reject"
                                    />
                                </svg>
                                <span v-if="member.dislikes.length == 1" class="eyebrow">{{ member.dislikes.length }} Rifiuto</span>
                                <span v-else class="eyebrow">{{ member.dislikes.length }} Rifiuti</span>
                            </span>
                            <p
                                v-if="member.dislikes.length"
                                class="text-sm font-medium leading-relaxed text-reject"
                            >
                                {{ member.dislikesText }}
                            </p>
                            <p v-else class="text-sm leading-relaxed text-muted">
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
            title="Scarica lo stato"
            :href="stateFileHref"
            filename="sociogram-state.txt"
            label="stato (.txt)"
        >
            Puoi scaricare lo stato attuale per conservarlo e ricaricarlo
            nell'app in seguito.
        </StepDownloadLink>
    </section>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap gap-2">
            <BaseButton variant="outline" @click="restart">
                Ricomincia
            </BaseButton>
            <BaseButton variant="outline" @click="goPrevious">
                Indietro
            </BaseButton>
        </div>

        <BaseButton to="/report" variant="solid">
            Genera il report
            <span aria-hidden="true">&rarr;</span>
        </BaseButton>
    </div>
</template>

<style scoped>
/* A person, drawn as in the sociogram: white node, ink ring, mono initial. */
.node-circle {
    fill: #fff;
    stroke: var(--color-ink);
    stroke-width: 1.4;
}

.node-initial {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    fill: var(--color-ink);
}

/* The numbers up top: readings, so they're set in mono like the rest of the data. */
.stat-value {
    font-family: var(--font-mono);
    font-size: 1.75rem;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -0.02em;
}

/* Choice vs rejection, as edge swatches: solid blue vs dashed red. */
.mark {
    width: 1.375rem;
    height: 0.375rem;
    flex: none;
}

.mark-line {
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
}

.mark-choice {
    stroke: var(--color-accent);
}

.mark-reject {
    stroke: var(--color-reject);
    stroke-dasharray: 5 5;
}

/* Align each member's data under their name, past the node (size-8 + gap-2.5). */
.member-fields {
    padding-left: 2.625rem;
}
</style>
