// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeGiniCoefficient } from "../../common/commonMetrics.js";

// ============================================================================
// CONFIG
// ============================================================================
const CONFIG = {
  // A tail is only "clear" with enough visible members to tell it from noise.
  // Below this, the percentile and Gini strategies abstain.
  minVisibleForTails: 5,
  // 20/80: percentile only flags the clear tails of the distribution.
  percentile: { low: 20, high: 80 },
  gini: {
    strong: 0.3,
    moderate: 0.2,
    minPtpForModerate: 3,
    // Once Gini says "unequal", tails are cut at the quartiles in ordinary
    // groups and at the outer deciles in large ones. Never at the median:
    // that would flag nearly every member not tied with it.
    innerLow: 25,
    innerHigh: 75,
    outerLow: 10,
    outerHigh: 90,
    minVisibleForOuter: 20,
  },
  tukey: { k: 1.5 }, // fences: Q1 - k*IQR, Q3 + k*IQR (strict: beyond, not at)
  binomial: { alpha: 0.05 }, // two-sided: alpha / 2 in each tail
  balance: {
    lessLenientRatio: 2.0, // threshold at or below minOpinions
    moreLenientRatio: 1.5, // threshold at or above maxOpinions
    minOpinions: 3,
    maxOpinions: 15,
  },
};

// Thresholds convention: low-impact <=> value <= low, high-impact <=> value >= high.
// An infinite bound means "that side is never flagged".
const NO_SPLIT = Object.freeze({ low: -Infinity, high: Infinity });

/**
 * Status codes (9 categories).
 */
export const SOCIOMETRIC_STATUS = Object.freeze({
  UNCLASSIFIED: 99,  //  sociometric status not assignable
  ISOLATED: 0,       //  no opinions received, none given
  IGNORED: 1,        //  no opinions received, but gave opinions
  MARGINAL: 2,       //  low impact
  APPRECIATED: 3,    //  average impact, positive balance
  POPULAR: 4,        //  high impact, positive balance
  DISLIKED: 5,       //  average impact, negative balance
  REJECTED: 6,       //  high impact, negative balance
  AMBIVALENT: 7,     //  average impact, neutral balance
  CONTROVERSIAL: 8,  //  high impact, neutral balance
});

// ============================================================================
// STEP 1: VISIBILITY
// ============================================================================
const classifyVisibility = (impact, expressivity) => {
  const hasNoOpinionsReceived = impact.equal(0);
  const hasNoOpinionsGiven = expressivity.equal(0);
  return {
    isolated: hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven),
    ignored: hasNoOpinionsReceived.logical_and(hasNoOpinionsGiven.logical_not()),
  };
};

// ============================================================================
// HELPERS (shared by the strategy and classification steps)
// ============================================================================
const toSortedVisible = (impact) =>
  impact
    .flatten()
    .toArray()
    .filter((v) => v > 0)
    .sort((a, b) => a - b); // numeric sort

// Nearest-rank index (0-based): ceil(n*p/100) - 1, clamped to a valid index.
const rankIndex = (n, percentile) =>
  Math.min(n - 1, Math.max(0, Math.ceil((n * percentile) / 100) - 1));

// Nearest-rank percentile on a sorted array. Upper percentiles are mirrored
// from the lower ones (p > 50 uses the (100 - p) rank counted from the top),
// so "bottom p%" and "top p%" always contain the same number of members.
// Plain nearest-rank is asymmetric when n*p/100 is an integer.
const percentileOf = (sorted, percentile) => {
  const n = sorted.length;
  return percentile <= 50
    ? sorted[rankIndex(n, percentile)]
    : sorted[n - 1 - rankIndex(n, 100 - percentile)];
};

