
import { createAdjacencyMatrices, getEdgeTypes, getMemberIndices } from "./matrixOfAdjs.js";
import { computeGroupLevelMetrics as morenoGroupLevel, computeIndividualLevelMetrics as morenoIndividualLevel } from "./moreno.js";
import { computeGroupLevelMetrics as snaGroupLevel, computeIndividualLevelMetrics as snaIndividualLevel } from "./sna.js";

export const getSociogramAnalysis = (members) => {

  const memberIndices = getMemberIndices(members);
  const { adjLikes, adjDislikes } = createAdjacencyMatrices(members);
  const edgeTypes = getEdgeTypes(adjLikes, adjDislikes, memberIndices);
  const morenoGroupLevelMetrics = morenoGroupLevel(adjLikes, adjDislikes);
  const morenoIndividualLevelMetrics = morenoIndividualLevel(adjLikes, adjDislikes, memberIndices,);
  const snaGroupLevelMetrics = snaGroupLevel(adjLikes, adjDislikes);
  const snaIndividualLevelMetrics = snaIndividualLevel(adjLikes, adjDislikes, memberIndices);

  return {
    edgeTypes,
    morenoGroupLevelMetrics,
    morenoIndividualLevelMetrics,
    snaGroupLevelMetrics,
    snaIndividualLevelMetrics,
  }
}
