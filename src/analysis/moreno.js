/*
MORENO GROUP LEVEL METRICS
- "cohesion":            Group cohesion index (mutual like pairs / total possible pairs)
- "conflict":            Group conflict index (mutual dislike pairs / total possible pairs)
- "positiveReciprocity": Positive reciprocity index (mutual like pairs / total likes)
- "negativeReciprocity": Negative reciprocity index (mutual dislike pairs / total dislikes)

Where, summed over the whole group of N members:
  - total likes          = sum of the likes adjacency matrix (every "like" nomination)
  - total dislikes       = sum of the dislikes adjacency matrix (every "dislike" nomination)
  - mutual like pairs    = number of reciprocal like pairs (A likes B AND B likes A),
                           each distinct pair counted once
  - mutual dislike pairs = number of reciprocal dislike pairs (A dislikes B AND
                           B dislikes A), each distinct pair counted once
  - total possible pairs = N(N - 1) / 2 (every unordered pair of members)

So:
  - cohesion            = mutual like pairs / total possible pairs
  - conflict            = mutual dislike pairs / total possible pairs
  - positiveReciprocity = mutual like pairs / total likes
  - negativeReciprocity = mutual dislike pairs / total dislikes

Cohesion and conflict fall in [0, 1] and are 0 when there are no possible pairs
(N < 2). Each reciprocity index divides mutual pairs by the number of like (or
dislike) nominations, so it falls in [0, 0.5] and is undefined (NaN) when its
denominator — total likes for positive, total dislikes for negative — is 0.
*/

/**
 * The Moreno group-level metric keys, in the order they appear as columns of
 * the group-level result row.
 *
 * - "cohesion": group cohesion index — mutual like pairs over total possible
 *   pairs (N(N-1)/2).
 * - "conflict": group conflict index — mutual dislike pairs over total possible
 *   pairs (N(N-1)/2).
 * - "positiveReciprocity": positive reciprocity index — mutual like pairs over
 *   total likes.
 * - "negativeReciprocity": negative reciprocity index — mutual dislike pairs
 *   over total dislikes.
 */
const GROUP_LEVEL_METRIC_KEYS = [
  "cohesion",
  "conflict",
  "positiveReciprocity",
  "negativeReciprocity",
];

/**
 * Compute Moreno's group-level sociometric metrics.
 *
 * `adjLikes` is the "likes" adjacency matrix and `adjDislikes` the "dislikes"
 * one, both following the `members` ordering produced by
 * `createAdjacencyMatrices`, so `matrix[i][j] === 1` means member `i` chose
 * member `j`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray}
 *   A `1` x `GROUP_LEVEL_METRIC_KEYS.length` matrix holding, in column order, the
 *   cohesion, conflict, positive-reciprocity and negative-reciprocity metrics.
 */
const computeMorenoGroupLevelMetrics = (adjLikes, adjDislikes) => {
  const size = adjLikes.shape[0];

  // Total directed nominations of each preference kind.
  const totalLikes = adjLikes.sum();
  const totalDislikes = adjDislikes.sum();

  // Number of mutual (reciprocal) like pairs. `adjLikes * adjLikes.T` is
  // non-zero exactly where both directions of a like exist; its sum counts each
  // mutual pair twice (once per direction), so halve it to count distinct pairs.
  const totalReciprocalLikes = adjLikes.multiply(adjLikes.T).sum() / 2;

  // Number of mutual (reciprocal) dislike pairs, counted the same way.
  const totalReciprocalDislikes = adjDislikes.multiply(adjDislikes.T).sum() / 2;

  // Every unordered pair of members, floored at 1 so groups smaller than two
  // members avoid a division by zero.
  const totalPossiblePairs = Math.max((size * (size - 1)) / 2, 1);

  const cohesion = totalReciprocalLikes / totalPossiblePairs;
  const conflict = totalReciprocalDislikes / totalPossiblePairs;
  const positiveReciprocity = totalReciprocalLikes / totalLikes;
  const negativeReciprocity = totalReciprocalDislikes / totalDislikes;

  return np.array([
    [cohesion, conflict, positiveReciprocity, negativeReciprocity],
  ]);
};