// True median (mean of the two middle values for even n). percentileOf(50)
// would return the lower/upper middle value instead.
const medianOf = (sorted) => {
  const n = sorted.length;
  const mid = n >> 1;
  return n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// ============================================================================
// STEP 2: IMPACT-THRESHOLD STRATEGIES
// Each strategy: ({ sorted, allImpacts, groupSize }) => { low, high }
// ============================================================================

// Shared by the percentile and Gini strategies.
// Cuts a { low, high } pair at the given percentiles, then keeps the tails
// clear of the tied bulk: a side whose cutoff reaches the median is pulled in
// to the nearest value strictly beyond the median (or dropped if none exists).
// The result is always a subset of the nominal tail, so a tail never swallows
// the typical value, however heavy the ties.
const tailCutoffs = (sorted, lowPercentile, highPercentile) => {
  const median = medianOf(sorted);

  let low = percentileOf(sorted, lowPercentile);
  if (!(low < median)) {
    low = -Infinity;
    for (const v of sorted) {
      if (v < median) low = v; // ends as the largest value strictly below
      else break;
    }
  }

  let high = percentileOf(sorted, highPercentile);
  if (!(high > median)) {
    high = Infinity;
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
      if (sorted[i] > median) high = sorted[i]; // smallest strictly above
      else break;
    }
  }

  return low === -Infinity && high === Infinity ? NO_SPLIT : { low, high };
};

// 2a. Plain percentiles (20/80), tie-aware. Abstains for fewer than
// minVisibleForTails visible members: with so few, "bottom 20%" is one or two
// people and says nothing about clear tails. Because tails never include the
// tied median bulk, this strategy now also abstains on flat distributions
// instead of always voting.
const percentileStrategy = ({ sorted }) => {
  if (sorted.length < CONFIG.minVisibleForTails) return NO_SPLIT;
  return tailCutoffs(sorted, CONFIG.percentile.low, CONFIG.percentile.high);
};

// 2b. Inequality-driven: Gini decides WHETHER to split (shape recognition:
// bimodal / long-tail), the percentiles decide WHERE.
const giniStrategy = ({ sorted }) => {
  const c = CONFIG.gini;
  if (sorted.length < Math.max(2, CONFIG.minVisibleForTails)) return NO_SPLIT;
  const ptp = sorted[sorted.length - 1] - sorted[0];
  // Bias-corrected sample Gini (* N/(N-1)): the population formula
  // underestimates inequality in the small groups typical of sociometry.
  const gini =
    computeGiniCoefficient(np.array(sorted)) *
    (sorted.length / (sorted.length - 1));

  const unequal =
    gini >= c.strong || (gini >= c.moderate && ptp >= c.minPtpForModerate);
  if (!unequal) return NO_SPLIT;

  const large = sorted.length >= c.minVisibleForOuter;
  return tailCutoffs(
    sorted,
    large ? c.outerLow : c.innerLow,
    large ? c.outerHigh : c.innerHigh,
  );
};

// 2c. Tukey's inner fences over visible members: Q1 - k*IQR, Q3 + k*IQR.
// Strict, as in Tukey's definition: only values BEYOND a fence are outliers,
// never a value sitting exactly on it. Since downstream comparisons are
// inclusive (<= low, >= high), the cutoffs are set to the nearest observed
// value strictly beyond each fence. Fences outside the observed range leave
// that side unflagged.
const tukeyStrategy = ({ sorted }) => {
  const q1 = percentileOf(sorted, 25);
  const q3 = percentileOf(sorted, 75);
  const iqr = q3 - q1;
  if (iqr === 0) return NO_SPLIT; // fences would collapse onto the median
  const k = CONFIG.tukey.k;
  const lowFence = q1 - k * iqr;
  const highFence = q3 + k * iqr;

  let low = -Infinity;
  for (const v of sorted) {
    if (v < lowFence) low = v; // largest value strictly below the fence
    else break;
  }
  let high = Infinity;
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    if (sorted[i] > highFence) high = sorted[i]; // smallest strictly above
    else break;
  }
  return { low, high };
};

// 2d. GB method: exact binomial test (replaces Salvosa's tables).
// Under chance, opinions received by one member ~ Binomial(N-1, p), with
// p = total opinions / (N * (N-1)). Limits are the counts whose tail
// probability is <= alpha/2.
const binomialCdf = (n, p) => {
  // Recurrence kept in log space: (1-p)^n underflows to 0 for large n, which
  // would zero the entire CDF if carried multiplicatively.
  const logOdds = Math.log(p) - Math.log1p(-p);
  let logPmf = n * Math.log1p(-p); // log P(X = 0)
  let cumulative = 0;
  const cdf = [];
  for (let k = 0; k <= n; k++) {
    cumulative += Math.exp(logPmf);
    cdf.push(Math.min(1, cumulative));
    logPmf += Math.log((n - k) / (k + 1)) + logOdds; // log P(X = k+1)
  }
  return cdf;
};

