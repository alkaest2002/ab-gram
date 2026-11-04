// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// Thresholds convention: low-impact <=> value <= low, high-impact <=> value >= high.
// An infinite bound means "that side is never flagged".
export const NO_SPLIT = Object.freeze({ low: -Infinity, high: Infinity });

// ============================================================================
// SOCIOMETRIC STATUS CODES
// ============================================================================
export const SOCIOMETRIC_STATUS = Object.freeze({
  UNCLASSIFIED: 99, //  sociometric status not assignable
  ISOLATED: 0, //  no opinions received, none given
  IGNORED: 1, //  no opinions received, but gave opinions
  MARGINAL: 2, //  low impact
  APPRECIATED: 3, //  average impact, positive balance
  POPULAR: 4, //  high impact, positive balance
  DISLIKED: 5, //  average impact, negative balance
  REJECTED: 6, //  high impact, negative balance
  AMBIVALENT: 7, //  average impact, neutral balance
  CONTROVERSIAL: 8, //  high impact, neutral balance
});

// Moreno's sociometric status codes (0-8) with Italian labels, descriptions,
// and UI styling (tone, CSS classes for bar and text).
export const STATUS_UI_CONFIG = Object.freeze({
  99: {
    label: "Non classificato",
    description: "",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  0: {
    label: "Isolato",
    description: "nessuna scelta ricevuta né espressa.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  1: {
    label: "Ignorato",
    description: "ha espresso scelte ma non ne ha ricevute.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  2: {
    label: "Marginale",
    description: "riceve poche attenzioni.",
    tone: "muted",
    bar: "bg-muted",
    text: "text-muted",
  },
  3: {
    label: "Apprezzato",
    description: "impatto medio con bilancio positivo.",
    tone: "accent",
    bar: "bg-accent",
    text: "text-accent",
  },
  4: {
    label: "Popolare",
    description: "impatto alto con bilancio positivo.",
    tone: "accent",
    bar: "bg-accent",
    text: "text-accent",
  },
  5: {
    label: "Malvisto",
    description: "impatto medio con bilancio negativo.",
    tone: "reject",
    bar: "bg-reject",
    text: "text-reject",
  },
  6: {
    label: "Rifiutato",
    description: "impatto alto con bilancio negativo.",
    tone: "reject",
    bar: "bg-reject",
    text: "text-reject",
  },
  7: {
    label: "Ambivalente",
    description: "impatto medio con bilancio neutro.",
    tone: "warn",
    bar: "bg-warn",
    text: "text-warn",
  },
  8: {
    label: "Controverso",
    description: "impatto alto con bilancio neutro.",
    tone: "warn",
    bar: "bg-warn",
    text: "text-warn",
  },
});
