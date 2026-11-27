// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { beforeEach, describe, expect, it } from "vite-plus/test";
import { createPinia, setActivePinia } from "pinia";
import { useExport } from "@/composables/useExport";
import { useAppStore } from "@/stores/app";
import { useGroupStore } from "@/stores/group";
import { useReportStore } from "@/stores/report";

describe("useExport", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("exports selected stores with independent filters", () => {
    useAppStore().setNotifyData(["private"]);
    useGroupStore().initMembers([
      { id: "1", name: "Alice", likes: [], dislikes: [], noLikes: true, noDislikes: true },
    ]);
    useReportStore().setStatus("generated");
    const result = useExport().exportStores([
      { store: "group", includeProps: [], excludeProps: [], redactProps: [".members[].name"] },
      { store: "app", includeProps: [".version"] },
      { store: "report", excludeProps: [".status"] },
    ]);
    expect(result.group.members[0].name).toBe("<REDACTED>");
    expect(result.app).toEqual({ version: useAppStore().version });
    expect(result.report).not.toHaveProperty("status");
    expect(result.report).toHaveProperty("edgeTypes");
  });

  it("defaults to all properties without redaction", () => {
    useGroupStore().initMembers([
      { id: "1", name: "Alice", likes: [], dislikes: [], noLikes: true, noDislikes: true },
    ]);
    const { exportStores } = useExport();
    expect(exportStores([{ store: "group" }]).group.members[0].name).toBe("Alice");
    expect(exportStores([{ store: "app" }]).app).toEqual(useAppStore().exportStore());
  });

  it("applies exclusions after inclusions and returns detached data", () => {
    useAppStore().setNotifyData(["error"]);
    const { exportStores } = useExport();
    expect(
      exportStores([
        { store: "app", includeProps: [".version", ".notifyData"], excludeProps: [".version"] },
      ]).app,
    ).toEqual({ notifyData: ["error"] });
    const result = exportStores([{ store: "app" }]);
    result.app.notifyData.push("changed");
    expect(useAppStore().notifyData).toEqual(["error"]);
  });

  it("redacts matching properties recursively without modifying the store", () => {
    const report = useReportStore();
    report.research = { name: "Alice", nested: [{ memberName: "Bob", id: "1" }] };
    const result = useExport().exportStores([
      { store: "report", redactProps: [".. | .name", ".. | .memberName"] },
    ]);
    expect(result.report.research).toEqual({
      name: "<REDACTED>",
      nested: [{ memberName: "<REDACTED>", id: "1" }],
    });
    expect(report.research.name).toBe("Alice");
  });

  it("redacts only the selected paths and ignores missing properties", () => {
    const report = useReportStore();
    report.research = { name: "Alice", nested: [{ memberName: "Bob" }, { memberName: "Carol" }] };
    const result = useExport().exportStores([
      {
        store: "report",
        redactProps: [".research.nested[0].memberName", ".research.missing.name"],
      },
    ]);
    expect(result.report.research).toEqual({
      name: "Alice",
      nested: [{ memberName: "<REDACTED>" }, { memberName: "Carol" }],
    });
    expect(report.research.nested[0].memberName).toBe("Bob");
  });

  it("selects nested paths and excludes or redacts matching values", () => {
    const group = useGroupStore();
    group.initMembers([
      { id: "1", name: "Alice", likes: ["2"], dislikes: [], noLikes: false, noDislikes: true },
      { id: "2", name: "Bob", likes: ["1"], dislikes: [], noLikes: false, noDislikes: true },
    ]);
    const result = useExport().exportStores([
      {
        store: "group",
        includeProps: [".members[].name", ".members[].id"],
        excludeProps: [".members[0].id"],
        redactProps: [".members[1].name"],
      },
    ]);
    expect(result.group.members).toEqual([{ name: "Alice" }, { name: "<REDACTED>", id: "2" }]);
    expect(group.members[1].name).toBe("Bob");
  });

  it("supports recursive inclusion and exclusion and preserves selected array indices", () => {
    const report = useReportStore();
    report.research = {
      name: "Alice",
      nested: [
        { name: "Bob", id: "1" },
        { name: "Carol", id: "2" },
      ],
    };
    const { exportStores } = useExport();
    expect(
      exportStores([
        {
          store: "report",
          includeProps: [".. | .name"],
          excludeProps: [".research.nested[0].name"],
        },
      ]).report,
    ).toEqual({ research: { name: "Alice", nested: [{}, { name: "Carol" }] } });
    expect(
      exportStores([{ store: "report", includeProps: [".research.nested[1].id"] }]).report,
    ).toEqual({ research: { nested: [null, { id: "2" }] } });
    expect(
      exportStores([{ store: "report", excludeProps: [".research.nested[0]"] }]).report.research
        .nested,
    ).toEqual([{ name: "Carol", id: "2" }]);
  });

  it("rejects invalid redaction expressions", () => {
    expect(() => useExport().exportStores([{ store: "app", redactProps: ["version"] }])).toThrow(
      "Invalid export path",
    );
  });

  it("rejects unknown and duplicate stores", () => {
    const { exportStores } = useExport();
    expect(() => exportStores([{ store: "unknown" }])).toThrow("Unknown store export");
    expect(() => exportStores([{ store: "app" }, { store: "app" }])).toThrow(
      "Duplicate store export",
    );
  });
});
