<script setup>
// --- Vue ----------------
import { computed, ref } from "vue";

// --- Routers ------------

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

// --- Components ---------
import StepStart from "@/components/views/sociogram/steps/stepStart/StepStart.vue";
import StepImportFromArchive from "@/components/views/sociogram/steps/stepImportFromArchive/StepImportFromArchive.vue";
import StepLoadMembers from "@/components/views/sociogram/steps/stepLoadMembers/StepLoadMembers.vue";
import StepSetPreferences from "@/components/views/sociogram/steps/stepSetPreferences/StepSetPreferences.vue";
import StepGenerateReport from "@/components/views/sociogram/steps/stepGenerateReport/StepGenerateReport.vue";
import TransitionComponent from "@/components/ui/TransitionComponent.vue";

// --- Composables --------
import { SOCIOGRAM_STEPS } from "@/composables/sociogram/useSociogramNavigation";

// --- Props --------------

// --- Emits --------------

// --- State --------------
const sociogramStore = useSociogramStore();

const stateComponents = {
    start: StepStart,
    importFromArchive: StepImportFromArchive,
    loadMembers: StepLoadMembers,
    setPreferences: StepSetPreferences,
    generateReport: StepGenerateReport,
};

const currentComponentName = ref(
  sociogramStore.hasMembers
    ? SOCIOGRAM_STEPS[2]
    : SOCIOGRAM_STEPS[0]
);

// UI state: the member to point the preferences carousel at when it opens.
// Set only by the report summary's "edit this member" cards; cleared on any
// other step navigation so a stale target can't re-apply later.
const memberIdToEdit = ref(null);

// --- Computed -----------
// Pass the target id only to the preferences step; the other steps ignore it.
const stepProps = computed(() =>
    currentComponentName.value === "setPreferences"
        ? { targetMemberId: memberIdToEdit.value }
        : {},
);

// Only "sociogram-edit-member" is emitted; binding it to every step
// makes Vue try to fall through the listener on the others (e.g. StepStart,
// which renders a fragment root) and triggers a warning. Attach it conditionally.
const stepListeners = computed(() => {
    const listeners = {
        "sociogram-change-component": changeComponent,
        "sociogram-restart": sociogramStore.resetMembers,
    };

    if (currentComponentName.value === "generateReport") {
        listeners["sociogram-edit-member"] = editMember;
    }

    return listeners;
});

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
function changeComponent(componentName) {
    memberIdToEdit.value = null;
    currentComponentName.value = componentName;
}

function editMember(memberId) {
    memberIdToEdit.value = memberId;
    currentComponentName.value = "setPreferences";
}
</script>

<template>
    <div class="page">
        <h1>Costruisci il sociogramma</h1>
        <!-- Fade between steps. This is a local state change, not a route
             navigation, so it deliberately has no `@before-enter` scroll hook and
             must not touch the router's scroll coordination. -->
        <TransitionComponent>
            <div :key="currentComponentName">
                <keep-alive>
                    <component
                        :is="stateComponents[currentComponentName]"
                        v-bind="stepProps"
                        v-on="stepListeners"
                    />
                </keep-alive>
            </div>
        </TransitionComponent>
    </div>
</template>
