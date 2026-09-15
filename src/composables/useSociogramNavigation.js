import { computed, unref } from "vue";

import { useSociogramStore } from "@/stores/sociogram";

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
export function useSociogramNavigation(step, canGoNext) {
  const sociogram = useSociogramStore();

  const index = SOCIOGRAM_STEPS.indexOf(step);

  const showPrevious = computed(() => index > 0);
  const showNext = computed(() => index < SOCIOGRAM_STEPS.length - 1);
  const showRestart = computed(() => index > 0);

  const canGoNextValue = computed(() => unref(canGoNext));

  function goToStep(target) {
    if (target) sociogram.setCurrentSociogramStep(target);
  }

  function goPrevious() {
    goToStep(SOCIOGRAM_STEPS[index - 1]);
  }

  function goNext() {
    if (canGoNextValue.value) {
      goToStep(SOCIOGRAM_STEPS[index + 1]);
    }
  }

  function restart() {
    sociogram.resetMembers();
    sociogram.setCurrentSociogramStep(SOCIOGRAM_STEPS[0]);
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