const binomialStrategy = ({ allImpacts, groupSize }) => {
  const n = groupSize - 1; // possible givers for any one member
  if (n < 1) return NO_SPLIT;
  const total = allImpacts.reduce((s, v) => s + v, 0);
  const p = total / (groupSize * n);
  // The p < 1 guard also covers degenerate density: a giver nominating the
  // same member in both likes and dislikes can push p past the model's range.
  if (!(p > 0 && p < 1)) return NO_SPLIT;

  const tail = CONFIG.binomial.alpha / 2;
  const cdf = binomialCdf(n, p);

  // Largest k with P(X <= k) <= tail.
  let low = -Infinity;
  for (let k = 0; k <= n && cdf[k] <= tail; k++) low = k;

  // Smallest k with P(X >= k) = 1 - P(X <= k-1) <= tail.
  let high = Infinity;
  for (let k = n; k >= 1 && 1 - cdf[k - 1] <= tail; k--) high = k;

  return { low, high };
};

// A strategy that proposes no effective split abstains from the vote; the
// remaining strategies vote with equal weight, so the order here is only for
// readability and does not affect the outcome.
// Gini recognises distributional shape (bimodal/long-tail) and then cuts at
// quartiles/deciles; percentile reads relative standing; Tukey flags strict
// outliers beyond the inner fences; binomial (GB) flags only the extreme cases
// under the chance model.
const IMPACT_STRATEGIES = [
  { name: "gini", run: giniStrategy },
  { name: "percentile", run: percentileStrategy },
  { name: "tukey", run: tukeyStrategy },
  { name: "binomial (GB)", run: binomialStrategy },
];

// ============================================================================
// STEP 3: IMPACT CLASSIFICATION
// Each threshold strategy classifies every member low/average/high; the final
// impact class is the majority vote of the strategies that propose a split.
// ============================================================================
const labelValues = (values, { low, high }) =>
  values.map((v) => (v <= low ? -1 : v >= high ? 1 : 0)); // low wins ties

const classifyImpact = (impact, thresholds) => {
  const none = impact.less(0); // all-false boolean array (impact is non-negative)
  const isLowImpact = isFinite(thresholds.low)
    ? impact.less_equal(thresholds.low)
    : none;
  let isHighImpact = isFinite(thresholds.high)
    ? impact.greater_equal(thresholds.high)
    : none;

  // Low wins deterministically if both ever apply.
  isHighImpact = isHighImpact.logical_and(isLowImpact.logical_not());
  const isAverageImpact = isLowImpact.logical_or(isHighImpact).logical_not();
  return { isLowImpact, isHighImpact, isAverageImpact };
};

// Sum a list of boolean masks into a single integer vote-count array.
const countVotes = (booleanArrays) => {
  let total = booleanArrays[0].astype("int32");
  for (let i = 1; i < booleanArrays.length; i += 1) {
    total = total.add(booleanArrays[i].astype("int32"));
  }
  return total;
};

// Majority vote across the strategies that actually split. A strategy that
// returns NO_SPLIT (or whose thresholds flag no visible member) abstains; if
// every strategy abstains, everyone is average.
// Tie-breaks: a non-average class beats average; low beats high.
const classifyImpactByVote = (impact, context) => {
  if (context.sorted.length === 0) return classifyImpact(impact, NO_SPLIT);

  const active = IMPACT_STRATEGIES.map(({ run }) => run(context)).filter(
    (thresholds) =>
      labelValues(context.sorted, thresholds).some((label) => label !== 0),
  );

  if (active.length === 0) return classifyImpact(impact, NO_SPLIT);

  const perStrategy = active.map((thresholds) =>
    classifyImpact(impact, thresholds),
  );

  const lowVotes = countVotes(perStrategy.map(({ isLowImpact }) => isLowImpact));
  const highVotes = countVotes(perStrategy.map(({ isHighImpact }) => isHighImpact));
  const averageVotes = countVotes(
    perStrategy.map(({ isAverageImpact }) => isAverageImpact),
  );

  // Average wins only with a strict majority; otherwise a non-average class
  // beats average on ties, and low beats high on a low/high tie.
  const isAverageImpact = averageVotes
    .greater(lowVotes)
    .logical_and(averageVotes.greater(highVotes));
  const isLowImpact = isAverageImpact
    .logical_not()
    .logical_and(lowVotes.greater_equal(highVotes));
  const isHighImpact = isAverageImpact
    .logical_not()
    .logical_and(highVotes.greater(lowVotes));

  return { isLowImpact, isHighImpact, isAverageImpact };
};

