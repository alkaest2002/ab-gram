import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vite-plus/test";
import reportRoute from "@/router/routes/report";
import { useGroupStore } from "@/stores/group";

it("blocks report entry when a completed group drops below the minimum", () => {
  setActivePinia(createPinia());
  const group = useGroupStore();
  group.initMembers(
    Array.from({ length: group.minMembersCount }, (_, i) => ({
      id: String(i + 1),
      name: `Member ${i + 1}`,
      likes: [],
      dislikes: [],
      noLikes: true,
      noDislikes: true,
    })),
  );
  expect(reportRoute.beforeEnter()).toBe(true);

  group.removeMember("1");
  expect(group.membersStatus).toBe("partially-loaded");
  expect(reportRoute.beforeEnter()).toEqual({ name: "reportIncompleteDataError" });
});
