<script setup>
// --- Vue ----------------
import { computed, ref, watch, onActivated, useTemplateRef } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/common/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/common/SociogramNavigation.vue";
import SetPreferencesCarouselMembers from "@/components/views/sociogram/steps/stepSetPreferences/SetPreferencesCarouselMembers.vue";
import SetPreferencesSelectMembers from "@/components/views/sociogram/steps/stepSetPreferences/SetPreferencesSelectMembers.vue";
import SetPreferencesMembersPreferencesProgress from "@/components/views/sociogram/steps/stepSetPreferences/SetPreferencesMembersPreferencesProgress.vue";
import SetPreferencesNoPreferences from "@/components/views/sociogram/steps/stepSetPreferences/SetPreferencesNoPreferences.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";
import { isMemberComplete } from "@/utils/sociogram/memberHelpers";

// --- Props --------------
const props = defineProps({
    targetMemberId: { type: String, default: null },
});

// --- Emits --------------
const emit = defineEmits([
    "sociogram-change-component",
    "sociogram-restart-app",
]);

// --- State --------------
const sociogramStore = useSociogramStore();
const { members, membersCount, membersStatus } = storeToRefs(sociogramStore);
const { updateMember } = sociogramStore;
const { goToStep, restart } = useSociogramNavigation(emit);

const likesRef = useTemplateRef("likes");
const dislikesRef = useTemplateRef("dislikes");

// The member whose preferences are being collected. Preferences live directly
// on each member in the store, so there is nothing to save or reload on move.
const currentIndex = ref(0);

// --- Computed -----------
const currentMember = computed(() => members.value[currentIndex.value] ?? null);

// Likes/dislikes and their "not expressed" flags are mutually exclusive: picking
// at least one member clears the flag, ticking the flag clears the list. These
const currentLikes = writableMemberField("likes", [], (value) => {
    if (value.length > 0) currentNoLikes.value = false;
});
const currentDislikes = writableMemberField("dislikes", [], (value) => {
    if (value.length > 0) currentNoDislikes.value = false;
});
const currentNoLikes = writableMemberField("noLikes", false, (value) => {
    if (value) currentLikes.value = [];
});
const currentNoDislikes = writableMemberField("noDislikes", false, (value) => {
    if (value) currentDislikes.value = [];
});

const isComplete = computed(() => isMemberComplete(currentMember.value));

const canGoNext = computed(() => membersStatus.value === "completed");

const carouselCanGoPreviousMember = computed(() => currentIndex.value > 0);

const carouselCanGoNextMember = computed(
    () => isComplete.value && currentIndex.value < members.value.length - 1,
);

// --- Watchers -----------
// When arriving from the report summary, `targetMemberId` identifies the member
// to edit. Point the carousel at it; ids that match no member are ignored.
watch(
    () => props.targetMemberId,
    (memberId) => {
        const index = members.value.findIndex(
            (member) => member.id === memberId,
        );
        if (index !== -1) currentIndex.value = index;
    },
    { immediate: true },
);

// --- Lifecycle ----------
onActivated(() => window.scrollTo(0, 0));

// --- Methods ------------
// Two-way binding to a field on the current member, falling back to an empty
// value while there is no member to edit. `onSet`, if given, runs after the
// store has been updated.
function writableMemberField(field, fallback, onSet) {
    return computed({
        get: () => currentMember.value?.[field] ?? fallback,
        set: (value) => {
            if (!currentMember.value) return;
            updateMember({
                memberId: currentMember.value.id,
                key: field,
                value,
            });
            onSet?.(value);
        },
    });
}

function carouselGoPreviousMember() {
    if (carouselCanGoPreviousMember.value) {
        currentIndex.value--;
        likesRef.value?.$el?.querySelector("input")?.focus();
    }
}

function carouselGoNextMember() {
    if (carouselCanGoNextMember.value) {
        currentIndex.value++;
        likesRef.value?.$el?.querySelector("input")?.focus();
    }
}

