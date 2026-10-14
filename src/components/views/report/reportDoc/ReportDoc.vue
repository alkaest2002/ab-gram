<script setup>
// --- Vue ----------------

// --- Routers ------------

// --- Stores -------------

// --- Components ---------
import PageListOfMembers from "@/components/views/report/reportDoc/pages/PageListOfMembers.vue";

// --- Composables --------

// --- Props --------------
const props = defineProps({
    reportData: { type: Object, required: true },
});

// --- Emits --------------

// --- State --------------

// --- Computed -----------
// The document is an ordered list of page components. Add a page here and it is
// automatically numbered and slotted into the printed sequence.
const pages = [PageListOfMembers];
const totalPages = pages.length;

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <div class="space-y-8 print:space-y-0">
        <component
            :is="page"
            v-for="(page, index) in pages"
            :key="index"
            :report-data="reportData"
            :page-number="index + 1"
            :total-pages="totalPages"
        />
    </div>
</template>
