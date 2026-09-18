import { computed } from "vue";

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

/**
 * Archive export for the current sociogram state.
 *
 * Produces a `data:` URL that downloads the store snapshot as base64-encoded
 * JSON — the same format `StepImportFromArchive` reads back in, so a project
 * can be stopped on any step and resumed later.
 */
export function useSociogramArchive() {
  const sociogram = useSociogramStore();

  // Base64-encode a string without dropping non-ASCII characters.
  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  const archiveHref = computed(() => {
    const json = JSON.stringify(sociogram.$state);
    const base64 = encodeBase64(json);
    return `data:text/plain;charset=utf-8,${base64}`;
  });

  return { archiveHref };
}
