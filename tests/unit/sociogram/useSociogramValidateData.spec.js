// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vite-plus/test";

import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData.js";
import { MAX_MEMBERS_COUNT, MIN_MEMBERS_COUNT } from "@/utils/sociogram/validationHelpers.js";
import { getHogwartsMembers, getHogwartsSnapshot } from "../../fixtures/hogwarts.js";

/**
 * The Hogwarts demo roster is a valid, complete snapshot: eleven members, unique
 * ids, every like/dislike referencing an existing member, and each member
 * resolving both preference categories (via entries or the "no answer" flags).
 * Tests derive their failing cases from this base by mutating one field.
 */

function expectValid(result, parsed) {
  expect(result).toEqual({
    isValid: true,
    errors: [],
    data: parsed,
  });
}

function expectInvalid(result, error) {
  expect(result.isValid).toBe(false);
  expect(result.data).toBeNull();
  expect(result.errors).toContain(error);
}

describe("useSociogramValidateData (default)", () => {
  const { validate } = useSociogramValidateData();

  it("accepts a valid snapshot and returns it as data", () => {
    const snapshot = getHogwartsSnapshot();

    expectValid(validate(snapshot), snapshot);
  });

  it("returns the same object reference in data", () => {
    const snapshot = getHogwartsSnapshot();

    expect(validate(snapshot).data).toBe(snapshot);
  });

  it("collects every distinct error instead of stopping at the first", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].id = "";
    snapshot.members[1].name = undefined;

    expect(validate(snapshot).errors).toEqual([
      "Ogni membro del gruppo deve possedere un identificativo valido.",
      "Ogni membro del gruppo deve avere un nome.",
    ]);
  });

  it("deduplicates repeated messages", () => {
    const snapshot = { members: ["A", "B"] };

    expect(validate(snapshot).errors).toEqual(["I dati di un membro del gruppo non sono validi."]);
  });

  it("rejects a snapshot that is not an object", () => {
    const error = "Il progetto contiene dati sociometrici non validi.";

    for (const parsed of [null, undefined, 42, "archive", true]) {
      expectInvalid(validate(parsed), error);
    }
  });

  it("rejects a snapshot whose members is not an array", () => {
    const error = "Il progetto non contiene un elenco di nomi valido.";

    expectInvalid(validate({ members: "A,B,C" }), error);
    expectInvalid(validate({}), error);
  });

  it(`rejects a snapshot with more than ${MAX_MEMBERS_COUNT} members`, () => {
    const roster = getHogwartsMembers();
    const snapshot = {
      members: Array.from({ length: MAX_MEMBERS_COUNT + 1 }, (_, i) => roster[i % roster.length]),
    };

    expectInvalid(
      validate(snapshot),
      `Il progetto non può contenere più di ${MAX_MEMBERS_COUNT} nomi.`,
    );
  });

  it("rejects a member that is not an object", () => {
    const snapshot = { members: ["A", "B"] };

    expectInvalid(validate(snapshot), "I dati di un membro del gruppo non sono validi.");
  });

  it("rejects a member without an id", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].id = "";

    expectInvalid(
      validate(snapshot),
      "Ogni membro del gruppo deve possedere un identificativo valido.",
    );
  });

  it("rejects a member without a name", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].name = undefined;

    expectInvalid(validate(snapshot), "Ogni membro del gruppo deve avere un nome.");
  });

  it("rejects a member with invalid likes", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].likes = "B";

    expectInvalid(
      validate(snapshot),
      "Le scelte di un membro del gruppo contengono identificativi non validi.",
    );
  });

  it("rejects a member with invalid dislikes", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].dislikes = ["b"];

    expectInvalid(
      validate(snapshot),
      "I rifiuti di un membro del gruppo contengono identificativi non validi.",
    );
  });

  it("rejects a member with a non-boolean noLikes flag", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].noLikes = "yes";

    expectInvalid(
      validate(snapshot),
      'La spunta "nessuna scelta" di un membro del gruppo non è valida.',
    );
  });

  it("rejects a member with a non-boolean noDislikes flag", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].noDislikes = 0;

    expectInvalid(
      validate(snapshot),
      'La spunta "nessun rifiuto" di un membro del gruppo non è valida.',
    );
  });

  it(`rejects a member with more than ${MAX_MEMBERS_COUNT} likes`, () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].likes = Array.from({ length: MAX_MEMBERS_COUNT + 1 }, () => "B");

    expectInvalid(validate(snapshot), "Un membro del gruppo ha espresso troppe scelte.");
  });

  it(`rejects a member with more than ${MAX_MEMBERS_COUNT} dislikes`, () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].dislikes = Array.from({ length: MAX_MEMBERS_COUNT + 1 }, () => "B");

    expectInvalid(validate(snapshot), "Un membro del gruppo ha espresso troppi rifiuti.");
  });

  it("rejects a member who likes themself", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].likes = ["A"];

    expectInvalid(validate(snapshot), "I membri del gruppo non possono scegliere sé stessi.");
  });

  it("rejects a member who dislikes themself", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].dislikes = ["A"];

    expectInvalid(validate(snapshot), "I membri del gruppo non possono rifiutare sé stessi.");
  });

  it("rejects a snapshot with duplicate member ids", () => {
    const snapshot = getHogwartsSnapshot();
    // Luna (E) likes A, B, D and I but never references C, so changing her id
    // to "C" duplicates Ron's id and is caught by the uniqueness check rather
    // than the self-reference rule.
    snapshot.members[4].id = "C";

    expectInvalid(
      validate(snapshot),
      "Gli identificativi dei membri del gruppo devono essere univoci.",
    );
  });

  it("rejects likes that reference a missing member", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].likes = ["Z"];

    expectInvalid(
      validate(snapshot),
      "Tra le scelte espresse, almeno una fa riferimento a un soggetto inesistente.",
    );
  });

  it("rejects dislikes that reference a missing member", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0].dislikes = ["Z"];

    expectInvalid(
      validate(snapshot),
      "Tra i rifiuti espressi, almeno uno fa riferimento a un soggetto inesistente.",
    );
  });
});

