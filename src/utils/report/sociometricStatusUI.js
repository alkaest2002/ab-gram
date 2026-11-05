// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

// Moreno's sociometric status codes (0-8) with Italian labels, descriptions,
// and UI styling (tone, CSS classes for bar and text).
export const STATUS_UI = Object.freeze({
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
