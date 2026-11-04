// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Small (8) and medium (12) sociograms for exercising sociometric-status
 * classification across a representative spread of impact and balance.
 *
 * Every helper returns a fresh copy so a test can mutate its data without
 * leaking into another test (mirrors the Hogwarts fixture).
 *
 * @typedef {{ id: string, name: string, likes: string[], dislikes: string[] }} Member
 */

const smallGroup = [
  { id: "a", name: "Alice", likes: [], dislikes: [] },
  { id: "b", name: "Bob", likes: ["a"], dislikes: ["e"] },
  { id: "c", name: "Carol", likes: ["a", "b"], dislikes: ["e"] },
  { id: "d", name: "Dave", likes: ["a", "b", "c"], dislikes: [] },
  { id: "e", name: "Eve", likes: ["a"], dislikes: [] },
  { id: "f", name: "Frank", likes: ["a", "e"], dislikes: [] },
  { id: "g", name: "Grace", likes: ["a"], dislikes: [] },
  { id: "h", name: "Heidi", likes: [], dislikes: [] },
];

const mediumGroup = [
  { id: "a", name: "Anna", likes: [], dislikes: [] },
  { id: "b", name: "Bruno", likes: ["a"], dislikes: ["e"] },
  { id: "c", name: "Carla", likes: ["a", "b"], dislikes: ["e"] },
  { id: "d", name: "Dino", likes: ["b", "c"], dislikes: ["f"] },
  { id: "e", name: "Elsa", likes: ["a"], dislikes: [] },
  { id: "f", name: "Franco", likes: ["b", "c"], dislikes: [] },
  { id: "g", name: "Gina", likes: ["c", "d"], dislikes: ["f"] },
  { id: "h", name: "Hugo", likes: ["a", "d"], dislikes: ["e"] },
  { id: "i", name: "Irene", likes: ["e", "g"], dislikes: [] },
  { id: "j", name: "Juri", likes: ["g", "h"], dislikes: [] },
  { id: "k", name: "Kara", likes: [], dislikes: [] },
  { id: "l", name: "Luca", likes: ["b", "e"], dislikes: [] },
];

const clone = (members) =>
  members.map((member) => ({
    ...member,
    likes: [...member.likes],
    dislikes: [...member.dislikes],
  }));

/**
 * An 8-member sociogram with a popular star, a few average members, a
 * disliked member, and ignored/isolated members.
 *
 * @returns {Member[]}
 */
export function getSmallGroupMembers() {
  return clone(smallGroup);
}

/**
 * A 12-member sociogram with a wider spread of positive and negative opinion.
 *
 * @returns {Member[]}
 */
export function getMediumGroupMembers() {
  return clone(mediumGroup);
}
