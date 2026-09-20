<script setup>
// --- Vue ----------------
import { computed, ref, watch, onActivated } from "vue";

// --- Routers ------------

// --- Stores -------------
import { storeToRefs } from "pinia";
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepHeader from "@/components/views/sociogram/steps/StepHeader.vue";
import SociogramNavigation from "@/components/views/sociogram/SociogramNavigation.vue";
import CarouselMembers from "@/components/views/sociogram/steps/stepSetPreferences/CarouselMembers.vue";
import SelectMembers from "@/components/views/sociogram/steps/stepSetPreferences/SelectMembers.vue";
import MembersPreferencesProgress from "@/components/views/sociogram/steps/stepSetPreferences/MembersPreferencesProgress.vue";

// --- Composables --------
import { useSociogramNavigation } from "@/composables/sociogram/useSociogramNavigation";

// --- Utils -------------
import { isMemberComplete } from "@/utils/sociogram/memberHelpers";

// --- Props --------------
const props = defineProps({
    targetMemberId: { type: String, default: null },
});

// --- Emits --------------
const emit = defineEmits(["sociogram-change-component", "sociogram-restart-app"]);

// --- State --------------
const sociogramStore = useSociogramStore();
const { members, hasMembers, membersCount } = storeToRefs(sociogramStore);
const { updateMember } = sociogramStore;

// The member whose preferences are being collected. Preferences live directly
// on each member in the store, so there is nothing to save or reload on move.
const currentIndex = ref(0);

// --- Computed -----------
const currentMember = computed(() => members.value[currentIndex.value] ?? null);

const currentLikes = writableMemberField("likes", []);
const currentDislikes = writableMemberField("dislikes", []);
const currentNoLikes = writableMemberField("noLikes", false);
const currentNoDislikes = writableMemberField("noDislikes", false);

const isComplete = computed(() => isMemberComplete(currentMember.value));

const canGoNext = computed(
    () => hasMembers.value && members.value.every(isMemberComplete),
);

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
        if (typeof memberId !== "string") return;
        const index = members.value.findIndex(
            (member) => member.id === memberId,
        );
        if (index !== -1) currentIndex.value = index;
    },
    { immediate: true },
);

watch(currentLikes, (newValue) => {
  if (newValue.length > 0) currentNoLikes.value = false;
})

watch(currentDislikes, (newValue) => {
  if (newValue.length > 0) currentNoDislikes.value = false;
})

watch(currentNoLikes, (newValue) => {
  newValue && resetLikes();
});

watch(currentNoDislikes, (newValue) => {
  newValue && resetDislikes();
});


// --- Lifecycle ----------
onActivated(() => window.scrollTo(0, 0));

// --- Methods ------------
// Two-way binding to a field on the current member, falling back to an empty
// value while there is no member to edit.
function writableMemberField(field, fallback) {
    return computed({
        get: () => currentMember.value?.[field] ?? fallback,
        set: (value) => {
            if (currentMember.value) {
                const memberId = currentMember.value.id;
                const key = field;
                updateMember({ memberId, key, value });
            }
        },
    });
}

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

function resetLikes() {
    currentLikes.value = [];
}

function resetDislikes() {
    currentDislikes.value = [];
}

const { goToStep, restart } = useSociogramNavigation(emit);
</script>

<template>
    <section class="card space-y-3">
        <StepHeader
            eyebrow="Passaggio 2 di 3"
            title="Indica le scelte e i rifiuti di ogni membro del gruppo"
        >
            Seleziona una persona con i comandi del carosello, indica le sue
            scelte e i suoi rifiuti.
        </StepHeader>

        <div class="h-px w-full bg-line" aria-hidden="true"></div>

        <p v-if="!hasMembers" class="text-sm text-muted">
            Nessun membro caricato.
        </p>

        <template v-else>
            <!-- Progress: percentage of members whose data has been collected. -->
            <MembersPreferencesProgress :members="members" class="mt-6" />

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
                @carousel-previous="carouselGoPreviousMember"
                @carousel-next="carouselGoNextMember"
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
            <div class="grid gap-6 md:grid-cols-2" v-show="membersCount > 1">
                <div class="rounded-lg border border-line p-4">
                    <p class="text-xs text-muted mb-3">
                        Se
                        <strong>{{ currentMember?.name }}</strong>
                        non ha espresso scelte, seleziona la voce corrispondente
                        per sbloccare i pulsanti del carosello.
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
                            class="mt-0.5 size-4 shrink-0 accent-reject"
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
        :enable-previous="true"
        :enable-next="canGoNext"
        :enable-restart="true"
        :enable-archive="true"
        @sociogram-navigation-previous="goToStep('loadMembers')"
        @sociogram-navigation-next="goToStep('generateReport')"
        @sociogram-navigation-restart="restart"
    />
</template>
