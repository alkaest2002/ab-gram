import { describe, it, expect } from "vitest";

import { useSociogramValidateData } from "@/composables/sociogram/useSociogramValidateData.js";
import { MAX_MEMBERS_COUNT, MIN_MEMBERS_COUNT } from "@/utils/sociogram/sociogramValidationFunctions.js";

/**
 * A structurally valid member. `overrides` lets each test tweak a single field
 * without re-declaring the whole shape.
 */
function makeMember(overrides = {}) {
  return {
    id: "A",
    name: "Alice",
    likes: [],
    dislikes: [],
    noLikes: false,
    noDislikes: false,
    ...overrides,
  };
}

/**
 * A minimal valid snapshot: two members that reference each other, which keeps
 * every default (non-complete) check green.
 */
function makeValidSnapshot() {
  return {
    members: [
      makeMember({ id: "A", name: "Alice", likes: ["B"] }),
      makeMember({ id: "B", name: "Bob", dislikes: ["A"] }),
    ],
  };
}

/**
 * A valid complete snapshot: five members, each with at least one like and one
 * dislike that point at existing members.
 */
function makeCompleteSnapshot() {
  return {
    members: [
      makeMember({ id: "A", name: "Alice", likes: ["B"], dislikes: ["C"] }),
      makeMember({ id: "B", name: "Bob", likes: ["C"], dislikes: ["D"] }),
      makeMember({ id: "C", name: "Carol", likes: ["D"], dislikes: ["E"] }),
      makeMember({ id: "D", name: "Dave", likes: ["E"], dislikes: ["A"] }),
      makeMember({ id: "E", name: "Eve", likes: ["A"], dislikes: ["B"] }),
    ],
  };
}

function expectValid(result, parsed) {
  expect(result).toEqual({ valid: true, error: null, data: parsed });
}

function expectInvalid(result, error) {
  expect(result.valid).toBe(false);
  expect(result.data).toBeNull();
  expect(result.error).toBe(error);
}

describe("useSociogramValidateData (default)", () => {
  const { validate } = useSociogramValidateData();

  it("accepts a valid snapshot and returns it as data", () => {
    const snapshot = makeValidSnapshot();

    expectValid(validate(snapshot), snapshot);
  });

  it("returns the same object reference in data", () => {
    const snapshot = makeValidSnapshot();

    expect(validate(snapshot).data).toBe(snapshot);
  });

  it("rejects a snapshot that is not an object", () => {
    const error = "Il file non contiene un dati sociometrici validi.";

    for (const parsed of [null, undefined, 42, "archive", true]) {
      expectInvalid(validate(parsed), error);
    }
  });

  it("rejects a snapshot whose members is not an array", () => {
    const error = "L'archivio non contiene un elenco di nomi valido.";

    expectInvalid(validate({ members: "A,B,C" }), error);
    expectInvalid(validate({}), error);
  });

  it(`rejects a snapshot with more than ${MAX_MEMBERS_COUNT} members`, () => {
    const snapshot = {
      members: Array.from({ length: MAX_MEMBERS_COUNT + 1 }, () => makeMember()),
    };

    expectInvalid(
      validate(snapshot),
      `L'archivio non può contenere più di ${MAX_MEMBERS_COUNT} nomi.`,
    );
  });

  it("rejects a member that is not an object", () => {
    const snapshot = { members: ["A", "B"] };

    expectInvalid(validate(snapshot), "I dati di un membro del gruppo non sono validi.");
  });

  it("rejects a member without an id", () => {
    const snapshot = { members: [makeMember({ id: "" })] };

    expectInvalid(
      validate(snapshot),
      "Ogni membro del gruppo deve possedere un identificativo valido.",
    );
  });

  it("rejects a member without a name", () => {
    const snapshot = { members: [makeMember({ name: undefined })] };

    expectInvalid(validate(snapshot), "Ogni membro del gruppo deve avere un nome.");
  });

  it("rejects a member with invalid likes", () => {
    const snapshot = { members: [makeMember({ likes: "B" })] };

    expectInvalid(
      validate(snapshot),
      "Le scelte di un membro del gruppo non sono valide.",
    );
  });

  it("rejects a member with invalid dislikes", () => {
    const snapshot = { members: [makeMember({ dislikes: ["b"] })] };

    expectInvalid(
      validate(snapshot),
      "I rifiuti di un membro del gruppo non sono validi.",
    );
  });

  it("rejects a member with a non-boolean noLikes flag", () => {
    const snapshot = { members: [makeMember({ noLikes: "yes" })] };

    expectInvalid(
      validate(snapshot),
      'Il flag "nessuna scelta" di un membro del gruppo non è valido.',
    );
  });

  it("rejects a member with a non-boolean noDislikes flag", () => {
    const snapshot = { members: [makeMember({ noDislikes: 0 })] };

    expectInvalid(
      validate(snapshot),
      'Il flag "nessun rifiuto" di un membro del gruppo non è valido.',
    );
  });

  it(`rejects a member with more than ${MAX_MEMBERS_COUNT} likes`, () => {
    const snapshot = {
      members: [
        makeMember({
          likes: Array.from({ length: MAX_MEMBERS_COUNT + 1 }, () => "B"),
        }),
      ],
    };

    expectInvalid(validate(snapshot), "Un membro del gruppo ha espresso troppe scelte.");
  });

  it(`rejects a member with more than ${MAX_MEMBERS_COUNT} dislikes`, () => {
    const snapshot = {
      members: [
        makeMember({
          dislikes: Array.from({ length: MAX_MEMBERS_COUNT + 1 }, () => "B"),
        }),
      ],
    };

    expectInvalid(validate(snapshot), "Un membro del gruppo ha espresso troppi rifiuti.");
  });

  it("rejects a member who likes themself", () => {
    const snapshot = { members: [makeMember({ likes: ["A"] })] };

    expectInvalid(
      validate(snapshot),
      "Un membro del gruppo non può scegliere sé stesso.",
    );
  });

  it("rejects a member who dislikes themself", () => {
    const snapshot = { members: [makeMember({ dislikes: ["A"] })] };

    expectInvalid(
      validate(snapshot),
      "Un membro del gruppo non può rifiutare sé stesso.",
    );
  });

  it("rejects a snapshot with duplicate member ids", () => {
    const snapshot = {
      members: [makeMember({ id: "A" }), makeMember({ id: "A", name: "Bob" })],
    };

    expectInvalid(
      validate(snapshot),
      "Gli identificativi dei membri del gruppo devono essere univoci.",
    );
  });

  it("rejects likes that reference a missing member", () => {
    const snapshot = { members: [makeMember({ likes: ["Z"] })] };

    expectInvalid(
      validate(snapshot),
      "Tra le scelte espresse, almeno uno fa riferimento a un soggetto inesistente.",
    );
  });

  it("rejects dislikes that reference a missing member", () => {
    const snapshot = { members: [makeMember({ dislikes: ["Z"] })] };

    expectInvalid(
      validate(snapshot),
      "Tra i rifiuti espressi, almeno uno fa riferimento a un soggetto inesistente.",
    );
  });
});

