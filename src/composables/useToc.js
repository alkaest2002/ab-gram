import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Builds a table of contents from the `h2`/`h3` elements (which carry ids from
 * the Markdown pipeline) inside `containerRef`. Observes the container so the
 * list stays in sync while the route transition swaps the rendered page.
 */
export function useToc(containerRef) {
  const headings = ref([]);

  function rebuild() {
    const root = containerRef.value;
    headings.value = root
      ? Array.from(root.querySelectorAll("h2, h3")).map((el) => ({
          id: el.id,
          text: el.textContent.trim(),
          level: Number(el.tagName.slice(1)),
        }))
      : [];
  }

  let observer;
  onMounted(() => {
    rebuild();
    if (containerRef.value) {
      observer = new MutationObserver(rebuild);
      observer.observe(containerRef.value, { childList: true, subtree: true });
    }
  });

  onBeforeUnmount(() => observer?.disconnect());

  return { headings };
}
