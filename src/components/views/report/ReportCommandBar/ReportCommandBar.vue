<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------
// -- from vue
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";

//   -- From vue-router.
import { useRouter } from "vue-router";

//   -- From components.
import ArrowLeftIcon from "@/components/ui/icons/ArrowLeftIcon.vue";
import CommandBarMap from "./CommandBarMap.vue";

//   -- From composables.
import { useDisclosure } from "@/composables/useDisclosure";
import { useDownload } from "@/composables/useDownload";

// --- Props --------------
const props = defineProps({
  reportData: {
    type: Object,
    required: true,
  },
});

// --- Emits --------------

// --- Routers ------------
const router = useRouter();

// --- Stores -------------

// --- State --------------
const mapAnchor = useTemplateRef("mapAnchor");
const mapButton = useTemplateRef("mapButton");

// --- Composables --------
const { downloadJson } = useDownload();
const { isOpen, toggle, close } = useDisclosure(false, { lockScroll: false });

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------
onMounted(() => document.addEventListener("pointerdown", dismissOutside));
onBeforeUnmount(() => document.removeEventListener("pointerdown", dismissOutside));

// --- Methods ------------
function dismissOutside(event) {
  if (isOpen.value && !mapAnchor.value.contains(event.target)) close();
}

function goBack() {
  router.replace({ name: "sociogram" });
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
  downloadJson(redactReportData(props.reportData), "report-data", "application/json", true, false);
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 flex justify-center gap-1 px-6 pb-6 print:hidden"
    aria-label="Comandi del report"
  >
    <button
      type="button"
      class="cmd-btn"
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
        class="cmd-btn"
        aria-label="Indice del report"
        title="Indice del report"
        aria-controls="report-toc"
        :aria-expanded="isOpen"
        @click="toggle"
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
      <CommandBarMap v-if="isOpen" :members-data="reportData.membersData" @select="close" />
    </div>
    <button
      type="button"
      class="cmd-btn"
      aria-label="Genera PDF"
      title="Genera PDF"
      @click="printReport"
    >
      <span class="cmd-label">PDF</span>
    </button>
    <button
      type="button"
      class="cmd-btn"
      aria-label="Scarica JSON"
      title="Scarica JSON"
      @click="downloadReport"
    >
      <span class="cmd-label">JSON</span>
    </button>
  </nav>
</template>

<style scoped>
nav {
  --command-surface: rgb(50 50 50);
}

.cmd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  background-color: var(--command-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition: background-color 150ms ease;
}

.cmd-btn:hover,
.cmd-btn:focus-visible {
  background-color: var(--command-surface);
}

.cmd-label {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
}
</style>
