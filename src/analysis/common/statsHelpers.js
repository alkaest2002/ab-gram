// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Pure helpers for reading the individual metric objects rendered on a member's
 * report page. The metric objects share a columnar shape (see
 * `src/analysis/moreno/metrics/morenoMetrics.js` and
 * `src/analysis/sna/metrics/snaMetrics.js`): `ids` lists the row labels,
 * `metrics` the column labels, and `rawValuesById` / `rankedValuesById` /
 * `rankedValuesByMetric` the numeric tables.
 *
 * Kept free of component dependencies so the member stats sub-components can
 * share the same cell/rank accessors and formatting without duplicating logic.
 */

/**
 * Row index of a member id inside a metric object's `ids` array.
 *
 * @param {string | number | null} memberId
 * @param {{ ids?: (string | number)[] } | null} metrics
 * @returns {number} The member's row index, or `-1` when it is absent.
 */
export function memberIndexIn(memberId, metrics) {
  if (memberId == null) return -1;
  return (metrics?.ids ?? []).indexOf(memberId);
}

/**
 * Column index of a metric key inside a metric object's `metrics` array.
 *
 * @param {{ metrics?: string[] } | null} metrics
 * @param {string} key
 * @returns {number} The metric's column index, or `-1` when it is absent.
 */
export function metricIndexOf(metrics, key) {
  return (metrics?.metrics ?? []).indexOf(key);
}

/**
 * Raw value at a member/metric cell, defaulting to 0 when the cell is missing.
 *
 * @param {{ rawValuesById?: number[][] } | null} metrics
 * @param {number} memberIndex
 * @param {number} metricIndex
 * @returns {number}
 */
export function readRaw(metrics, memberIndex, metricIndex) {
  if (memberIndex < 0 || metricIndex < 0) return 0;
  return metrics?.rawValuesById?.[memberIndex]?.[metricIndex] ?? 0;
}

/**
 * Rank value at a member/metric cell, defaulting to 0 when the cell is missing.
 *
 * @param {{ rankedValuesById?: number[][] } | null} metrics
 * @param {number} memberIndex
 * @param {number} metricIndex
 * @returns {number}
 */
export function readRank(metrics, memberIndex, metricIndex) {
  if (memberIndex < 0 || metricIndex < 0) return 0;
  return metrics?.rankedValuesById?.[memberIndex]?.[metricIndex] ?? 0;
}

/**
 * Highest dense rank for a metric: `rankedValuesByMetric[m]` is the rank column,
 * so its maximum is the denominator of the "rank / max rank" chip suffix.
 *
 * @param {{ rankedValuesByMetric?: number[][] } | null} metrics
 * @param {number} metricIndex
 * @returns {number}
 */
export function readMaxRank(metrics, metricIndex) {
  const column = metrics?.rankedValuesByMetric?.[metricIndex] ?? [];
  if (!column.length) return 0;
  return Math.max(...column);
}

/**
 * Raw values are whole numbers for the Moreno indices and decimals in [0, 1]
 * for the SNA centralities; show integers verbatim and trim floats to 2 decimals
 * so the compact chips stay readable.
 *
 * @param {number} value
 * @returns {string}
 */
export function formatValue(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  if (Number.isInteger(num)) return String(num);
  return String(Math.round(num * 100) / 100);
}

/**
 * The `pct` fields on edges/structures are 0-1 fractions; present them as a
 * whole percentage (a single decimal would be noise on these dense chips).
 *
 * @param {number} value
 * @returns {string}
 */
export function formatShare(value) {
  return `${Math.round(Number(value) * 100)}%`;
}
