<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";

import { useRouter } from "vue-router";

import { useAppStore } from "@/stores/app";
import { useGroupStore } from "@/stores/group";
import { useReportStore } from "@/stores/report";

import ArrowLeftIcon from "@/components/ui/icons/ArrowLeftIcon.vue";
import CommandBarMap from "./CommandBarMap.vue";

import { useDisclosure } from "@/composables/useDisclosure";
import { useDownload } from "@/composables/useDownload";

// --- Props --------------
defineProps({
  reportData: {
    type: Object,
    required: true,
  },
});

// --- Emits --------------

// --- Routers ------------
const router = useRouter();

// --- Stores -------------
const appStore = useAppStore();
const groupStore = useGroupStore();
const reportStore = useReportStore();

// --- State --------------
const commandButtonClass =
  "inline-flex size-11 items-center justify-center rounded-full bg-(--command-surface) shadow-lg backdrop-blur-md";
const mapAnchor = useTemplateRef("mapAnchor");
const mapButton = useTemplateRef("mapButton");

// --- Composables --------
const { downloadJson } = useDownload();
const reportMap = useDisclosure(false, { lockScroll: false });

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onMounted(() => document.addEventListener("pointerdown", dismissOutside));
onBeforeUnmount(() => document.removeEventListener("pointerdown", dismissOutside));

// --- Methods ------------
function dismissOutside(event) {
  if (reportMap.isOpen.value && !mapAnchor.value.contains(event.target)) reportMap.close();
}

function goBack() {
  router.replace({ name: "group" });
}

function printReport() {
  window.print();
}

function redactReportData(reportData) {
  return JSON.parse(
    JSON.stringify(reportData, (key, value) =>
      key === "name" || key === "memberName" ? "[REDACTED]" : value,
    ),
  );
}

function downloadReport() {
  const reportData = {
    appVersion: appStore.exportStore().appVersion,
    group: {
      allMembersHaveNoDislikes: groupStore.allMembersHaveNoDislikes,
      ...groupStore.exportStore(),
    },
    report: reportStore.exportStore(),
  };
  downloadJson(redactReportData(reportData), "report-data", "application/json", true, false);
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 flex justify-center gap-1 px-6 pb-6 [--command-surface:#323232] print:hidden"
    aria-label="Comandi del report"
  >
    <button
      type="button"
      :class="commandButtonClass"
      aria-label="Torna al sociogramma"
      title="Torna al sociogramma"
      @click="goBack"
    >
      <ArrowLeftIcon :size="'size-7'" :stroke-class="'stroke-white'" />
    </button>
    <div ref="mapAnchor" class="relative flex" @keydown.esc="mapButton.focus()">
      <button
        ref="mapButton"
        type="button"
        :class="commandButtonClass"
        aria-label="Indice del report"
        title="Indice del report"
        aria-controls="report-toc"
        :aria-expanded="reportMap.isOpen.value"
        @click="reportMap.toggle"
      >
        <svg
          class="size-7 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke-linejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </button>
      <CommandBarMap
        v-if="reportMap.isOpen.value"
        :members-data="reportData.membersData"
        @select="reportMap.close"
      />
    </div>
    <button
      type="button"
      :class="commandButtonClass"
      aria-label="Genera PDF"
      title="Genera PDF"
      @click="printReport"
    >
      <span class="text-xs leading-none font-semibold tracking-[0.02em] text-white">PDF</span>
    </button>
    <button
      type="button"
      :class="commandButtonClass"
      aria-label="Scarica JSON"
      title="Scarica JSON"
      @click="downloadReport"
    >
      <span class="text-xs leading-none font-semibold tracking-[0.02em] text-white">JSON</span>
    </button>
  </nav>
</template>
