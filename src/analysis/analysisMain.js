import { createAdjacencyMatrices, getMemberIndices } from "./common/adjacencyMatrices.js";
import { getEdgeTypes } from "./edges/edgeTypes.js";
import { getGroupLevelMetrics as morGroupLevel, getIndividualLevelMetrics as morIndividualLevel } from "./moreno/metrics/morenoMetrics.js";
import { getGroupLevelMetrics as snaGroupLevel, getIndividualLevelMetrics as snaIndividualLevel } from "./sna/metrics/snaMetrics.js";
import { getSnaComponents } from "./sna/components/snaComponents.js";
import { getSnaPlot } from "./sna/plots/snaPlots.js"
import { createLikesGraph } from "./sna/snaBase.js";

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
 *   snaLikesGroupLevelMetrics: object,
 *   snaDislikesGroupLevelMetrics: object,
 *   snaLikesComponents: object,
 *   snaDislikesComponents: object,
 *   snaLikesIndividualLevelMetric: object,
 *   snaDislikesIndividualLevelMetric: object,
 *   snaLikesPlots: object[],
 *   snaDislikesPlots: object[],
 * }} The combined sociogram analysis results.
 */
export const getSociogramAnalysis = (members) => {
  // Map each member id to its row/column position in the adjacency matrices.
  const memberIndices = getMemberIndices(members);

  /////////////////////////////////////////////////////////////////////////////////////////
  // CREATE ADJACENCY MATRICES, EDGE TYPES AND DIRECTED GRAPHS
  /////////////////////////////////////////////////////////////////////////////////////////

  // Build the likes and dislikes adjacency matrices (rows/columns follow `members` order).
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

  // Classify every directed preference edge into one of seven relationship types.
  const edgeTypes = getEdgeTypes(adjLikes, adjDislikes, memberIndices);

  // Build the likes and dislikes directed graphs once. SNA and MORENO consume them.
  const likesGraph = createLikesGraph(members, "likes");
  const dislikesGraph = createLikesGraph(members, "dislikes");

  /////////////////////////////////////////////////////////////////////////////////////////
  // MORENO
  /////////////////////////////////////////////////////////////////////////////////////////

  // Group-level Moreno metrics
  const morenoGroupLevelMetrics = morGroupLevel(adjLikes, adjDislikes);

  // Individual-level Moreno metrics, one row per member (aligned with `memberIndices`).
  const morenoIndividualLevelMetrics = morIndividualLevel(adjLikes, adjDislikes, memberIndices);

  /////////////////////////////////////////////////////////////////////////////////////////
  // SNA
  /////////////////////////////////////////////////////////////////////////////////////////

  // Group-level SNA metrics for the likes graph.
  const snaLikesGroupLevelMetrics = snaGroupLevel(likesGraph);
  const snaLikesComponents = getSnaComponents(likesGraph);
  const snaLikesIndividualLevelMetric = snaIndividualLevel(likesGraph);
  const snaLikesPlots = getSnaPlot(likesGraph, "#0000FF");

  // Initialize SNA metrics for the dislikes graph.
  let snaDislikesGroupLevelMetrics = {};
  let snaDislikesComponents = {};
  let snaDislikesIndividualLevelMetric = {}
  let snaDislikesPlots = [];

  // If the dislikes graph is not empty, compute its SNA metrics.
  if (dislikesGraph.size !== 0) {
    snaDislikesGroupLevelMetrics = snaGroupLevel(dislikesGraph);
    snaDislikesComponents = getSnaComponents(dislikesGraph);
    snaDislikesIndividualLevelMetric = snaIndividualLevel(dislikesGraph);
    snaDislikesPlots = getSnaPlot(dislikesGraph, "#FF0000");
  }

  return {
    edgeTypes,
    morenoGroupLevelMetrics,
    morenoIndividualLevelMetrics,
    snaLikesComponents,
    snaLikesGroupLevelMetrics,
    snaLikesIndividualLevelMetric,
    snaLikesPlots,
    snaDislikesComponents,
    snaDislikesGroupLevelMetrics,
    snaDislikesIndividualLevelMetric,
    snaDislikesPlots,
  };
};
