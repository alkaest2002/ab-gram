import { computed, toRaw } from "vue";

// --- Stores -------------
import { useSociogramStore } from "@/stores/sociogram";

/**
 * Archive export for the current sociogram state.
 *
 * Produces a `data:` URL that downloads the store snapshot as base64-encoded
 * JSON — the same format `StepImportFromArchive` reads back in, so a project
 * can be stopped on any step and resumed later.
 */
export function useSociogramDownloadArchive() {
  const sociogramStore = useSociogramStore();

  const archiveHref = computed(() => {
    const json = JSON.stringify(toRaw(sociogramStore.$state));
    const encodedJson = btoa(json);
    const blob = new Blob([encodedJson], { type: "text/plain;charset=utf-8" });
    return URL.createObjectURL(blob);
  });

  function downloadArchive() {
    // Generate ISO timestamp for filename
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-") // Replace colons with hyphens (invalid in filenames)
      .slice(0, -5); // Remove milliseconds and Z

    const filename = `dati-${timestamp}.txt`;

    const link = document.createElement("a");
    link.href = archiveHref.value;
    link.download = filename;
    link.click();
  }

  return { archiveHref, downloadArchive };
}
