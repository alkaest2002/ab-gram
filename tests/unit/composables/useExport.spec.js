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
      { store: "group", includeProps: [], excludeProps: [], redactProps: ["name"] },
      { store: "app", includeProps: ["version"] },
      { store: "report", excludeProps: ["status"] },
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
        { store: "app", includeProps: ["version", "notifyData"], excludeProps: ["version"] },
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
      { store: "report", redactProps: ["name", "memberName"] },
    ]);
    expect(result.report.research).toEqual({
      name: "<REDACTED>",
      nested: [{ memberName: "<REDACTED>", id: "1" }],
    });
    expect(report.research.name).toBe("Alice");
  });

  it("rejects unknown and duplicate stores", () => {
    const { exportStores } = useExport();
    expect(() => exportStores([{ store: "unknown" }])).toThrow("Unknown store export");
    expect(() => exportStores([{ store: "app" }, { store: "app" }])).toThrow(
      "Duplicate store export",
    );
  });
});
