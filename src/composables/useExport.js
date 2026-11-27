// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { useAppStore } from "@/stores/app";
import { useGroupStore } from "@/stores/group";
import { useReportStore } from "@/stores/report";

/**
 * @typedef {object} StoreExportOptions
 * @property {"app" | "group" | "report"} store - Store to export.
 * @property {string[]} [includeProps] - Include only these top-level properties when nonempty.
 * @property {string[]} [excludeProps] - Omit these properties, even if included above.
 * @property {string[]} [redactProps] - Property names to replace with "<REDACTED>" at any depth.
 */

/** Create detached store snapshots keyed by store name. */
export function useExport() {
  /**
   * Export the selected stores. Empty or omitted property lists select all properties.
   * @param {StoreExportOptions[]} selections
   * @returns {Record<string, object>}
   */
  function exportStores(selections) {
    const result = {};
    for (const { store, includeProps = [], excludeProps = [], redactProps = [] } of selections) {
      if (Object.hasOwn(result, store)) throw new Error(`Duplicate store export: ${store}`);

      let snapshot;
      switch (store) {
        case "app":
          snapshot = useAppStore().exportStore();
          break;
        case "group":
          snapshot = useGroupStore().exportStore(false);
          break;
        case "report":
          snapshot = useReportStore().exportStore();
          break;
        default:
          throw new Error(`Unknown store export: ${String(store)}`);
      }

      const selected = Object.fromEntries(
        Object.entries(snapshot).filter(
          ([key]) =>
            (includeProps.length === 0 || includeProps.includes(key)) &&
            !excludeProps.includes(key),
        ),
      );
      result[store] = JSON.parse(
        JSON.stringify(selected, (key, value) =>
          key !== "" && redactProps.includes(key) ? "<REDACTED>" : value,
        ),
      );
    }
    return result;
  }

  return { exportStores };
}
