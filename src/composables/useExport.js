// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { useAppStore } from "@/stores/app";
import { useGroupStore } from "@/stores/group";
import { useReportStore } from "@/stores/report";

/**
 * @typedef {object} StoreExportOptions
 * @property {"app" | "group" | "report"} store - Store to export.
 * @property {string[]} [includeProps] - Paths to include; empty includes all properties.
 * @property {string[]} [excludeProps] - Paths to remove after inclusion.
 * @property {string[]} [redactProps] - Paths to replace with "<REDACTED>" after exclusion.
 *
 * Paths are relative to the store snapshot. Supported expressions include
 * `.members[].name`, `.members[0].name`, and `.. | .name` (recursive).
 */

/**
 * Resolve the supported jq-like path subset to concrete property paths.
 * @param {object} snapshot
 * @param {string} expression
 * @returns {string[][]}
 */
function matchPaths(snapshot, expression) {
  const recursive = expression.match(/^\.\.\s*\|\s*\.([A-Za-z_][A-Za-z0-9_]*)$/);
  if (recursive) {
    const matches = [];
    const visit = (value, path) => {
      if (value === null || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        const childPath = [...path, key];
        if (key === recursive[1]) matches.push(childPath);
        visit(child, childPath);
      }
    };
    visit(snapshot, []);
    return matches;
  }

  const tokens = expression.match(/\.[A-Za-z_][A-Za-z0-9_]*|\[(?:\d+)?\]/g);
  if (!tokens || tokens.join("") !== expression || !expression.startsWith(".")) {
    throw new Error(`Invalid export path: ${expression}`);
  }

  let matches = [{ value: snapshot, path: [] }];
  for (const token of tokens) {
    const next = [];
    for (const { value, path } of matches) {
      if (value === null || typeof value !== "object") continue;
      const keys =
        token === "[]" ? Object.keys(value) : [token.slice(1, token[0] === "." ? undefined : -1)];
      for (const key of keys) {
        if (Object.hasOwn(value, key)) next.push({ value: value[key], path: [...path, key] });
      }
    }
    matches = next;
  }
  return matches.map(({ path }) => path);
}

/** Read a concrete path from a snapshot. */
function getPath(snapshot, path) {
  return path.reduce((value, key) => value[key], snapshot);
}

/** Copy a selected path, preserving array indices with null for unselected entries. */
function includePath(target, snapshot, path) {
  let output = target;
  let source = snapshot;
  for (const [index, key] of path.entries()) {
    const last = index === path.length - 1;
    if (last) {
      output[key] = source[key];
    } else {
      if (!Object.hasOwn(output, key) || output[key] === null) {
        output[key] = Array.isArray(source[key]) ? Array(source[key].length).fill(null) : {};
      }
      output = output[key];
      source = source[key];
    }
  }
}

/** Create detached store snapshots keyed by store name. */
export function useExport() {
  /**
   * Export selected paths, then remove excluded paths and redact remaining paths.
   * Missing paths are ignored. Array indices preserved by inclusion are filled
   * with null when not selected; excluding array elements removes them.
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

      const selected = includeProps.length ? {} : snapshot;
      for (const expression of includeProps) {
        for (const path of matchPaths(snapshot, expression)) includePath(selected, snapshot, path);
      }
      for (const expression of excludeProps) {
        for (const path of matchPaths(selected, expression).reverse()) {
          const parent = getPath(selected, path.slice(0, -1));
          const key = path[path.length - 1];
          if (Array.isArray(parent)) parent.splice(Number(key), 1);
          else delete parent[key];
        }
      }
      for (const expression of redactProps) {
        for (const path of matchPaths(selected, expression).reverse()) {
          const parent = getPath(selected, path.slice(0, -1));
          parent[path[path.length - 1]] = "<REDACTED>";
        }
      }
      result[store] = selected;
    }
    return result;
  }

  return { exportStores };
}
