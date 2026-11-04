// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";

//////////////////////////////////////////////////////////////////////////////////
// MORENO INDIVIDUAL-LEVEL METRICS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Received positive nominations: how many likes each member received.
 *
 * This is the column sum (in-degree) of the likes adjacency matrix.
 *
 * Formula:
 *
 *   $$ rp_i = \sum_{j} a_{ji} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeReceivedPositive = (adjLikes) => adjLikes.sum(0);

/**
 * Received negative nominations: how many dislikes each member received.
 *
 * This is the column sum (in-degree) of the dislikes adjacency matrix.
 *
 * Formula:
 *
 *   $$ rr_i = \sum_{j} d_{ji} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeReceivedNegative = (adjDislikes) => adjDislikes.sum(0);

/**
 * Given positive nominations: how many likes each member gave.
 *
 * This is the row sum (out-degree) of the likes adjacency matrix.
 *
 * Formula:
 *
 *   $$ gp_i = \sum_{j} a_{ij} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeGivenPositive = (adjLikes) => adjLikes.sum(1);

/**
 * Given negative nominations: how many dislikes each member gave.
 *
 * This is the row sum (out-degree) of the dislikes adjacency matrix.
 *
 * Formula:
 *
 *   $$ gr_i = \sum_{j} d_{ij} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeGivenNegative = (adjDislikes) => adjDislikes.sum(1);

/**
 * Mutual positive connections: how many mutual like pairs each member has.
 *
 * `adjLikes * adjLikes.T` is non-zero exactly where both directions of a like
 * exist; the row sum counts each member's mutual like partners.
 *
 * Formula:
 *
 *   $$ mp_i = \sum_{j} a_{ij}\,a_{ji} $$
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeMutualPositive = (adjLikes) => adjLikes.multiply(adjLikes.T).sum(1);

/**
 * Mutual negative connections: how many mutual dislike pairs each member has.
 *
 * Formula:
 *
 *   $$ mr_i = \sum_{j} d_{ij}\,d_{ji} $$
 *
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with the
 *   matrix row/column order).
 */
export const computeMutualNegative = (adjDislikes) => adjDislikes.multiply(adjDislikes.T).sum(1);

/**
 * Impact index: total opinions received (positive + negative).
 *
 * Formula:
 *
 *   $$ im_i = rp_i + rr_i $$
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeImpact = (rp, rr) => rp.add(rr);

/**
 * Balance index: received positive minus received negative nominations.
 *
 * Formula:
 *
 *   $$ bl_i = rp_i - rr_i $$
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeBalance = (rp, rr) => rp.subtract(rr);

/**
 * Expressivity index: total opinions given (positive + negative).
 *
 * Formula:
 *
 *   $$ ei_i = gp_i + gr_i $$
 *
 * @param {import("numpy-ts").NDArray} gp - Given positive nominations.
 * @param {import("numpy-ts").NDArray} gr - Given negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeExpressivity = (gp, gr) => gp.add(gr);

/**
 * Orientation index: given positive minus given negative nominations.
 *
 * Formula:
 *
 *   $$ or_i = gp_i - gr_i $$
 *
 * @param {import("numpy-ts").NDArray} gp - Given positive nominations.
 * @param {import("numpy-ts").NDArray} gr - Given negative nominations.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeOrientation = (gp, gr) => gp.subtract(gr);

/**
 * Affiliation index: balance plus orientation.
 *
 * Formula:
 *
 *   $$ ai_i = bl_i + or_i $$
 *
 * @param {import("numpy-ts").NDArray} balance - Balance index.
 * @param {import("numpy-ts").NDArray} orientation - Orientation index.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeAffiliation = (balance, orientation) => balance.add(orientation);

/**
 * Influence index: received positive plus mutual positive nominations.
 *
 * Formula:
 *
 *   $$ ii_i = rp_i + mp_i $$
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} mp - Mutual positive connections.
 * @returns {import("numpy-ts").NDArray} One value per member.
 */
export const computeInfluence = (rp, mp) => rp.add(mp);

/**
 * Weighted score for how early each member is placed in the other members'
 * preference lists.
 *
 * Bonus (for likes) and malus (for dislikes) weight each received nomination
 * by how early it appears in the nominator's ordered preference list: a member
 * listed first weighs `maxMembersCount`, and each later position weighs one
 * less — the report's `M - p + 1` term with a 1-based position `p`.
 *
 * @param {Array<{ id: string, likes?: string[], dislikes?: string[] }>} members - All members, in matrix row/column order.
 * @param {"likes" | "dislikes"} field - Which preference list to score.
 * @param {number} maxMembersCount - The maximum theoretical member count (`M`).
 * @returns {import("numpy-ts").NDArray} One value per member (aligned with `members` order).
 */
export const computeReceivedPreferenceScore = (members, field, maxMembersCount) =>
  np.array(
    members.map((member) =>
      members.reduce((total, other) => {
        if (other.id === member.id) return total;

        const preferences = other[field] ?? [];
        const index = preferences.indexOf(member.id);
        if (index === -1) return total;

        return total + (maxMembersCount - index);
      }, 0),
    ),
  );
