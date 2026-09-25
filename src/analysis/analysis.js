import { createAdjacencyMatrices, getEdgeTypes, getMemberIndices } from "./matrixOfAdjs.js";
import { getGroupLevelMetrics as morGroupLevel, getIndividualLevelMetrics as morIndividualLevel } from "./moreno.js";
import { getGroupLevelMetrics as snaGroupLevel, getIndividualLevelMetrics as snaIndividualLevel } from "./sna.js";


/**
 * Run the full sociogram analysis over a set of members.
 *
 * This is the entry point that combines every analysis step into a single
 * result. It builds the likes/dislikes adjacency matrices, classifies each
 * directed preference into an edge type, and computes both the Moreno and the
 * SNA (social network analysis) metrics at the group and individual level.
 *
 * @param {Member[]} members - The members of the group being analysed.
 * @returns {{
 *   edgeTypes: object,
 *   morenoGroupLevelMetrics: object,
 *   morenoIndividualLevelMetrics: object,
 *   snaGroupLevelMetrics: object,
 *   snaIndividualLevelMetrics: object,
 * }} The combined sociogram analysis results.
 */
export const getSociogramAnalysis = (members) => {
  // Map each member id to its row/column position in the adjacency matrices.
  const memberIndices = getMemberIndices(members);

  // Build the likes and dislikes adjacency matrices (rows/columns follow `members` order).
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

  // Classify every directed preference edge into one of seven relationship types.
  const edgeTypes = getEdgeTypes(adjLikes, adjDislikes, memberIndices);

  // Group-level Moreno metrics: cohesion, conflict, and positive/negative reciprocity.
  const morenoGroupLevelMetrics = morGroupLevel(adjLikes, adjDislikes);

  // Individual-level Moreno metrics, one row per member (aligned with `memberIndices`).
  const morenoIndividualLevelMetrics = morIndividualLevel(adjLikes, adjDislikes, memberIndices);

  // Group-level SNA metrics.
  const snaGroupLevelMetric = snaGroupLevel(members);

  // Individual-level SNA metrics, one row per member (aligned with `memberIndices`).
  const snaIndividualLevelMetric = snaIndividualLevel(members);


  return {
    edgeTypes,
    morenoGroupLevelMetrics,
    snaGroupLevelMetric,
    morenoIndividualLevelMetrics,
    snaIndividualLevelMetric,
  };
};
