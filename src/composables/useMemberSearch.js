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
 * Check if all characters in needle appear anywhere in haystack (unordered).
 * @param {string} needle
 * @param {string} haystack
 * @returns {boolean}
 */
function hasAllCharacters(needle, haystack) {
    for (let i = 0; i < needle.length; i++) {
        if (!haystack.includes(needle[i])) return false;
    }
    return true;
}

/**
 * Compute Levenshtein distance (edit distance) between two strings.
 * Lower is better; 0 = exact match.
 * Uses space-optimized version (single row) for O(min(a,b)) space.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function editDistance(a, b) {
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
        for (let i = 1; i <= short.length; i++) {
            const cost = short[i - 1] === long[j - 1] ? 0 : 1;
            curr[i] = Math.min(
                curr[i - 1] + 1,      // insertion
                prev[i] + 1,          // deletion
                prev[i - 1] + cost    // substitution
            );
        }
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
 * @param {string} normalizedName
 * @param {string} normalizedTerm
 * @returns {number | null}
 */
function scoreNormalizedName(normalizedName, normalizedTerm) {
    if (!normalizedTerm || !normalizedName) return null;

    // Exact substring match (best possible)
    const index = normalizedName.indexOf(normalizedTerm);
    if (index !== -1) {
        const startsAtWordBoundary =
            index === 0 || normalizedName[index - 1] === " ";
        return startsAtWordBoundary ? 0 : 0.5;
    }

    // Ordered subsequence match (e.g., "cln" → "calanna")
    // Gap penalty is now meaningful: closer letters = better score
    const info = subsequenceInfo(normalizedTerm, normalizedName);
    if (info) {
        const boundaryBonus = info.startsAtWordBoundary ? 0 : 0.3;
        // Scale gaps more aggressively: each gap of 1 adds 0.05 to score
        const gapPenalty = Math.min(info.gaps * 0.05, 1.5);
        return 2 + boundaryBonus + gapPenalty;
    }

    // All characters present (unordered)
    if (hasAllCharacters(normalizedTerm, normalizedName)) {
        return 4;
    }

    // Typo tolerance: edit distance on individual words
    const termWords = normalizedTerm.split(" ").filter(Boolean);
    const nameWords = normalizedName.split(" ");

    let bestDistance = Infinity;

    for (const termWord of termWords) {
        for (const nameWord of nameWords) {
            const distance = editDistance(termWord, nameWord);
            // Allow edits up to 40% of the longer word's length
            const threshold = Math.max(termWord.length, nameWord.length) * 0.4;
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
 * Owns the search box state (`query`) and the derived, ranked member list
 * (`filteredMembers`). Normalizes member names once upfront and caches them
 * for performance. When the query is empty every member is returned
 * unchanged; otherwise members are scored and sorted by match quality.
 *
 * @param {import('vue').Ref<Array<{ id: string, name: string }>>} members
 * @returns {{
 *   query: import('vue').Ref<string>,
 *   filteredMembers: import('vue').ComputedRef<Array<{ id: string, name: string }>>
 * }}
 */
export function useMemberSearch(members) {
    // Search input. Empty == idle state == every member is shown.
    const query = ref("");

    // Cache normalized names to avoid recomputation on every search
    const normalizedCache = computed(() => {
        return members.value.map((member) => ({
            member,
            normalized: normalizeForSearch(member.name),
        }));
    });

    const filteredMembers = computed(() => {
        const term = query.value.trim();
        if (!term) return members.value;

        const normalizedTerm = normalizeForSearch(term);

        // Score all members and filter/sort
        const scored = normalizedCache.value
            .map((entry) => {
                const primaryScore = scoreNormalizedName(entry.normalized, normalizedTerm);
                const containsAllChars = hasAllCharacters(normalizedTerm, entry.normalized);

                // Compute all criteria
                const isExactMatch = primaryScore !== null && primaryScore <= 1;
                const nameLengthPenalty = entry.normalized.length * 0.001;
                const alphabetical = entry.member.name.toLowerCase();

                return {
                    member: entry.member,
                    normalized: entry.normalized,
                    primaryScore,
                    containsAllChars,
                    isExactMatch,
                    nameLengthPenalty,
                    alphabetical,
                };
            })
            .filter((entry) => entry.primaryScore !== null && entry.containsAllChars)
            .map((entry) => {
                // Composite score: primary + exact match bonus + name length + alphabetical
                const compositeScore =
                    entry.primaryScore +
                    (entry.isExactMatch ? -1000 : 0) +  // Strong bonus for exact matches
                    entry.nameLengthPenalty +            // Slight bonus for shorter names
                    (entry.alphabetical.charCodeAt(0) / 10000); // Minimal alphabetical factor

                return {
                    ...entry,
                    compositeScore,
                };
            })
            .sort((a, b) => a.compositeScore - b.compositeScore);

        return scored.map((entry) => entry.member);
    });

    return { query, filteredMembers };
}
