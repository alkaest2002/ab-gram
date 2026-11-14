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
 * Codes `0`–`8` represent the analytic categories; `99` is the fallback for an
 * unclassified result. Reports intentionally display `labelSoft` to frame each
 * result as an indicator rather than a definitive, potentially stigmatizing
 * judgment about a member.
 *
 * @type {Readonly<Record<number, SociometricStatusUI>>}
 */
export const STATUS_UI = Object.freeze({
  99: {
    label: "Non classificato",
    labelSoft: "Non classificato",
    description: "",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  0: {
    label: "Isolato",
    labelSoft: "Segnali di isolamento",
    description: "non ha espresso/ricevuto opinioni.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  1: {
    label: "Ignorato",
    labelSoft: "Riscontro assente",
    description: "ha espresso opinioni, ma non ha ricevuto alcuna risposta.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  2: {
    label: "Marginale",
    labelSoft: "Indizi di marginalità",
    description: "basso impatto con bilancio inifluente.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  3: {
    label: "Apprezzato",
    labelSoft: "Apprezzato",
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
    label: "Malvisto",
    labelSoft: "Note di disapprovazione",
    description: "impatto medio con bilancio negativo.",
    tone: "reject",
    bar: "bg-reject",
    text: "text-reject",
  },
  6: {
    label: "Rifiutato",
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
    label: "Controverso",
    labelSoft: "Accoglienza dibattuta",
    description: "impatto alto con bilancio neutro.",
    tone: "warn",
    bar: "bg-warn",
    text: "text-warn",
  },
});
