// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { routes } from "@/router";

/**
 * Menu items: the labeled routes, excluding home (reached via the logo).
 * Single source of truth shared by header and footer.
 *
 * The list is static, so it's computed once at module import.
 */
const menuRoutes = routes.filter((item) => item.meta?.inMenu);

export function useNavItems(typeOfMenu) {
  const navItems = menuRoutes.filter((item) =>
    item.meta.typeOfMenu.includes(typeOfMenu),
  );

  return { navItems };
}