describe("useSociogramValidateData(true) (complete)", () => {
  const { validate } = useSociogramValidateData(true);

  it("accepts a valid complete snapshot", () => {
    const snapshot = makeCompleteSnapshot();

    expectValid(validate(snapshot), snapshot);
  });

  it(`rejects a snapshot with fewer than ${MIN_MEMBERS_COUNT} members`, () => {
    expectInvalid(
      validate(makeValidSnapshot()),
      `L'archivio deve contenere almeno ${MIN_MEMBERS_COUNT} nomi.`,
    );
  });

  it("rejects a member with no likes when noLikes is false", () => {
    const snapshot = makeCompleteSnapshot();
    snapshot.members[0] = makeMember({
      id: "A",
      name: "Alice",
      likes: [],
      dislikes: ["C"],
    });

    expectInvalid(
      validate(snapshot),
      "Un membro del gruppo deve avere almeno una preferenza.",
    );
  });

  it("accepts a member with no likes when noLikes is true", () => {
    const snapshot = makeCompleteSnapshot();
    snapshot.members[0] = makeMember({
      id: "A",
      name: "Alice",
      likes: [],
      dislikes: ["C"],
      noLikes: true,
    });

    expectValid(validate(snapshot), snapshot);
  });

  it("rejects a member with no dislikes when noDislikes is false", () => {
    const snapshot = makeCompleteSnapshot();
    snapshot.members[0] = makeMember({
      id: "A",
      name: "Alice",
      likes: ["B"],
      dislikes: [],
    });

    expectInvalid(
      validate(snapshot),
      "Un membro deve avere almeno un rifiuto.",
    );
  });

  it("accepts a member with no dislikes when noDislikes is true", () => {
    const snapshot = makeCompleteSnapshot();
    snapshot.members[0] = makeMember({
      id: "A",
      name: "Alice",
      likes: ["B"],
      dislikes: [],
      noDislikes: true,
    });

    expectValid(validate(snapshot), snapshot);
  });
});
