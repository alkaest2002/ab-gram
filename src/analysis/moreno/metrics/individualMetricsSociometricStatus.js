// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import * as np from "numpy-ts";
import { computeGiniCoefficient } from "../../common/commonMetrics.js";

// ============================================================================
// CONFIG
// ============================================================================
const CONFIG = {
  // 20/80: percentile only flags the clear tails of the distribution.
  percentile: { low: 20, high: 80 },
  gini: {
    strong: 0.3,
    moderate: 0.2,
    minPtpForModerate: 3,
    outerLow: 10,
    outerHigh: 90,
    // With nearest-rank, the outer percentiles differ from min/max only in
    // sufficiently large groups.
    minVisibleForOuter: 20,
  },
  tukey: { k: 1.5 }, // inner-fence multiplier: Q1 - k*IQR, Q3 + k*IQR
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

// Nearest-rank percentile on a sorted array, clamped to a valid index.
const percentileOf = (sorted, percentile) =>
  sorted[
    Math.min(sorted.length - 1, Math.floor((sorted.length * percentile) / 100))
  ];

// ============================================================================
// STEP 2: IMPACT-THRESHOLD STRATEGIES
// Each strategy: ({ sorted, allImpacts, groupSize }) => { low, high }
// ============================================================================

// 2a. Plain percentiles (20/80). Collapsed percentiles => no split.
const percentileStrategy = ({ sorted }) => {
  const low = percentileOf(sorted, CONFIG.percentile.low);
  const high = percentileOf(sorted, CONFIG.percentile.high);
  return low === high ? NO_SPLIT : { low, high };
};

// 2b. Inequality-driven: split only if the distribution is unequal enough.
const giniStrategy = ({ sorted }) => {
  const c = CONFIG.gini;
  if (sorted.length < 2) return NO_SPLIT; // nothing to split
  const median = percentileOf(sorted, 50);
  const ptp = sorted[sorted.length - 1] - sorted[0];
  // Bias-corrected sample Gini (* N/(N-1)): the population formula
  // underestimates inequality in the small groups typical of sociometry.
  const gini =
    computeGiniCoefficient(np.array(sorted)) *
    (sorted.length / (sorted.length - 1));

  const unequal =
    gini >= c.strong || (gini >= c.moderate && ptp >= c.minPtpForModerate);
  if (!unequal) return NO_SPLIT;

  // Outer percentiles only for larger groups, and each side only if it lies
  // strictly beyond the median (so tied bulk is never swept into a tail).
  const largeEnough = sorted.length >= c.minVisibleForOuter;
  const outerLow = percentileOf(sorted, c.outerLow);
  const outerHigh = percentileOf(sorted, c.outerHigh);
  const useOuterLow = largeEnough && outerLow < median;
  const useOuterHigh = largeEnough && outerHigh > median;

  if (useOuterLow || useOuterHigh) {
    return {
      low: useOuterLow ? outerLow : -Infinity,
      high: useOuterHigh ? outerHigh : Infinity,
    };
  }

  // Median-strict: strictly below / above the typical value.
  const below = sorted.filter((v) => v < median);
  const above = sorted.filter((v) => v > median);
  return {
    low: below.length ? below[below.length - 1] : -Infinity,
    high: above.length ? above[0] : Infinity,
  };
};

// 2c. Tukey's inner fences over visible members: Q1 - k*IQR, Q3 + k*IQR.
// Flags only genuine outliers; fences beyond the observed range simply leave
// that side unflagged. Note: comparisons downstream are inclusive (<= / >=),
// slightly more permissive than Tukey's strict "beyond the fence".
const tukeyStrategy = ({ sorted }) => {
  const q1 = percentileOf(sorted, 25);
  const q3 = percentileOf(sorted, 75);
  const iqr = q3 - q1;
  if (iqr === 0) return NO_SPLIT; // fences would collapse onto the median
  const k = CONFIG.tukey.k;
  return { low: q1 - k * iqr, high: q3 + k * iqr };
};

// 2d. GB method: exact binomial test (replaces Salvosa's tables).
// Under chance, opinions received by one member ~ Binomial(N-1, p), with
// p = total opinions / (N * (N-1)). Limits are the counts whose tail
// probability is <= alpha/2.
const binomialCdf = (n, p) => {
  const odds = p / (1 - p);
  let pmf = Math.exp(n * Math.log1p(-p)); // P(X = 0)
  let cumulative = 0;
  const cdf = [];
  for (let k = 0; k <= n; k++) {
    cumulative += pmf;
    cdf.push(Math.min(1, cumulative));
    pmf *= ((n - k) / (k + 1)) * odds; // P(X = k+1) from P(X = k)
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

// Order matters: it is the tie-break priority in the consensus step.
// Gini first (distributional shape: bimodal/long-tail), then percentile
// before binomial so a richer distribution-based split beats the exact test's
// minimal split on ties (e.g. the Hogwarts data), then Tukey as a robust
// second opinion, and binomial last — its cutoffs flag only the extreme cases
// and should never override a relative-standing split on a tie.
const IMPACT_STRATEGIES = [
  { name: "gini", run: giniStrategy },
  { name: "percentile", run: percentileStrategy },
  { name: "tukey", run: tukeyStrategy },
  { name: "binomial (GB)", run: binomialStrategy },
];

// ============================================================================
// STEP 3: CONSENSUS
// Pick the strategy whose classification agrees most with all the others.
// ============================================================================
const labelValues = (values, { low, high }) =>
  values.map((v) => (v <= low ? -1 : v >= high ? 1 : 0)); // low wins ties

// Integer hit count: summing fractional rates made exact ties depend on
// floating-point summation order, which silently broke the tie-break rules.
const agreementHits = (a, b) =>
  a.reduce((hits, label, i) => hits + (label === b[i] ? 1 : 0), 0);

const selectConsensusThresholds = (context, strategies = IMPACT_STRATEGIES) => {
  const candidates = strategies.map(({ name, run }) => {
    const thresholds = run(context);
    const labels = labelValues(context.sorted, thresholds);
    return {
      name,
      thresholds,
      labels,
      // An "effective" split flags at least one visible member.
      splits: labels.some((label) => label !== 0),
    };
  });

  candidates.forEach((candidate, i) => {
    candidate.score = candidates.reduce(
      (sum, other, j) =>
        j === i ? sum : sum + agreementHits(candidate.labels, other.labels),
      0,
    );
  });

  // Ties: prefer a strategy that actually separates someone (more informative
  // than "everyone average"), then the earlier (higher-priority) strategy.
  let best = null;
  candidates.forEach((candidate) => {
    const wins =
      best === null ||
      candidate.score > best.score ||
      (candidate.score === best.score && candidate.splits && !best.splits);
    if (wins) best = candidate;
  });

  return { name: best.name, thresholds: best.thresholds, candidates };
};

// ============================================================================
// STEP 4: IMPACT CLASSIFICATION
// ============================================================================
const classifyImpact = (impact, thresholds) => {
  const none = impact.less(0); // all-false boolean array (impact is non-negative)
  let isLowImpact = isFinite(thresholds.low)
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

// ============================================================================
// STEP 5: BALANCE CLASSIFICATION (dynamic ratio threshold)
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
// STEP 6: STATUS ASSIGNMENT (decision tree, first match wins)
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
// ORCHESTRATOR
// ============================================================================

/**
 * Classify members into sociometric status (0-8).
 *
 * VISIBILITY (takes precedence over everything else)
 * - Isolated: impact = 0 and expressivity = 0
 * - Ignored:  impact = 0 and expressivity > 0
 *
 * IMPACT CLASSIFICATION (consensus of four threshold strategies)
 * Low/high cutoffs are derived from members who received at least one opinion
 * (impact > 0), so isolated/ignored members don't drag the thresholds down.
 * Four strategies each propose { low, high } cutoffs:
 * - Gini: splits only when inequality is meaningful (sample-corrected Gini
 *   >= 0.3, or >= 0.2 with peak-to-peak spread >= 3), via outer 10/90
 *   percentiles (>= 20 visible members, each side only if strictly beyond the
 *   median) or median-strict.
 * - Binomial (GB): exact two-sided Binomial(N-1, p) limits at alpha = 0.05,
 *   where p is the network's opinion density (computed over all members).
 * - Tukey: inner fences (Q1 - 1.5*IQR, Q3 + 1.5*IQR) over visible members.
 * - Percentile: nearest-rank 20th/80th percentiles (no split if collapsed).
 * Each strategy labels the visible members low/average/high; the strategy
 * that agrees most with the others (integer hit count) wins. Ties prefer a
 * strategy that flags at least one member, then the order above (gini >
 * percentile > tukey > binomial).
 * Comparisons are inclusive (impact <= low, impact >= high) and low wins if
 * both ever apply, so ties at a threshold can enlarge a tail.
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
 * @param {import("numpy-ts").NDArray} rp - Received positive nominations.
 * @param {import("numpy-ts").NDArray} rr - Received negative nominations.
 * @param {import("numpy-ts").NDArray} expressivity - Opinions given (gp + gr).
 * @param {import("numpy-ts").NDArray} impact - Opinions received (rp + rr).
 * @returns {import("numpy-ts").NDArray} Status codes, same shape as the inputs.
 */
export const computeSociometricStatus = (rp, rr, expressivity, impact) => {
  const visibility = classifyVisibility(impact, expressivity);

  const allImpacts = impact.flatten().toArray();
  const sorted = toSortedVisible(impact);
  const thresholds =
    sorted.length > 0
      ? selectConsensusThresholds({
          sorted,
          allImpacts,
          groupSize: allImpacts.length,
        }).thresholds
      : NO_SPLIT;

  const impactClass = classifyImpact(impact, thresholds);
  const balance = classifyBalance(rp, rr, impact);
  return assignStatus(visibility, impactClass, balance);
};
