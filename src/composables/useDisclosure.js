import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Open/closed state of a collapsible panel, with closing via Esc.
 */
export function useDisclosure(initialValue = false) {
  const isOpen = ref(initialValue);

  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
  const toggle = () => (isOpen.value = !isOpen.value);

  function handleKeydown(event) {
    if (event.key === "Escape") close();
  }

  onMounted(() => window.addEventListener("keydown", handleKeydown));
  onBeforeUnmount(() => window.removeEventListener("keydown", handleKeydown));

  return { isOpen, open, close, toggle };
}
