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

// Members whose preferences have been explicitly confirmed as complete.
const acknowledgedIds = ref([]);

const hasMembers = computed(() => members.value.length > 0);
const isAcknowledged = computed(
    () =>
        Boolean(currentMember.value) &&
        acknowledgedIds.value.includes(currentMember.value.id),
);
const allAcknowledged = computed(
    () =>
        hasMembers.value &&
        members.value.every((member) => acknowledgedIds.value.includes(member.id)),
);

const canGoPrevious = computed(
    () => isAcknowledged.value && currentIndex.value > 0,
);
const canGoNext = computed(
    () => isAcknowledged.value && currentIndex.value < members.value.length - 1,
);

function toggleAcknowledgment() {
    const member = currentMember.value;
    if (!member) return;

    acknowledgedIds.value = isAcknowledged.value
        ? acknowledgedIds.value.filter((id) => id !== member.id)
        : [...acknowledgedIds.value, member.id];
}

function goPreviousMember() {
    if (!canGoPrevious.value) return;
    currentIndex.value -= 1;
}

function goNextMember() {
    if (!canGoNext.value) return;
    currentIndex.value += 1;
}

const { showPrevious, showNext, showRestart, goPrevious, goNext, restart } =
    useSociogramNavigation("setPreferences", allAcknowledged, emit);
</script>

<template>
    <section class="card space-y-6">
        <StepHeader eyebrow="Passaggio 2 di 3" title="Imposta le preferenze">
            Scegli il membro con il carosello, indica chi gli piace
            (<code>likes</code>) e chi no (<code>dislikes</code>), poi conferma
            per passare al successivo.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <p v-if="!hasMembers" class="text-sm text-muted">
            Nessun membro caricato.
        </p>

        <template v-else>
            <!-- Carousel: select the subject, one member at a time. -->
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
                    label="Mi piacciono"
                    :excluded-ids="currentDislikes"
                    :self-id="currentMember?.id"
                />
                <SelectPreferences
                    v-model="currentDislikes"
                    preference="dislikes"
                    label="Non mi piacciono"
                    :excluded-ids="currentLikes"
                    :self-id="currentMember?.id"
                />
            </div>

            <!-- Acknowledgment: required to move the carousel in either direction. -->
            <label
                class="flex items-start gap-3 rounded-lg border border-line p-4"
            >
                <input
                    type="checkbox"
                    class="mt-0.5 size-4 shrink-0 accent-accent"
                    :checked="isAcknowledged"
                    @change="toggleAcknowledgment"
                />
                <span class="text-sm text-ink">
                    Ho completato le preferenze di
                    <strong>{{ currentMember?.name }}</strong
                    >.
                </span>
            </label>

            <p v-if="!isAcknowledged" class="text-xs text-muted">
                Conferma per sbloccare i pulsanti del carosello.
            </p>
        </template>
    </section>

    <SociogramNavigation
        :show-previous="showPrevious"
        :show-next="showNext"
        :show-restart="showRestart"
        :enable-previous="true"
        :enable-next="allAcknowledged"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
