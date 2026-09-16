<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { useSociogramStore } from "@/stores/sociogram";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import MemberCarousel from "@/components/views/sociogram/steps/stepSetPreferences/MemberCarousel.vue";
import SelectPreferences from "@/components/views/sociogram/steps/stepSetPreferences/SelectPreferences.vue";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

const sociogram = useSociogramStore();
const { members } = storeToRefs(sociogram);

// The member whose preferences are being collected. Preferences live directly
// on each member in the store, so there is nothing to save or reload on move:
// the writable computeds below are the store's own arrays.
const currentIndex = ref(0);
const currentMember = computed(() => members.value[currentIndex.value] ?? null);

const currentLikes = computed({
    get: () => currentMember.value?.likes ?? [],
    set: (value) => {
        if (currentMember.value) currentMember.value.likes = value;
    },
});

const currentDislikes = computed({
    get: () => currentMember.value?.dislikes ?? [],
    set: (value) => {
        if (currentMember.value) currentMember.value.dislikes = value;
    },
});

const currentNoLikes = computed({
    get: () => currentMember.value?.noLikes ?? false,
    set: (value) => {
        if (currentMember.value) currentMember.value.noLikes = value;
    },
});

const currentNoDislikes = computed({
    get: () => currentMember.value?.noDislikes ?? false,
    set: (value) => {
        if (currentMember.value) currentMember.value.noDislikes = value;
    },
});

const hasMembers = computed(() => members.value.length > 0);

// A member's answer is complete once both categories are resolved: either by
// selecting at least one entry or by declaring "no answer" for that category.
function isMemberComplete(member) {
    if (!member) return false;

    const hasLikes = (member.likes?.length ?? 0) > 0 || Boolean(member.noLikes);
    const hasDislikes =
        (member.dislikes?.length ?? 0) > 0 || Boolean(member.noDislikes);

    return hasLikes && hasDislikes;
}

const isComplete = computed(() => isMemberComplete(currentMember.value));
const allComplete = computed(
    () => hasMembers.value && members.value.every(isMemberComplete),
);

const canGoPrevious = computed(
    () => isComplete.value && currentIndex.value > 0,
);
const canGoNext = computed(
    () =>
        isComplete.value && currentIndex.value < members.value.length - 1,
);

function goPreviousMember() {
    if (!canGoPrevious.value) return;
    currentIndex.value -= 1;
}

function goNextMember() {
    if (!canGoNext.value) return;
    currentIndex.value += 1;
}

const { showPrevious, showNext, showRestart, goPrevious, goNext, restart } =
    useSociogramNavigation("setPreferences", allComplete, emit);
</script>

<template>
    <section class="card space-y-6">
        <StepHeader eyebrow="Passaggio 2 di 3" title="Imposta le preferenze/rifiuti">
            Scegli il membro con il carosello, indica le sue preferenze e i suoi rifiuti.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>


        <p v-if="!hasMembers" class="text-sm text-muted">
            Nessun membro caricato.
        </p>

        <template v-else>
            <!-- Carousel: select the subject, one member at a time. -->
            <div>
                <p class="eyebrow">CAROSELLO</p>
            </div>
            <MemberCarousel
                :current-member="currentMember"
                :current-index="currentIndex"
                :total="members.length"
                :can-go-previous="canGoPrevious"
                :can-go-next="canGoNext"
                @previous="goPreviousMember"
                @next="goNextMember"
            />

            <!-- The subject's likes and dislikes. -->
            <div class="grid gap-6 md:grid-cols-2">
                <SelectPreferences
                    v-model="currentLikes"
                    preference="likes"
                    label="Preferenze"
                    :members="members"
                    :excluded-ids="currentDislikes"
                    :self-id="currentMember?.id"
                />
                <SelectPreferences
                    v-model="currentDislikes"
                    preference="dislikes"
                    label="Rifiuti"
                    :members="members"
                    :excluded-ids="currentLikes"
                    :self-id="currentMember?.id"
                />
            </div>

            <!-- Declared "not answered" states: unlock the carousel when the
                 member has no likes/dislikes to record. -->
            <div class="grid gap-6 md:grid-cols-2">
                <div class="rounded-lg border border-line p-4">
                    <p class="text-xs text-muted mb-3">
                        Se
                        <strong>{{ currentMember?.name }}</strong>
                        non ha espresso preferenze, seleziona la voce
                        corrispondente per sbloccare i pulsanti del carosello.
                    </p>
                    <label class="flex items-start gap-3">
                        <input
                            type="checkbox"
                            class="mt-0.5 size-4 shrink-0 accent-accent"
                            v-model="currentNoLikes"
                        />
                        <span class="text-sm text-ink">
                            Non ha espresso preferenze.
                        </span>
                    </label>
                </div>
                <div class="rounded-lg border border-line p-4">
                    <p class="text-xs text-muted mb-3">
                        Se
                        <strong>{{ currentMember?.name }}</strong>
                        non ha espresso rifiuti, seleziona la voce
                        corrispondente per sbloccare i pulsanti del carosello.
                    </p>
                    <label class="flex items-start gap-3">
                        <input
                            type="checkbox"
                            class="mt-0.5 size-4 shrink-0 accent-accent"
                            v-model="currentNoDislikes"
                        />
                        <span class="text-sm text-ink">
                            Non ha espresso rifiuti.
                        </span>
                    </label>
                </div>
            </div>
        </template>
    </section>

    <SociogramNavigation
        :show-previous="showPrevious"
        :show-next="showNext"
        :show-restart="showRestart"
        :enable-previous="true"
        :enable-next="allComplete"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