// ============================================================================
// STEP 4: BALANCE CLASSIFICATION (dynamic ratio threshold)
// Fewer opinions received -> less certain -> require a stronger ratio.
// threshold(n) = LESS + (MORE - LESS) * clamp((n - minN) / (maxN - minN), 0, 1)
// ============================================================================
const classifyBalance = (rp, rr, impact) => {
  const b = CONFIG.balance;
  const ratioSpan = b.moreLenientRatio - b.lessLenientRatio;
  const opinionSpan = b.maxOpinions - b.minOpinions;

  const clampedOffset = np.minimum(
    np.maximum(impact.subtract(b.minOpinions), 0),
    opinionSpan,
  );
  const dynamicThreshold = clampedOffset
    .divide(opinionSpan)
    .multiply(ratioSpan)
    .add(b.lessLenientRatio);

  const isPositiveBalance = rp.greater(rr.multiply(dynamicThreshold));
  const isNegativeBalance = rr.greater(rp.multiply(dynamicThreshold));
  const isNeutralBalance = isPositiveBalance
    .logical_or(isNegativeBalance)
    .logical_not();
  return { isPositiveBalance, isNegativeBalance, isNeutralBalance };
};

// ============================================================================
// STEP 5: STATUS ASSIGNMENT (decision tree, first match wins)
// ============================================================================
const assignStatus = (visibility, impactClass, balance) => {
  const S = SOCIOMETRIC_STATUS;
  const { isolated, ignored } = visibility;
  const { isLowImpact, isHighImpact, isAverageImpact } = impactClass;
  const { isPositiveBalance, isNegativeBalance, isNeutralBalance } = balance;

  return np.select(
    [
      isolated,
      ignored,
      isLowImpact,
      isHighImpact.logical_and(isPositiveBalance),
      isHighImpact.logical_and(isNegativeBalance),
      isHighImpact.logical_and(isNeutralBalance),
      isAverageImpact.logical_and(isPositiveBalance),
      isAverageImpact.logical_and(isNegativeBalance),
      isAverageImpact.logical_and(isNeutralBalance),
    ],
    [
      S.ISOLATED,
      S.IGNORED,
      S.MARGINAL,
      S.POPULAR,
      S.REJECTED,
      S.CONTROVERSIAL,
      S.APPRECIATED,
      S.DISLIKED,
      S.AMBIVALENT,
    ],
    S.UNCLASSIFIED, // safety default (unreachable for valid inputs)
  );
};

// ============================================================================
// INPUT VALIDATION
// All four inputs must be 1-D, same length (one entry per group member),
// finite, non-negative integers-as-counts, with impact === rp + rr. Anything
// else would otherwise be classified silently (e.g. NaN -> "ambivalent", or
// several groups flattened into one set of thresholds).
// ============================================================================
const validateInputs = (inputs) => {
  const entries = Object.entries(inputs);
  for (const [name, arr] of entries) {
    if (!arr || typeof arr.toArray !== "function") {
      throw new TypeError(`${name} must be a numpy-ts NDArray`);
    }
    if (arr.ndim !== 1) {
      throw new RangeError(
        `${name} must be 1-D (one entry per member), got shape [${arr.shape}]`,
      );
    }
  }
  const size = entries[0][1].size;
  for (const [name, arr] of entries) {
    if (arr.size !== size) {
      throw new RangeError(`${name} has length ${arr.size}, expected ${size}`);
    }
  }
  const values = Object.fromEntries(
    entries.map(([name, arr]) => [name, arr.toArray()]),
  );
  for (const [name, list] of Object.entries(values)) {
    if (!list.every((v) => Number.isFinite(v) && v >= 0)) {
      throw new RangeError(`${name} must contain only finite values >= 0`);
    }
  }
  const { rp, rr, impact } = values;
  if (!impact.every((v, i) => v === rp[i] + rr[i])) {
    throw new RangeError("impact must equal rp + rr for every member");
  }
};

