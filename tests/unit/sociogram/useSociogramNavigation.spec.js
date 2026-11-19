// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi } from "vite-plus/test";

import {
  SOCIOGRAM_STEPS,
  useSociogramNavigation,
} from "@/composables/sociogram/useSociogramNavigation.js";

/**
 * Instantiate the composable with a spy `emit` so callers can assert exactly
 * which events were emitted and with what payload.
 *
 * @returns {{ emit: import("vitest").Mock, goToStep: Function, restart: Function }}
 */
function setup() {
  const emit = vi.fn();
  const { goToStep, restart } = useSociogramNavigation(emit);
  return { emit, goToStep, restart };
}

describe("SOCIOGRAM_STEPS", () => {
  it("exposes named constants for the sociogram steps", () => {
    expect(SOCIOGRAM_STEPS).toEqual({
      CREATE_PROJECT: "createProject",
      IMPORT_PROJECT: "importProject",
      LOAD_MEMBERS: "loadMembers",
      MANAGE_MEMBERS: "manageMembers",
      SET_PREFERENCES: "setPreferences",
      SUMMARIZE_DATA: "summarizeData",
    });
  });

  it("is frozen and prevents step constants from being changed", () => {
    expect(Object.isFrozen(SOCIOGRAM_STEPS)).toBe(true);
    expect(Reflect.set(SOCIOGRAM_STEPS, "CREATE_PROJECT", "changed")).toBe(false);
    expect(SOCIOGRAM_STEPS.CREATE_PROJECT).toBe("createProject");
  });
});

describe("useSociogramNavigation", () => {
  it("exposes goToStep and restart functions", () => {
    const { goToStep, restart } = setup();

    expect(typeof goToStep).toBe("function");
    expect(typeof restart).toBe("function");
  });

  it("goToStep emits sociogram-go-to-step for every valid step", () => {
    const { emit, goToStep } = setup();

    for (const step of Object.values(SOCIOGRAM_STEPS)) {
      goToStep(step);
      expect(emit).toHaveBeenCalledWith("sociogram-go-to-step", step);
    }

    expect(emit).toHaveBeenCalledTimes(Object.values(SOCIOGRAM_STEPS).length);
  });

  it("goToStep does not emit for an unknown component", () => {
    const { emit, goToStep } = setup();

    goToStep("notARealStep");

    expect(emit).not.toHaveBeenCalled();
  });

  it("goToStep does not emit for obsolete step names", () => {
    const { emit, goToStep } = setup();

    goToStep("start");
    goToStep("generateReport");

    expect(emit).not.toHaveBeenCalled();
  });

  it("goToStep does not emit for a non-string component", () => {
    const { emit, goToStep } = setup();

    goToStep(undefined);
    goToStep(null);

    expect(emit).not.toHaveBeenCalled();
  });

  it("restart emits sociogram-restart-app and navigates to create project", () => {
    const { emit, restart } = setup();

    restart();

    expect(emit).toHaveBeenNthCalledWith(1, "sociogram-restart-app");
    expect(emit).toHaveBeenNthCalledWith(2, "sociogram-go-to-step", "createProject");
    expect(emit).toHaveBeenCalledTimes(2);
  });
});
