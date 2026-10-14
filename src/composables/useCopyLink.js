import { onBeforeUnmount, ref } from "vue";

/**
 * Copy a link to the clipboard and track a short "copied" state.
 *
 * @param {string} [text=window.location.origin] - The text to copy.
 */
export function useCopyLink(text = window.location.origin) {
  const copied = ref(false);
  let copyTimer = null;

  onBeforeUnmount(() => clearTimeout(copyTimer));

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context (https or localhost). Without it
      // there's no reliable fallback, so leave the button label unchanged.
      return;
    }

    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 2000);
  }

  return { copied, copyLink };
}
