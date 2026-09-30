import { computed, ref } from "vue";

/**
 * Lower-case a value, strip diacritics, and collapse runs of non-alphanumeric
 * characters to single spaces, so "Pierpaolo Calanna" and "pierpaolo  calanna"
 * compare equally.
 * @param {string} value
 * @returns {string}
 */
function normalizeForSearch(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Whether `needle` occurs as an ordered subsequence of `haystack` — the case
 * where "cln" should find "Pierpaolo Calanna" — and, if so, how far apart its
 * letters are.
 * @param {string} needle
 * @param {string} haystack
 * @returns {{ gaps: number, startsAtWordBoundary: boolean } | null}
 */
function subsequenceInfo(needle, haystack) {
    let cursor = -1;
    let firstIndex = -1;
    let gaps = 0;

    for (let i = 0; i < needle.length; i++) {
        const next = haystack.indexOf(needle[i], cursor + 1);
        if (next === -1) return null;
        if (i === 0) firstIndex = next;
        else gaps += next - cursor - 1;
        cursor = next;
    }

    return {
        gaps,
        startsAtWordBoundary:
            firstIndex === 0 || haystack[firstIndex - 1] === " ",
    };
}

/**
 * Count how many times each character appears in a string.
 * @param {string} value
 * @returns {Map<string, number>}
 */
function charCounts(value) {
    const counts = new Map();
    for (const char of value) {
        counts.set(char, (counts.get(char) ?? 0) + 1);
    }
    return counts;
}

/**
 * Check if every character in needle appears in haystack at least as
 * many times as it appears in needle (repetitions count). Uses a pre-computed
 * character-frequency Map for O(needle.length) lookups.
 * @param {string} needle
 * @param {Map<string, number>} haystackCharCounts - Pre-computed character counts from haystack
 * @returns {boolean}
 */
function hasAllCharacters(needle, haystackCharCounts) {
    const needleCharCounts = charCounts(needle);
    for (const [char, count] of needleCharCounts) {
        if ((haystackCharCounts.get(char) ?? 0) < count) return false;
    }
    return true;
}

/**
 * Compute Levenshtein distance (edit distance) between two strings.
 * Lower is better; 0 = exact match.
 * Uses space-optimized version (single row) for O(min(a,b)) space.
 * Early termination if distance exceeds threshold.
 * @param {string} a
 * @param {string} b
 * @param {number} threshold - Return early if distance exceeds this
 * @returns {number}
 */
function editDistance(a, b, threshold = Infinity) {
    // Swap so we iterate over the shorter string
    let short = a;
    let long = b;
    if (short.length > long.length) {
        [short, long] = [long, short];
    }

    let prev = Array(short.length + 1).fill(0).map((_, i) => i);
    let curr = Array(short.length + 1).fill(0);

    for (let j = 1; j <= long.length; j++) {
        curr[0] = j;
        let rowMin = j; // Track minimum in current row for early termination

        for (let i = 1; i <= short.length; i++) {
            const cost = short[i - 1] === long[j - 1] ? 0 : 1;
            curr[i] = Math.min(
                curr[i - 1] + 1,      // insertion
                prev[i] + 1,          // deletion
                prev[i - 1] + cost    // substitution
            );
            rowMin = Math.min(rowMin, curr[i]);
        }

        // Early termination: if minimum in row exceeds threshold, no way to recover
        if (rowMin > threshold) return threshold + 1;

        [prev, curr] = [curr, prev];
    }

    return prev[short.length];
}

/**
 * Rank a single name against the query. Lower is better; `null` means no match.
 * Scoring hierarchy:
 * 0-1: Exact substring matches
 * 2-3.5: Subsequence matches (ordered, weighted by gap distance)
 * 4: All characters present (unordered)
 * 5+: Typo tolerance (edit distance)
 *
 * Takes pre-computed character counts to avoid recomputation.
 * @param {string} normalizedName
 * @param {string} normalizedTerm
 * @param {Map<string, number>} nameCharCounts - Pre-computed character counts from normalizedName
 * @returns {number | null}
 */
function scoreNormalizedName(normalizedName, normalizedTerm, nameCharCounts) {
    if (!normalizedTerm || !normalizedName) return null;

    // Exact substring match (best possible)
    const index = normalizedName.indexOf(normalizedTerm);
    if (index !== -1) {
        const startsAtWordBoundary =
            index === 0 || normalizedName[index - 1] === " ";
        return startsAtWordBoundary ? 0 : 0.5;
    }

    // Ordered subsequence match (e.g., "cln" → "calanna")
    const info = subsequenceInfo(normalizedTerm, normalizedName);
    if (info) {
        const boundaryBonus = info.startsAtWordBoundary ? 0 : 0.3;
        const gapPenalty = Math.min(info.gaps * 0.05, 1.5);
        return 2 + boundaryBonus + gapPenalty;
    }

    // All characters present (unordered, repetitions included) - OPTIMIZED: use pre-computed counts
    if (hasAllCharacters(normalizedTerm, nameCharCounts)) {
        return 4;
    }

    // Typo tolerance: edit distance on individual words
    // OPTIMIZED: Early termination with threshold-aware editDistance
    const termWords = normalizedTerm.split(" ").filter(Boolean);
    const nameWords = normalizedName.split(" ");

    let bestDistance = Infinity;

    for (const termWord of termWords) {
        for (const nameWord of nameWords) {
            // Calculate threshold: 40% of the longer word's length
            const threshold = Math.max(termWord.length, nameWord.length) * 0.4;

            // Skip if bestDistance already exceeds this word pair's threshold
            if (bestDistance <= threshold) continue;

            const distance = editDistance(termWord, nameWord, threshold);
            if (distance <= threshold) {
                bestDistance = Math.min(bestDistance, distance);
            }
        }
    }

    if (bestDistance < Infinity) {
        return 5 + bestDistance * 0.1;
    }

    return null;
}

/**
 * Fuzzy search over the sociogram members by name.
 *
 * OPTIMIZATIONS:
 * - Pre-compute character counts to avoid hasAllCharacters recomputation
 * - Single-pass scoring and filtering instead of filter-then-map
 * - Cache alphabetical sorting key instead of computing charCodeAt repeatedly
 * - Early termination in edit distance for typo tolerance
 *
 * @param {import('vue').Ref<Array<{ id: string, name: string }>>} members
 * @returns {{
 *   query: import('vue').Ref<string>,
 *   filteredMembers: import('vue').ComputedRef<Array<{ id: string, name: string }>>
 * }}
 */
export function useSociogramSearchMembers(members) {
    const query = ref("");

    // Pre-compute normalized names and character counts
    const normalizedCache = computed(() => {
        return members.value.map((member) => {
            const normalized = normalizeForSearch(member.name);
            return {
                member,
                normalized,
                charCounts: charCounts(normalized), // Pre-compute character counts
                alphabetical: member.name.toLowerCase(), // Pre-compute alphabetical
            };
        });
    });

    const filteredMembers = computed(() => {
        const term = query.value.trim();
        if (!term) return members.value;

        const normalizedTerm = normalizeForSearch(term);

        // Single-pass scoring, filtering, and sorting
        const scored = normalizedCache.value
            .reduce((results, entry) => {
                // Initial check: exclude names that do not contain every query
                // character before running the scoring mechanism.
                if (!hasAllCharacters(normalizedTerm, entry.charCounts)) {
                    return results;
                }

                // Score the name against the normalized term
                const primaryScore = scoreNormalizedName(
                    entry.normalized,
                    normalizedTerm,
                    entry.charCounts
                );

                // Early termination: skip entries that don't match at all
                if (primaryScore === null) return results;

                const isExactMatch = primaryScore <= 1;
                const nameLengthPenalty = entry.normalized.length * 0.001;

                // Composite score: primary + exact match bonus + name length + alphabetical
                const compositeScore =
                    primaryScore +
                    (isExactMatch ? -1000 : 0) +  // Strong bonus for exact matches
                    nameLengthPenalty +            // Slight bonus for shorter names
                    (entry.alphabetical.charCodeAt(0) / 10000); // Minimal alphabetical factor

                results.push({
                    member: entry.member,
                    compositeScore,
                });

                return results;
            }, [])
            .sort((a, b) => a.compositeScore - b.compositeScore);

        return scored.map((entry) => entry.member);
    });

    return { query, filteredMembers };
}
