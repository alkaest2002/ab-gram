import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useSociogramStore } from "@/stores/sociogram";
import { sociogramSteps } from "@/router";

/**
 * Wizard navigation for the sociogram flow.
 *
 * The route is the single source of truth for "which step"; this derives the
 * current position from it and exposes prev/next/restart helpers plus the flags
 * the SociogramNavigation buttons need. Step-specific "can continue" rules are
 * colocated in `canContinue` and grow with each step's prerequisites.
 */
export function useSociogramNavigation() {
  const route = useRoute();
  const router = useRouter();
  const sociogram = useSociogramStore();

  const currentIndex = computed(() => sociogramSteps.indexOf(route.name));

  const hasPrevious = computed(() => currentIndex.value > 0);
  const hasNext = computed(
    () => currentIndex.value < sociogramSteps.length - 1
  );

  // Whether the current step may be left via "next". Add a predicate per step
  // as its prerequisites are built (e.g. preferences once they're collected).
  const canContinue = {
    "sociogram-start": () => true,
    "sociogram-load-members": () => sociogram.hasMembers,
    "sociogram-preferences": () => true,
    "sociogram-generate-report": () => true,
  };

  const canGoNext = computed(
    () => hasNext.value && (canContinue[route.name]?.() ?? true)
  );

  function goToStep(index) {
    const name = sociogramSteps[index];
    if (name) router.push({ name });
  }

  function goPrevious() {
    if (hasPrevious.value) goToStep(currentIndex.value - 1);
  }

  function goNext() {
    if (canGoNext.value) goToStep(currentIndex.value + 1);
  }

  function restart() {
    sociogram.reset();
    goToStep(0);
  }

  return {
    currentIndex,
    hasPrevious,
    hasNext,
    canGoNext,
    goPrevious,
    goNext,
    restart,
  };
}
