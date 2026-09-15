import { ref } from "vue";

/**
 * Streaming text reader. Reads `textFileToRead` in chunks — so a huge file is
 * never held fully in memory — returns at most `maxRows` rows, and truncates
 * each row to `rowLength` characters (safely handling multi-byte UTF-8).
 *
 * The browser stays responsive because reading stops as soon as `maxRows` is
 * reached (the stream is then cancelled) and each awaited `reader.read()` yields
 * to the event loop between chunks, so only a small slice is processed at a time.
 *
 * @param {File | Blob | null} textFileToRead
 * @param {number} rowLength Max characters kept per row (default 150). Must be > 0.
 * @param {number} maxRows    Max rows returned (default 35). Must be > 0.
 * @returns {{
 *   rows: import('vue').Ref<string[]>,
 *   error: import('vue').Ref<Error | null>,
 *   isReading: import('vue').Ref<boolean>,
 *   read: (file?: File | Blob) => Promise<void>
 * }}
 */
export function useTextReader(textFileToRead, maxRows = 35, maxRowLength = 150) {
  /** @type {import('vue').Ref<string[]>} */
  const rows = ref([]);
  const error = ref(null);
  const isReading = ref(false);

  // Tracks the reader for the in-flight read so a new read() can cancel it.
  let activeReader = null;

  /**
   * Truncate text to a maximum number of characters, safely handling multi-byte UTF-8.
   * Uses Array.from() to count actual characters, not bytes.
   *
   * @param {string} text
   * @param {number} length Max characters
   * @returns {string} Truncated text
   */
  function truncateRow(text, length) {
    if (length <= 0) return "";
    return Array.from(text).slice(0, length).join("");
  }

  async function read(file = textFileToRead) {
    // Cancel any in-flight read before starting a new one, so concurrent calls
    // don't interleave and corrupt the shared refs.
    if (activeReader) {
      try {
        await activeReader.cancel();
      } catch {
        // Silently ignore errors during cancellation
      }
      activeReader = null;
    }

    // Input validation
    if (!file) {
      error.value = new Error("No file provided.");
      isReading.value = false;
      return;
    }

    if (
      !Number.isInteger(maxRowLength) ||
      maxRowLength <= 0 ||
      !Number.isInteger(maxRows) ||
      maxRows <= 0
    ) {
      error.value = new Error(
        `Invalid parameters: rowLength (${maxRowLength}) and maxRows (${maxRows}) must be positive integers.`
      );
      isReading.value = false;
      return;
    }

    if (typeof file.stream !== "function") {
      error.value = new Error("This file cannot be streamed.");
      isReading.value = false;
      return;
    }

    isReading.value = true;
    error.value = null;
    rows.value = [];

    // Trailing characters of the previous chunk that don't end with a newline.
    // Will be finalized once a newline is encountered or stream ends.
    let remainder = "";
    let reader = null;

    try {
      const decoder = new TextDecoder();
      reader = file.stream().getReader();
      activeReader = reader;

      while (rows.value.length < maxRows) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (remainder + chunk).split(/\r\n|\r|\n/);

        // The last element has no trailing newline: carry it to the next chunk.
        remainder = lines.pop();

        for (const line of lines) {
          // Use character-aware truncation to avoid breaking multi-byte sequences
          rows.value.push(truncateRow(line, maxRowLength));
          if (rows.value.length >= maxRows) break;
        }

        // Guard against unbounded growth of remainder with a very long single line.
        // Still character-aware to avoid corruption.
        if (Array.from(remainder).length > maxRowLength) {
          remainder = truncateRow(remainder, maxRowLength);
        }
      }

      // Flush any buffered multi-byte characters from the decoder.
      const tail = decoder.decode();
      if (tail) {
        remainder = remainder + tail;
      }

      // Only add remainder if it's not empty and we haven't hit maxRows.
      if (remainder && rows.value.length < maxRows) {
        rows.value.push(truncateRow(remainder, maxRowLength));
      }
    } catch (err) {
      error.value = err;
    } finally {
      // Release the underlying stream, whether we finished or stopped early.
      activeReader = null;
      if (reader) {
        try {
          await reader.cancel();
        } catch {
          // Silently ignore errors during cancellation
        }
      }
      isReading.value = false;
    }
  }

  return { rows, error, isReading, read };
}
