// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/** Named constants for the group steps. */
export const GROUP_STEPS = Object.freeze({
  CREATE_PROJECT: "createProject",
  IMPORT_PROJECT: "importProject",
  LOAD_MEMBERS: "loadMembers",
  MANAGE_MEMBERS: "manageMembers",
  SET_PREFERENCES: "setPreferences",
  SUMMARIZE_DATA: "summarizeData",
});

/** @typedef {(typeof GROUP_STEPS)[keyof typeof GROUP_STEPS]} GroupStep */

/**
 * Shared group step navigation.
 *
 * @param {(event: string, payload?: GroupStep) => void} emit
 *   The Vue emit function.
 * @returns {{
 *   goToStep: (componentName: GroupStep) => void,
 *   restart: () => void,
 * }}
 */
export function useGroupNavigation(emit) {
  /** @param {GroupStep} componentName */
  function goToStep(componentName) {
    if (Object.values(GROUP_STEPS).includes(componentName)) {
      emit("group-go-to-step", componentName);
    }
  }

  function restart() {
    emit("group-restart-app");
    goToStep(GROUP_STEPS.CREATE_PROJECT);
  }

  return {
    goToStep,
    restart,
  };
}
