/**
 * Ordered list of the sociogram steps.
 * @type {import('@/stores/sociogram').SociogramStep[]}
 */
export const SOCIOGRAM_STEPS = [
  "start",
  "importMembers",
  "loadMembers",
  "setPreferences",
  "generateReport",
];

/**
 * Shared sociogram step navigation.
 *
 * @param {Function} emit The Vue emit function.
 */
export function useSociogramNavigation(emit) {

  function goToStep(componentName) {
    if (SOCIOGRAM_STEPS.includes(componentName)) {
      emit("sociogram-change-component", componentName);
    }
  }

  function restart() {
    emit("sociogram-restart");
    goToStep(SOCIOGRAM_STEPS[0]);
  }

  return {
    goToStep,
    restart,
  };
}
