// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import hogwartsMembers from "@/utils/group/hogwarts.json";

/**
 * The bundled Hogwarts demo roster, exposed as the shared base data for unit
 * tests that need a representative group.
 *
 * JSON modules are cached by the bundler, so returning the imported array
 * directly would let one test mutate data another test relies on. Every helper
 * below returns a fresh copy instead.
 *
 * @returns {Array<{ id: string, name: string, likes: string[], dislikes: string[], noLikes: boolean, noDislikes: boolean }>}
 */
export function getHogwartsMembers() {
  return hogwartsMembers.map((member) => ({
    ...member,
    likes: [...member.likes],
    dislikes: [...member.dislikes],
  }));
}

/**
 * The same roster wrapped in the `{ members: [...] }` shape an archived
 * group snapshot uses.
 *
 * @returns {{ members: Array<object> }}
 */
export function getHogwartsSnapshot() {
  return { members: getHogwartsMembers() };
}