/**
 * Compute Moreno's group-level sociometric metrics and return them as a
 * plain object mirroring a pandas DataFrame.
 *
 * This mirrors `getMorenoIndividualLevelMetrics`, but the group is a single
 * observation: there is exactly one row (the group) and one column per metric
 * in `GROUP_LEVEL_METRIC_KEYS`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is `["group"]`, `columnIndex` is the metric name per column
 *   (in `GROUP_LEVEL_METRIC_KEYS` order), and `values` holds the single group row.
 */
export const getMorenoGroupLevelMetrics = (adjLikes, adjDislikes) => {
  const result = computeMorenoGroupLevelMetrics(adjLikes, adjDislikes);

  return {
    rowIndex: ["group"],
    columnIndex: [...GROUP_LEVEL_METRIC_KEYS],
    values: result.tolist(),
  };
};

/*
MORENO INDIVIDUAL LEVEL METRICS
- "rp": Received positive nominations (in-degree from likes adjacency matrix)
- "rr": Received negative nominations (in-degree from dislikes adjacency matrix)
- "gp": Given positive nominations (out-degree likes adjacency matrix)
- "gr": Given negative nominations (out-degree from dislikes adjacency matrix)
- "mp": Mutual positive connections (bidirectional positive edges)
- "mr": Mutual negative connections (bidirectional negative edges)
- "im": Impact index (rp + rr)
- "bl": Balance index (rp - rr)
- "ei": Expressivity index (gp + gr)
- "or": Orientation index (gp - gr)
- "ai": Affiliation index (bl + or)
- "ii": Influence index (rp + mp)
- "ss": Sociometric status (0-8, see APPROACH 1 below)

SOCIOMETRIC STATUS CODES (Approach 1: Proportion + Confidence Band)
====================================================================

Approach 1 defines "neutral balance" not as balance=0, but as a confidence band around
50/50 opinion, scaled by sample size:
  - neutral_band = 0.5 ± σ

Where:
  - p = proportion of positive opinions received (rp / (rp + rr))
  - n = total opinions received (rp + rr)
  - σ = standard error = sqrt(p(1-p) / n)

This means:
  - Small sample (few opinions) → wide neutral band → harder to escape neutral status
  - Large sample (many opinions) → narrow neutral band → strong consensus needed

Example: "3L + 1D" vs "17L + 15D"
  - 3L + 1D: p=0.75, SE≈0.22, band=[0.53, 0.97] → outside band → POSITIVE
  - 17L + 15D: p=0.53, SE≈0.09, band=[0.44, 0.62] → inside band → NEUTRAL

Impact band (relative to the sample's impact distribution):
  - Low impact     = below the 20th percentile
  - High impact    = at or above the 80th percentile
  - Average impact = in between the two

STATUS CODES:
  -1: Not classified
   0: Isolated       – no opinions received (rp + rr = 0), no opinions given (gp + gr = 0)
   1: Ignored        – no opinions received (rp + rr = 0), but not isolated (gp + gr > 0)
   2: Marginal       – low impact (impact < 20th percentile)
   3: Appreciated    – average impact, positive balance (outside upper band)
   4: Popular        – high impact, positive balance
   5: Disliked       – average impact, negative balance (outside lower band)
   6: Rejected       – high impact, negative balance
   7: Ambivalent     – average impact, neutral balance (inside confidence band)
   8: Controversial  – high impact, neutral balance (polarizing)
*/

import * as np from "numpy-ts";

/**
 * The Moreno individual-level metric keys, in the order they appear as columns
 * of the result matrix. Column `i` of a Moreno result holds the metric named
 * by `INDIVIDUAL_LEVEL_METRIC_KEYS[i]`.
 */
const INDIVIDUAL_LEVEL_METRIC_KEYS = [
  "rp",
  "rr",
  "gp",
  "gr",
  "mp",
  "mr",
  "im",
  "bl",
  "ei",
  "or",
  "ai",
  "ii",
  "ss",
];

