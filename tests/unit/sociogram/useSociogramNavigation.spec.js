// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi } from "vitest";

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
  it("lists the sociogram steps in navigation order", () => {
    expect(SOCIOGRAM_STEPS).toEqual([
      "start",
      "importProject",
      "loadMembers",
      "manageMembers",
      "setPreferences",
      "generateReport",
    ]);
  });
});

describe("useSociogramNavigation", () => {
  it("exposes goToStep and restart functions", () => {
    const { goToStep, restart } = setup();

    expect(typeof goToStep).toBe("function");
    expect(typeof restart).toBe("function");
  });

  it("goToStep emits sociogram-change-component for every valid step", () => {
    const { emit, goToStep } = setup();

    for (const step of SOCIOGRAM_STEPS) {
      goToStep(step);
      expect(emit).toHaveBeenCalledWith("sociogram-change-component", step);
    }

    expect(emit).toHaveBeenCalledTimes(SOCIOGRAM_STEPS.length);
  });

  it("goToStep does not emit for an unknown component", () => {
    const { emit, goToStep } = setup();

    goToStep("notARealStep");

    expect(emit).not.toHaveBeenCalled();
  });

  it("goToStep does not emit for a non-string component", () => {
    const { emit, goToStep } = setup();

    goToStep(undefined);
    goToStep(null);

    expect(emit).not.toHaveBeenCalled();
  });

  it("restart emits sociogram-restart-app and navigates to the first step", () => {
    const { emit, restart } = setup();

    restart();

    expect(emit).toHaveBeenNthCalledWith(1, "sociogram-restart-app");
    expect(emit).toHaveBeenNthCalledWith(
      2,
      "sociogram-change-component",
      SOCIOGRAM_STEPS[0],
    );
    expect(emit).toHaveBeenCalledTimes(2);
  });
});
