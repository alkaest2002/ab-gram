import { createAdjacencyMatrices, getEdgeTypes, getMemberIndices } from "./matrixOfAdjs.js";
import { getGroupLevelMetrics as morGroupLevel, getIndividualLevelMetrics as morIndividualLevel } from "./morenoMetrics.js";
import { getGroupLevelMetrics as snaGroupLevel, getIndividualLevelMetrics as snaIndividualLevel } from "./snaMetrics.js";
import { getSnaComponents } from "./snaComponents.js";
import { getSnaPlots } from "./snaPlots.js"

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
 *   snaIndividualLevelMetrics: object,
 * }} The combined sociogram analysis results.
 */
export const getSociogramAnalysis = (members) => {
  // Map each member id to its row/column position in the adjacency matrices.
  const memberIndices = getMemberIndices(members);

  /////////////////////////////////////////////////////////////////////////////////////////
  // CREATE ADJACENCY MATRICES, EDGE TYPES, AND SNA GRAPHS
  /////////////////////////////////////////////////////////////////////////////////////////

  // Build the likes and dislikes adjacency matrices (rows/columns follow `members` order).
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);

  // Classify every directed preference edge into one of seven relationship types.
  const edgeTypes = getEdgeTypes(adjLikes, adjDislikes, memberIndices);


  // Build the likes and dislikes directed graphs once. Every SNA consumer
  // (metrics, components, plots) reuses these two graphs instead of rebuilding
  // its own copies from `members`.
  const likesGraph = createLikesGraph(members, "likes");
  const dislikesGraph = createLikesGraph(members, "dislikes");

  /////////////////////////////////////////////////////////////////////////////////////////
  // MORENO
  /////////////////////////////////////////////////////////////////////////////////////////

  // Group-level Moreno metrics: cohesion, conflict, and positive/negative reciprocity.
  const morenoGroupLevelMetrics = morGroupLevel(adjLikes, adjDislikes);

  // Individual-level Moreno metrics, one row per member (aligned with `memberIndices`).
  const morenoIndividualLevelMetrics = morIndividualLevel(adjLikes, adjDislikes, memberIndices);

  /////////////////////////////////////////////////////////////////////////////////////////
  // SNA
  /////////////////////////////////////////////////////////////////////////////////////////

  // Group-level SNA metrics, one result per preference graph.
  const snaLikesGroupLevelMetrics = snaGroupLevel(likesGraph);
  const snaDislikesGroupLevelMetrics = snaGroupLevel(dislikesGraph);

  // SNA components: diads, cliques, and strong/weak connected components,
  // one result per preference graph.
  const snaLikesComponents = getSnaComponents(likesGraph);
  const snaDislikesComponents = getSnaComponents(dislikesGraph);

  // Individual-level SNA metrics, one row per member (aligned with `memberIndices`).
  const snaLikesIndividualLevelMetric = snaIndividualLevel(likesGraph);
  const snaDislikesIndividualLevelMetric = snaIndividualLevel(dislikesGraph);

  // SNA plots, one per preference graph.
  const snaPlots = getSnaPlots([
    // accent color is blue for likes, red for dislikes
    [likesGraph, "#0000FF"],
    [dislikesGraph, "#FF0000"]
  ]);


  return {
    edgeTypes,
    morenoGroupLevelMetrics,
    morenoIndividualLevelMetrics,
    snaLikesGroupLevelMetrics,
    snaLikesComponents,
    snaLikesIndividualLevelMetric,
    snaDislikesGroupLevelMetrics,
    snaDislikesComponents,
    snaDislikesIndividualLevelMetric,
    snaPlots
  };
};
