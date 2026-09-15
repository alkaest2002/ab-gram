import { computed, unref } from "vue";

/**
 * Ordered list of the sociogram steps.
 * @type {import('@/stores/sociogram').SociogramStep[]}
 */
export const SOCIOGRAM_STEPS = [
  "start",
  "loadMembers",
  "setPreferences",
  "generateReport",
];

/**
 * Shared sociogram step navigation.
 *
 * Each step view owns its own "can I go next?" logic (the part that varies
 * between steps) and passes it here as a ref/computed or plain boolean.
 * Everything else — the step order, which buttons are visible, and how to move
 * between steps — is the stepper system and lives here instead of in
 * `SociogramView` or the sociogram store.
 *
 * @param {import('@/stores/sociogram').SociogramStep} step The step this view represents.
 * @param {import('vue').Ref<boolean> | boolean} canGoNext Whether the user may advance from this step.
 */
export function useSociogramNavigation(step, canGoNext, emit) {

  const stepIndex = SOCIOGRAM_STEPS.indexOf(step);
  const showPrevious = computed(() => stepIndex > 0);
  const showNext = computed(() => stepIndex < SOCIOGRAM_STEPS.length - 1);
  const showRestart = computed(() => stepIndex > 0);
  const canGoNextValue = computed(() => unref(canGoNext));

  function goToStep(componentName) {
    Object.values(SOCIOGRAM_STEPS).includes(componentName)
      && emit("sociogram-change-component", componentName);
  }

  function goPrevious() {
    goToStep(SOCIOGRAM_STEPS[stepIndex - 1]);
  }

  function goNext() {
    if (canGoNextValue.value) {
      goToStep(SOCIOGRAM_STEPS[stepIndex + 1]);
    }
  }

  function restart() {
    emit("sociogram-restart");
    goToStep(SOCIOGRAM_STEPS[0]);
  }

  return {
    showPrevious,
    showNext,
    showRestart,
    goPrevious,
    goNext,
    restart,
  };
}
