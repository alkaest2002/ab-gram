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
