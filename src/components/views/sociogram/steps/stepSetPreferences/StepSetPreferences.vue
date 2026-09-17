<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { useSociogramStore } from "@/stores/sociogram";
import { useSociogramNavigation } from "@/composables/useSociogramNavigation";

import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import CarouselMembers from "@/components/views/sociogram/steps/stepSetPreferences/CarouselMembers.vue";
import SelectMembers from "@/components/views/sociogram/steps/stepSetPreferences/SelectMembers.vue";

const emit = defineEmits(["sociogram-change-component", "sociogram-restart"]);

const sociogram = useSociogramStore();
const { members, hasMembers } = storeToRefs(sociogram);

// The member whose preferences are being collected. Preferences live directly
// on each member in the store, so there is nothing to save or reload on move.
const currentIndex = ref(0);
const currentMember = computed(() => members.value[currentIndex.value] ?? null);

// Two-way binding to a field on the current member, falling back to an empty
// value while there is no member to edit.
function writableMemberField(field, fallback) {
    return computed({
        get: () => currentMember.value?.[field] ?? fallback,
        set: (value) => {
            if (currentMember.value) currentMember.value[field] = value;
        },
    });
}

const currentLikes = writableMemberField("likes", []);
const currentDislikes = writableMemberField("dislikes", []);
const currentNoLikes = writableMemberField("noLikes", false);
const currentNoDislikes = writableMemberField("noDislikes", false);

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

const canGoNext = computed(
    () => hasMembers.value && members.value.every(isMemberComplete),
);

const carouselCanGoPreviousMember = computed(() => currentIndex.value > 0);

const carouselCanGoNextMember = computed(
    () => isComplete.value && currentIndex.value < members.value.length - 1,
);

function carouselGoPreviousMember() {
    if (carouselCanGoPreviousMember.value) {
        currentIndex.value--;
    }
}

function carouselGoNextMember() {
    if (carouselCanGoNextMember.value) {
        currentIndex.value++;
    }
}

const { goNext, goPrevious, restart } = useSociogramNavigation("setPreferences", canGoNext, emit);
</script>

<template>
    <section class="card space-y-3">
        <StepHeader eyebrow="Passaggio 2 di 3" title="Imposta le preferenze e rifiuti">
            Scegli la persona con i comandi del carosello, indica le sue preferenze e i suoi rifiuti.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <p v-if="!hasMembers" class="text-sm text-muted">
            Nessun membro caricato.
        </p>

        <template v-else>
            <!-- Carousel: select the subject, one member at a time. -->
            <div class="mt-6">
                <p class="eyebrow">CAROSELLO</p>
            </div>

            <CarouselMembers
                :current-member="currentMember"
                :current-index="currentIndex"
                :total="members.length"
                :can-go-previous="carouselCanGoPreviousMember"
                :can-go-next="carouselCanGoNextMember"
                @previous="carouselGoPreviousMember"
                @next="carouselGoNextMember"
                class="mb-9"
            />

            <!-- The subject's likes and dislikes. -->
            <div class="grid gap-6 md:grid-cols-2">

                <!-- Likes -->
                <SelectMembers
                    v-model="currentLikes"
                    preference="likes"
                    label="Scelte"
                    :members="members"
                    :excluded-ids="currentDislikes"
                    :self-id="currentMember?.id"
                />

                <!-- Dislikes-->
                <SelectMembers
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
                        non ha espresso scelte, seleziona la voce
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
        :show-previous="true"
        :show-next="true"
        :show-restart="true"
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-restart="true"
        @sociogram-step-previous="goPrevious"
        @sociogram-step-next="goNext"
        @sociogram-step-restart="restart"
    />
</template>
