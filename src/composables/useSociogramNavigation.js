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
 * `Sociogram` or the sociogram store.
 *
 * @param {import('@/stores/sociogram').SociogramStep} step The step this view represents.
 * @param {import('vue').Ref<boolean> | boolean} canGoNext Whether the user may advance from this step.
 * @param {Function} emit The Vue emit function.
 */
export function useSociogramNavigation(step, canGoNext, emit) {
  const stepIndex = SOCIOGRAM_STEPS.indexOf(step);

  function goToStep(componentName) {
    if (SOCIOGRAM_STEPS.includes(componentName)) {
      emit("sociogram-change-component", componentName);
    }
  }

  function goPrevious() {
    goToStep(SOCIOGRAM_STEPS[stepIndex - 1]);
  }

  function goNext() {
    // Unwrap ref/computed values to get the boolean
    if (unref(canGoNext)) {
      goToStep(SOCIOGRAM_STEPS[stepIndex + 1]);
    }
  }

  function restart() {
    emit("sociogram-restart");
    goToStep(SOCIOGRAM_STEPS[0]);
  }

  return {
    goNext,
    goPrevious,
    restart,
  };
}
