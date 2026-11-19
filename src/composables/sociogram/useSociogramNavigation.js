// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** Named constants for the sociogram steps. */
export const SOCIOGRAM_STEPS = Object.freeze({
  CREATE_PROJECT: "createProject",
  IMPORT_PROJECT: "importProject",
  LOAD_MEMBERS: "loadMembers",
  MANAGE_MEMBERS: "manageMembers",
  SET_PREFERENCES: "setPreferences",
  SUMMARIZE_DATA: "summarizeData",
});

/** @typedef {(typeof SOCIOGRAM_STEPS)[keyof typeof SOCIOGRAM_STEPS]} SociogramStep */

/**
 * Shared sociogram step navigation.
 *
 * @param {(event: string, payload?: SociogramStep) => void} emit
 *   The Vue emit function.
 * @returns {{
 *   goToStep: (componentName: SociogramStep) => void,
 *   restart: () => void,
 * }}
 */
export function useSociogramNavigation(emit) {
  /** @param {SociogramStep} componentName */
  function goToStep(componentName) {
    if (Object.values(SOCIOGRAM_STEPS).includes(componentName)) {
      emit("sociogram-go-to-step", componentName);
    }
  }

  function restart() {
    emit("sociogram-restart-app");
    goToStep(SOCIOGRAM_STEPS.CREATE_PROJECT);
  }

  return {
    goToStep,
    restart,
  };
}
