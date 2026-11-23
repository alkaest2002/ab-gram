import { h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vite-plus/test";
import MemberStatsMetrics from "@/components/views/report/reportDoc/pages/PageMemberMetrics/MemberStatsMetrics.vue";

it("displays the member's core number under CN", async () => {
  const html = await renderToString(
    h(MemberStatsMetrics, {
      memberId: "a",
      snaMetrics: { ids: ["a"], metrics: ["coreNumber"], rawValuesById: [[3]] },
    }),
  );
  expect(html.replace(/<[^>]+>/g, " ")).toMatch(/\bCN\s+3\b/);
});

it.each([
  ["a", /\bLC\s+0\.5\s+1\s+1\b/],
  ["b", /\bLC\s+—\s+—\s+1\b/],
])("displays local clustering and its rank for member %s", async (memberId, expected) => {
  const html = await renderToString(
    h(MemberStatsMetrics, {
      memberId,
      snaMetrics: {
        ids: ["a", "b"],
        metrics: ["localClustering"],
        rawValuesById: [[0.5], [NaN]],
        rankedValuesById: [[1], [NaN]],
        rankedValuesByMetric: [[1, NaN]],
      },
    }),
  );
  expect(html.replace(/<[^>]+>/g, " ")).toMatch(expected);
});
