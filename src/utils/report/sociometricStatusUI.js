// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// Moreno's sociometric status codes (0-8) with Italian labels, descriptions,
// and UI styling (tone, CSS classes for bar and text).
//
// Each entry carries two labels:
// - `label` is the analytic sociometric category (e.g. "Rifiutato");
// - `labelSoft` is the wording shown in the report, a softer, descriptive
//   phrasing (e.g. "Segnali di rifiuto") that expresses the same result as an
//   indicator rather than a fixed social judgment.
//
// The report uses `labelSoft` in place of `label` as a deliberate attempt to
// avoid labelling a member with a definitive, potentially stigmatising
// category.
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
