// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Presentation metadata for a Moreno sociometric status.
 *
 * @typedef {object} SociometricStatusUI
 * @property {string} label - Formal analytic category.
 * @property {string} labelSoft - Softer wording suitable for member-facing reports.
 * @property {string} description - Short explanation completing the status label.
 * @property {"muted" | "accent" | "reject" | "warn"} tone - Semantic UI tone.
 * @property {string} bar - Utility class applied to status bars.
 * @property {string} text - Utility class applied to status text.
 */

/**
 * UI metadata keyed by Moreno sociometric status code.
 *
 * Codes `0`–`8` represent the analytic categories; `NaN` denotes a missing or
 * unclassified result. Reports intentionally display `labelSoft` to frame each
 * result as an indicator rather than a definitive, potentially stigmatizing
 * judgment about a member.
 *
 * @type {Readonly<Record<number | "NaN", SociometricStatusUI>>}
 */
export const STATUS_UI = Object.freeze({
  NaN: {
    label: "Non classificato/a",
    labelSoft: "Non classificato/a",
    description: "",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  0: {
    label: "Isolato/a",
    labelSoft: "Segnali di isolamento",
    description: "non ha espresso/ricevuto opinioni.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-warn",
  },
  1: {
    label: "Ignorato/a",
    labelSoft: "Riscontro assente",
    description: "ha espresso opinioni, ma non ha ricevuto alcuna risposta.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  2: {
    label: "Marginale",
    labelSoft: "Indizi di marginalità",
    description: "basso impatto con bilancio ininfluente.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  3: {
    label: "Apprezzato/a",
    labelSoft: "Apprezzato/a",
    description: "impatto medio con bilancio positivo.",
    tone: "accent",
    bar: "bg-accent",
    text: "text-accent",
  },
  4: {
    label: "Popolare",
    labelSoft: "Popolare",
    description: "impatto alto con bilancio positivo.",
    tone: "accent",
    bar: "bg-accent",
    text: "text-accent",
  },
  5: {
    label: "Malvisto/a",
    labelSoft: "Note di disapprovazione",
    description: "impatto medio con bilancio negativo.",
    tone: "reject",
    bar: "bg-reject",
    text: "text-reject",
  },
  6: {
    label: "Rifiutato/a",
    labelSoft: "Segnali di rifiuto",
    description: "impatto alto con bilancio negativo.",
    tone: "reject",
    bar: "bg-reject",
    text: "text-reject",
  },
  7: {
    label: "Ambivalente",
    labelSoft: "Elementi di ambivalenza",
    description: "impatto medio con bilancio neutro.",
    tone: "warn",
    bar: "bg-warn",
    text: "text-warn",
  },
  8: {
    label: "Controverso/a",
    labelSoft: "Accoglienza dibattuta",
    description: "impatto alto con bilancio neutro.",
    tone: "warn",
    bar: "bg-warn",
    text: "text-warn",
  },
});
