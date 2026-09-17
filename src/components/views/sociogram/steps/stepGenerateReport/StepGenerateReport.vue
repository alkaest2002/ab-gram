<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useSociogramStore } from "@/stores/sociogram";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

const sociogram = useSociogramStore();
const { members, membersCount } = storeToRefs(sociogram);

// Back and restart still work here; "next" is replaced by the report link.
const { goPrevious, restart } = useSociogramNavigation(
    "generateReport",
    false,
    emit,
);

const membersCountLabel = computed(() =>
    membersCount.value === 1 ? "1 membro" : `${membersCount.value} membri`,
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
        };
    }),
);
</script>

<template>
    <section class="card space-y-6">
        <StepHeader eyebrow="Passaggio 3 di 3" title="Riepilogo">
            Controlla i dati raccolti nei passaggi precedenti: quando sei
            pronto, AB-Grid calcola la rete e prepara il report.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <!-- At a glance: people, choices and rejections recorded so far. -->
        <dl
            class="grid grid-cols-1 divide-y divide-line rounded-lg border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
            <div class="flex flex-col px-5 py-4">
                <dt class="eyebrow order-2 mt-2">Persone</dt>
                <dd
                    class="order-1 font-mono text-2xl leading-none font-semibold text-ink"
                >
                    {{ membersCount }}
                </dd>
            </div>
            <div class="flex flex-col px-5 py-4">
                <dt class="eyebrow order-2 mt-2 text-accent">Scelte</dt>
                <dd
                    class="order-1 font-mono text-2xl leading-none font-semibold text-accent"
                >
                    {{ totalChoices }}
                </dd>
            </div>
            <div class="flex flex-col px-5 py-4">
                <dt class="eyebrow order-2 mt-2 text-reject">Rifiuti</dt>
                <dd
                    class="order-1 font-mono text-2xl leading-none font-semibold text-reject"
                >
                    {{ totalRejections }}
                </dd>
            </div>
        </dl>

        <!-- Step 1: the loaded names. -->
        <section class="space-y-3">
            <div class="flex items-baseline justify-between gap-3">
                <p class="eyebrow">1 · Nomi caricati</p>
                <p class="font-mono text-xs text-muted">
                    {{ membersCountLabel }}
                </p>
            </div>
            <ul class="flex flex-wrap gap-2">
                <li
                    v-for="member in members"
                    :key="member.id"
                    class="rounded-md border border-line px-2.5 py-1 text-sm text-ink"
                >
                    {{ member.name }}
                </li>
            </ul>
        </section>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <!-- Step 2: each member's choices and rejections. -->
        <section class="space-y-4">
            <div class="flex items-baseline justify-between gap-3">
                <p class="eyebrow">2 · Scelte e rifiuti</p>
                <p class="font-mono text-xs text-muted">
                    {{ membersCountLabel }}
                </p>
            </div>

            <ul class="grid gap-3 md:grid-cols-2">
                <li
                    v-for="member in summary"
                    :key="member.id"
                    class="space-y-2.5 rounded-lg border border-line p-4"
                >
                    <p class="font-semibold text-ink">{{ member.name }}</p>

                    <div class="space-y-2">
                        <div
                            class="flex flex-wrap items-start gap-x-3 gap-y-1.5"
                        >
                            <span
                                class="w-16 shrink-0 pt-0.5 font-mono text-xs text-muted"
                                >Scelte</span
                            >
                            <span
                                v-if="member.likes.length"
                                class="flex flex-wrap gap-1.5"
                            >
                                <span
                                    v-for="name in member.likes"
                                    :key="name"
                                    class="rounded-md border border-accent px-2 py-0.5 font-mono text-xs font-medium text-accent"
                                    >{{ name }}</span
                                >
                            </span>
                            <span v-else class="text-sm text-muted"
                                >Nessuna scelta</span
                            >
                        </div>

                        <div
                            class="flex flex-wrap items-start gap-x-3 gap-y-1.5"
                        >
                            <span
                                class="w-16 shrink-0 pt-0.5 font-mono text-xs text-muted"
                                >Rifiuti</span
                            >
                            <span
                                v-if="member.dislikes.length"
                                class="flex flex-wrap gap-1.5"
                            >
                                <span
                                    v-for="name in member.dislikes"
                                    :key="name"
                                    class="rounded-md border border-reject px-2 py-0.5 font-mono text-xs font-medium text-reject"
                                    >{{ name }}</span
                                >
                            </span>
                            <span v-else class="text-sm text-muted"
                                >Nessun rifiuto</span
                            >
                        </div>
                    </div>
                </li>
            </ul>
        </section>
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