function tabToDislikes() {
    dislikesRef.value?.$el?.querySelector("input")?.focus();
}

function tabToLikes() {
    likesRef.value?.$el?.querySelector("input")?.focus();
}

</script>

<template>
    <section class="card space-y-3">
        <StepHeader>
            <template #eyebrow>Passaggio 3 di 4</template>
            <template #title
                >Indica le scelte e i rifiuti di ogni membro del
                gruppo</template
            >
            Seleziona una persona con i comandi del carosello, indica le sue
            scelte e i suoi rifiuti.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <p v-if="membersCount === 0" class="text-sm text-muted">
            Nessun membro caricato.
        </p>

        <template v-else>
            <!-- Progress: percentage of members whose data has been collected. -->
            <SetPreferencesMembersPreferencesProgress
                :members="members"
                class="mt-6"
            />

            <!-- Carousel: select the subject, one member at a time. -->
            <div class="mt-6">
                <p class="eyebrow">CAROSELLO</p>
            </div>

            <SetPreferencesCarouselMembers
                :current-index="currentIndex"
                :current-member="currentMember"
                :members-count="members.length"
                :can-go-previous="carouselCanGoPreviousMember"
                :can-go-next="carouselCanGoNextMember"
                @carousel-previous="carouselGoPreviousMember"
                @carousel-next="carouselGoNextMember"
                class="mb-9"
            />

            <!-- The subject's likes and dislikes. -->
            <div class="grid gap-6 md:grid-cols-2">
                <!-- Likes -->
                <SetPreferencesSelectMembers
                    ref="likes"
                    v-model="currentLikes"
                    preference="likes"
                    label="Scelte"
                    :members="members"
                    :opposing-ids="currentDislikes"
                    :self-id="currentMember?.id"
                    @keydown.tab.capture.prevent="tabToDislikes"
                />

                <!-- Dislikes-->
                <SetPreferencesSelectMembers
                    ref="dislikes"
                    v-model="currentDislikes"
                    preference="dislikes"
                    label="Rifiuti"
                    :members="members"
                    :opposing-ids="currentLikes"
                    :self-id="currentMember?.id"
                    @keydown.tab.capture.prevent="tabToLikes"
                />
            </div>

            <!-- Declared "not answered" states: unlock the carousel when the
                 member has no likes/dislikes to record. -->
            <div class="grid gap-6 md:grid-cols-2" v-show="membersCount > 1">
                <SetPreferencesNoPreferences
                    v-model="currentNoLikes"
                    tone="likes"
                >
                    <template #description>
                        Se
                        <strong>{{ currentMember?.name }}</strong>
                        non ha espresso scelte, spunta questa casella di
                        controllo.
                    </template>
                    <template #checkboxLabel>
                        Non ha espresso preferenze.
                    </template>
                </SetPreferencesNoPreferences>
                <SetPreferencesNoPreferences
                    v-model="currentNoDislikes"
                    tone="dislikes"
                >
                    <template #description>
                        Se
                        <strong>{{ currentMember?.name }}</strong>
                        non ha espresso rifiuti, spunta questa casella di
                        controllo.
                    </template>
                    <template #checkboxLabel>
                        Non ha espresso rifiuti.
                    </template>
                </SetPreferencesNoPreferences>
            </div>

            <SetPreferencesCarouselMembers
                v-show="membersCount > 8"
                :current-index="currentIndex"
                :current-member="currentMember"
                :members-count="members.length"
                :can-go-previous="carouselCanGoPreviousMember"
                :can-go-next="carouselCanGoNextMember"
                @carousel-previous="carouselGoPreviousMember"
                @carousel-next="carouselGoNextMember"
                class="mt-9"
            />
        </template>
    </section>

    <SociogramNavigation
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-restart="true"
        :enable-archive="true"
        @sociogram-navigation-previous="goToStep('manageMembers')"
        @sociogram-navigation-next="goToStep('generateReport')"
        @sociogram-navigation-restart="restart"
    />
</template>