/**
 * Compute Moreno's sociometric indices for every member.
 *
 * `adjLikes` is the "likes" adjacency matrix and `adjDislikes` the "dislikes"
 * one, both following the `members` ordering produced by
 * `createAdjacencyMatrices`, so `matrix[i][j] === 1` means member `i` chose
 * member `j`.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix.
 * @returns {import("numpy-ts").NDArray}
 *   A `size` x `INDIVIDUAL_LEVEL_METRIC_KEYS.length` matrix. Rows are members
 *   (aligned with the matrix row/column order) and columns are the metrics in
 *   `INDIVIDUAL_LEVEL_METRIC_KEYS` order.
 */
const computeIndividualLevelMetrics = (adjLikes, adjDislikes) => {
  const size = adjLikes.shape[0];
  if (size === 0) return np.empty([0, INDIVIDUAL_LEVEL_METRIC_KEYS.length]);

  // Received nominations: column sums (how many members chose me).
  const rp = adjLikes.sum(0);
  const rr = adjDislikes.sum(0);

  // Given nominations: row sums (how many members I chose).
  const gp = adjLikes.sum(1);
  const gr = adjDislikes.sum(1);

  // Mutual connections: A[i][j] && A[j][i] === elementwise A * A^T.
  const mp = adjLikes.multiply(adjLikes.T).sum(1);
  const mr = adjDislikes.multiply(adjDislikes.T).sum(1);

  // Derived indices.
  const impact = rp.add(rr);
  const balance = rp.subtract(rr);
  const expressivity = gp.add(gr);
  const orientation = gp.subtract(gr);
  const affiliation = balance.add(orientation);
  const influence = rp.add(mp);
  const sociometricStatus = getSociometricStatus(rp, rr, expressivity, impact);

  // Stack every metric as a column, keeping the numpy array until export.
  return np.column_stack([
    rp,
    rr,
    gp,
    gr,
    mp,
    mr,
    impact,
    balance,
    expressivity,
    orientation,
    affiliation,
    influence,
    sociometricStatus,
  ]);
};

/**
 * Classify members into sociometric status using impact percentiles and
 * proportion + confidence band for balance classification.
 *
 * Note: Neutral balance is defined relative to a confidence band around 50/50 opinion.
 * A person's balance is "neutral" if their proportion of positive opinions falls within
 * 0.5 ± 1σ (one standard error), accounting for sample size and variance.
 *
 * Large samples (more opinions received) require stronger consensus to escape the neutral band.
 * Small samples with few opinions are more likely to be classified as "neutral".
 *
 * @param {NDArray} rp - Received positive nominations (likes received)
 * @param {NDArray} rr - Received negative nominations (dislikes received)
 * @param {NDArray} expressivity - Expressivity index (gp + gr, opinions given)
 * @param {NDArray} impact - Impact index (rp + rr)
 * @returns {NDArray} Array of status codes (0-8)
 */