describe("useSociogramValidateData(true) (complete)", () => {
  const { validate } = useSociogramValidateData(true);

  it("accepts a valid complete snapshot", () => {
    const snapshot = getHogwartsSnapshot();

    expectValid(validate(snapshot), snapshot);
  });

  it(`rejects a snapshot with fewer than ${MIN_MEMBERS_COUNT} members`, () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members = snapshot.members.slice(0, MIN_MEMBERS_COUNT - 1);

    expectInvalid(
      validate(snapshot),
      `Il progetto deve contenere almeno ${MIN_MEMBERS_COUNT} nomi.`,
    );
  });

  it("rejects a member with no likes when noLikes is false", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0] = { ...snapshot.members[0], likes: [], noLikes: false };

    expectInvalid(
      validate(snapshot),
      "I membri del gruppo devono avere almeno una preferenza oppure deve avere la spunta 'non ha espresso scelte'.",
    );
  });

  it("accepts a member with no likes when noLikes is true", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0] = { ...snapshot.members[0], likes: [], noLikes: true };

    expectValid(validate(snapshot), snapshot);
  });

  it("rejects a member with no dislikes when noDislikes is false", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0] = {
      ...snapshot.members[0],
      dislikes: [],
      noDislikes: false,
    };

    expectInvalid(
      validate(snapshot),
      "I membri del gruppo devono avere almeno un rifiuto oppure deve avere la spunta 'non ha espresso rifiuti'.",
    );
  });

  it("accepts a member with no dislikes when noDislikes is true", () => {
    const snapshot = getHogwartsSnapshot();
    snapshot.members[0] = {
      ...snapshot.members[0],
      dislikes: [],
      noDislikes: true,
    };

    expectValid(validate(snapshot), snapshot);
  });
});