// ============================================================================
// ORCHESTRATOR
// ============================================================================

/**
 * Classify members into sociometric status (codes 0-8; 99 is a safety
 * default that is unreachable for valid input).
 *
 * VISIBILITY (takes precedence over everything else)
 * - Isolated: impact = 0 and expressivity = 0
 * - Ignored:  impact = 0 and expressivity > 0
 *
 * IMPACT CLASSIFICATION (majority vote of the splitting strategies)
 * Low/high cutoffs are derived from members who received at least one opinion
 * (impact > 0), so isolated/ignored members don't drag the thresholds down.
 * Percentiles are nearest-rank, mirrored for the upper side so the bottom
 * p% and top p% always hold the same number of members; the median is the
 * true median (mean of the two middle values for even n).
 * Tails never include the tied median bulk: a cutoff that reaches the median
 * is pulled in to the nearest value strictly beyond it.
 * Four strategies each propose { low, high } cutoffs:
 * - Gini: decides whether to split (sample-corrected Gini >= 0.3, or >= 0.2
 *   with peak-to-peak spread >= 3; needs >= 5 visible members) and then cuts
 *   at the quartiles (25/75), or the outer deciles (10/90) with >= 20 visible
 *   members, tie-trimmed as above.
 * - Percentile: nearest-rank 20th/80th percentiles, tie-trimmed; abstains
 *   with fewer than 5 visible members.
 * - Tukey: strict inner fences (Q1 - 1.5*IQR, Q3 + 1.5*IQR) over visible
 *   members; a value exactly on a fence is not an outlier.
 * - Binomial (GB): exact two-sided Binomial(N-1, p) limits at alpha = 0.05,
 *   where p is the network's opinion density (computed over all members).
 * Each strategy classifies every member low/average/high; a strategy that
 * proposes no effective split (NO_SPLIT or thresholds that flag no visible
 * member) abstains from the vote. If every strategy abstains, everyone is
 * average. The final class per member is the plurality of the
 * non-abstaining strategies: average wins only if it has strictly more votes
 * than both low and high; otherwise low wins unless high has strictly more
 * votes than low.
 * Comparisons are inclusive (impact <= low, impact >= high) and low wins if
 * both ever apply. Cutoffs are observed values, so members tied with a cutoff
 * share its class (the tail can be larger than the nominal percentile).
 *
 * BALANCE CLASSIFICATION (dynamic ratio threshold)
 * - Positive: rp > threshold x rr
 * - Negative: rr > threshold x rp
 * - Neutral:  neither
 * The threshold depends on impact (total opinions received, n):
 * - n <= 3:  2.0 (strict, little evidence)
 * - n >= 15: 1.5 (lenient, more evidence)
 * - linear interpolation in between
 *
 * Note: low impact deliberately overrides balance. A member in the bottom
 * impact tier is "Marginal" even if their few opinions are mostly negative.
 *
 * All inputs must be 1-D arrays of the same length (one entry per member of a
 * single group), finite and non-negative, with impact === rp + rr; otherwise
 * a TypeError/RangeError is thrown. Classify each group separately.
 *
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @param {import("numpy-ts").NDArray} expressivity - Opinions given (gp + gr).
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @returns {import("numpy-ts").NDArray} Status codes, same shape as the inputs.
 * @throws {TypeError|RangeError} On invalid or inconsistent input.
 */
export const computeSociometricStatus = (rp, rr, expressivity, impact) => {
  validateInputs({ rp, rr, expressivity, impact });
  const visibility = classifyVisibility(impact, expressivity);

  const allImpacts = impact.flatten().toArray();
  const sorted = toSortedVisible(impact);
  const impactClass = classifyImpactByVote(impact, {
    sorted,
    allImpacts,
    groupSize: allImpacts.length,
  });

  const balance = classifyBalance(rp, rr, impact);
  return assignStatus(visibility, impactClass, balance);
};
