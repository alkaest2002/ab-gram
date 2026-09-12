<script setup>
// Icons hand-drawn as paths: no dependency, no files to load.
// The addresses are placeholders, to be replaced with the real ones.
const links = [
  {
    label: 'Codice su GitHub',
    href: 'https://github.com/ab-grid',
    external: true,
    paths: ['M9 18l-6-6 6-6', 'M15 6l6 6-6 6'],
  },
  {
    label: 'Scrivici una mail',
    href: 'mailto:info@ab-grid.example',
    external: false,
    paths: [
      'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
      'm3 7 9 6 9-6',
    ],
  },
]
</script>

<template>
  <div class="social">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      :title="link.label"
      :aria-label="link.label"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noreferrer' : undefined"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path v-for="path in link.paths" :key="path" :d="path" />
      </svg>
    </a>
  </div>
</template>
