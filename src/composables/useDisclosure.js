// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { onBeforeUnmount, onMounted, ref, watch } from "vue";

/**
 * Open/closed state of a collapsible overlay, with closing via Esc and body
 * scroll locking while open.
 *
 * @param {boolean} [initialValue=false]
 * @param {{
 *   canClose?: () => boolean,
 *   lockScroll?: boolean,
 * }} [options]
 *   `canClose` is checked before closing (including via Esc); when it returns
 *   `false`, `close()` and `toggle()` leave the panel open. `lockScroll` toggles
 *   the `overflow-hidden` class on `<body>` while open and removes it on close
 *   and unmount (defaults to `true`).
 * @returns {{
 *   isOpen: import("vue").Ref<boolean>,
 *   open: () => void,
 *   close: () => void,
 *   toggle: () => void,
 * }}
 */
export function useDisclosure(
  initialValue = false,
  { canClose = () => true, lockScroll = true } = {},
) {
  const isOpen = ref(initialValue);

  const open = () => (isOpen.value = true);
  const close = () => {
    if (!canClose()) return;
    isOpen.value = false;
  };
  const toggle = () => (isOpen.value ? close() : open());

  /** @param {KeyboardEvent} event */
  function handleKeydown(event) {
    if (event.key === "Escape") close();
  }

  if (lockScroll) {
    watch(isOpen, (open) => document.body.classList.toggle("overflow-hidden", open));
  }

  onMounted(() => window.addEventListener("keydown", handleKeydown));
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
    if (lockScroll) document.body.classList.remove("overflow-hidden");
  });

  return { isOpen, open, close, toggle };
}
