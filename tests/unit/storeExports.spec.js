// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { beforeEach, describe, expect, it } from "vite-plus/test";
import { createPinia, setActivePinia } from "pinia";
import { isProxy } from "vue";
import { DirectedGraph } from "graphology";

import { useAppStore } from "@/stores/app";
import { useGroupStore } from "@/stores/group";
import { useReportStore } from "@/stores/report";

describe("store exports", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("resets each store to its initial state", () => {
    const app = useAppStore();
    const group = useGroupStore();
    const report = useReportStore();
    const initial = [app.exportStore(), group.exportStore(), report.exportStore()];

    app.version = "changed";
    app.setNotifyData(["error"]);
    group.addMember();
    report.setStatus("generated");
    report.snaLikesPlots = [{ typeOfPreference: "likes", accentColor: "red", svg: "plot" }];

    app.resetStore();
    group.resetStore();
    report.resetStore();
    expect([app.exportStore(), group.exportStore(), report.exportStore()]).toEqual(initial);
  });

  it("exports detached app metadata", () => {
    const store = useAppStore();
    store.setNotifyData(["error"]);
    const snapshot = store.exportStore();
    expect(snapshot).toEqual({ version: store.version, notifyData: ["error"] });
    snapshot.notifyData.push("another error");
    expect(store.notifyData).toEqual(["error"]);
  });

  it("redacts group names by default and preserves them when requested", () => {
    const store = useGroupStore();
    store.initMembers([
      { id: "1", name: "Alice", likes: ["2"], dislikes: [], noLikes: false, noDislikes: true },
    ]);
    const redacted = store.exportStore();
    const archive = store.exportStore(false);
    expect(redacted.members[0].name).toBe("[REDACTED]");
    expect(archive.members[0].name).toBe("Alice");
    expect(isProxy(redacted.members[0])).toBe(false);
    archive.members[0].likes.push("3");
    expect(store.members[0].likes).toEqual(["2"]);
  });

  it("exports detached report data and serializes graphs", () => {
    const store = useReportStore();
    const graph = new DirectedGraph();
    graph.addNode("1", { name: "Alice" });
    store.snaLikesNetwork = graph;
    store.snaLikesPlots = [{ typeOfPreference: "likes", accentColor: "red", svg: "plot" }];
    const snapshot = store.exportStore();
    expect(Object.keys(snapshot).sort()).toEqual(Object.keys(store.$state).sort());
    expect(snapshot.snaLikesNetwork.nodes[0].attributes.name).toBe("Alice");
    expect(isProxy(snapshot.snaLikesPlots)).toBe(false);
    snapshot.snaLikesPlots[0].svg = "changed";
    expect(store.snaLikesPlots[0].svg).toBe("plot");
  });
});
