// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { computed } from "vue";
import { useRoute } from "vue-router";

import { flatOrdered } from "@/docs/navigation";

/**
 * Previous/next page relative to the current route, crossing section boundaries.
 * Returns `null` for whichever neighbor doesn't exist (first/last page).
 */
export function usePrevNext() {
  const route = useRoute();

  const index = computed(() =>
    flatOrdered.findIndex((item) => item.path === route.path),
  );

  const prev = computed(() =>
    index.value > 0 ? flatOrdered[index.value - 1] : null,
  );

  const next = computed(() =>
    index.value !== -1 && index.value < flatOrdered.length - 1
      ? flatOrdered[index.value + 1]
      : null,
  );

  return { prev, next };
}