const getSociometricStatus = (rp, rr, expressivity, impact) => {
  const LOW_IMPACT_PERCENTILE = 20;
  const HIGH_IMPACT_PERCENTILE = 80;
  const size = impact.size;

  // Get unique impact values.
  const { values: uniqueImpacts } = np.unique_all(impact);

  // Guard I: when every member has the same impact, the percentile-based impact
  // bands collapse into a single threshold and no member can be ranked relative
  // to the group. Mark the whole group as "not classified" (-1).
  if (uniqueImpacts.size <= 1) {
    return np.full([size], -1);
  }

  // Compute impact cut-offs for low and high impact members.
  const impactSorted = impact.flatten().sort();
  const getPercentileIndex = (percentile) => Math.floor((size * percentile) / 100);
  const LowImpactIndex = getPercentileIndex(LOW_IMPACT_PERCENTILE);
  const HighImpactIndex = getPercentileIndex(HIGH_IMPACT_PERCENTILE);
  let lowImpactThreshold = impactSorted.get([LowImpactIndex]);
  let highImpactThreshold = impactSorted.get([HighImpactIndex]);

  // Guard II: if lowImpactThreshold is equal to highImpactThreshold
  // use a strategy other than percentiles to set cut-offs
  if (lowImpactThreshold === highImpactThreshold) {
    lowImpactThreshold = uniqueImpacts.max();
    highImpactThreshold = uniqueImpacts.min();
  }

  // Impact bands. Members with no opinions received (`isolated`/`ignored`)
  // short-circuit in the select below before the impact classification is
  // consulted.
  const totalOpinions = rp.add(rr);
  const noOpinionsReceived = totalOpinions.equal(0);
  const isolated = noOpinionsReceived.logical_and(expressivity.equal(0));
  const ignored = noOpinionsReceived.logical_and(expressivity.greater(0));
  const isLowImpact = impact.less_equal(lowImpactThreshold);
  const isHighImpact = impact.greater_equal(highImpactThreshold);
  const isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();

  // Approach 1: proportion of positive opinions + 1σ confidence band.
  // The denominator is floored at 1 so isolated/ignored members (0 opinions)
  // avoid a 0/0 division; their status is already decided above.
  const safeTotal = np.maximum(totalOpinions, 1);
  const proportion = rp.divide(safeTotal);
  const variance = proportion.multiply(proportion.multiply(-1).add(1)); // p(1 - p)
  const standardError = variance.divide(safeTotal).sqrt();
  const bandLower = standardError.multiply(-1).add(0.5);
  const bandUpper = standardError.add(0.5);

  // Balance classification against the confidence band.
  const isPositiveBalance = proportion.greater(bandUpper);
  const isNegativeBalance = proportion.less(bandLower);
  const isNeutralBalance = isPositiveBalance
    .logical_or(isNegativeBalance)
    .logical_not();

  // Classify into sociometric status (0-8). First matching condition wins.
  return np.select(
    [
      isolated, // 0: isolated — no opinions received, none given
      ignored, // 1: ignored — no opinions received, but gave opinions
      isLowImpact, // 2: marginal — low impact
      isHighImpact.logical_and(isPositiveBalance), // 4: popular
      isHighImpact.logical_and(isNegativeBalance), // 6: rejected
      isHighImpact.logical_and(isNeutralBalance), // 8: controversial
      isAverageImpact.logical_and(isPositiveBalance), // 3: appreciated
      isAverageImpact.logical_and(isNegativeBalance), // 5: disliked
      isAverageImpact.logical_and(isNeutralBalance), // 7: ambivalent
    ],
    [0, 1, 2, 4, 6, 8, 3, 5, 7],
    -1,
  );
};

/**
 * Compute Moreno's classic sociometric indices and return them as a plain
 * object mirroring a pandas DataFrame.
 *
 * This is the module's entry point for individual-level indices: it receives
 * the already-built adjacency matrices, computes the indices, and converts the
 * resulting NDArray to plain data only at this final boundary.
 *
 * @param {import("numpy-ts").NDArray} adjLikes - Likes adjacency matrix, where
 *   `adjLikes[i][j] === 1` means member `i` likes member `j`.
 * @param {import("numpy-ts").NDArray} adjDislikes - Dislikes adjacency matrix, where
 *   `adjDislikes[i][j] === 1` means member `i` dislikes member `j`.
 * @param {string[]} memberIndices - Member ids aligned with the matrix row/column
 *   order.
 * @returns {{ rowIndex: string[], columnIndex: string[], values: number[][] }}
 *   `rowIndex` is the member id per row, `columnIndex` is the metric name per
 *   column (in `INDIVIDUAL_LEVEL_METRIC_KEYS` order), and `values[i][j]` is the
 *   score of member `rowIndex[i]` for metric `columnIndex[j]`.
 */
export const getMorenoIndividualLevelMetrics = (
  adjLikes,
  adjDislikes,
  memberIndices,
) => {
  const result = computeIndividualLevelMetrics(adjLikes, adjDislikes);

  return {
    rowIndex: memberIndices,
    columnIndex: [...INDIVIDUAL_LEVEL_METRIC_KEYS],
    values: result.tolist(),
  };
};
