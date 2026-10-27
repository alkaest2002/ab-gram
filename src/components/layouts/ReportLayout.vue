<!--
  Copyright (c) 2026 Your Name
  SPDX-License-Identifier: MIT
-->

<script setup>
// --- Imports ------------

// --- Props --------------

// --- Emits --------------

// --- Routers ------------

// --- Stores -------------

// --- State --------------

// --- Composables --------

// --- Computed -----------

// --- Watchers -----------

// --- Lifecycle ----------

// --- Methods ------------
</script>

<template>
    <!--
      Print-document layout: no site chrome. On screen the A4 sheets are centred
      over a faint neutral backdrop so their edges read as paper; in print the
      backdrop and padding vanish and each sheet maps 1:1 onto an A4 page (see
      the @page rule below).
    -->
    <main class="min-h-dvh px-6 py-10 print:min-h-0 print:bg-transparent print:p-0">
        <div class="mx-auto w-full max-w-[210mm] print:max-w-none">
            <slot />
        </div>
    </main>
</template>

<style scoped>
/* The printed sheet: exact A4 with no browser default margin. The 10mm padding
   is applied on each page element instead, so on-screen and print geometry stay
   identical and independent of the user's browser print settings. */
@page {
    size: A4;
    margin: 0;
}
</style>
