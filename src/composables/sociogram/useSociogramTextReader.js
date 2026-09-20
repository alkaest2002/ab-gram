import { ref } from "vue";

/** Default ceiling on how many bytes are read from a file. */
export const DEFAULT_MAX_FILE_SIZE = 1024 * 1024; // 1 MiB

/**
 * Streaming text reader. Reads `textFileToRead` in chunks — so a huge file is
 * never held fully in memory — and stops as soon as `maxFileSize` bytes have
 * been read. If `maxLines` is set (not `null`), at most that many lines are
 * returned; if `maxLineLength` is set (not `null`), each line is truncated to
 * that many characters (safely handling multi-byte UTF-8). Both limits are
 * optional: pass `null` to leave them uncapped.
 *
 * The browser stays responsive because reading stops as soon as a limit is
 * reached (the stream is then cancelled) and each awaited `reader.read()` yields
 * to the event loop between chunks, so only a small slice is processed at a time.
 *
 * @param {File | Blob | null} textFileToRead
 * @param {number} maxFileSize Max bytes read from the file (default 1 MiB). Must be > 0.
 * @param {number | null} maxLines Max lines returned, or `null` for no limit (default `null`).
 * @param {number | null} maxLineLength Max characters kept per line, or `null` for no limit (default `null`).
 * @returns {{
 *   lines: import('vue').Ref<string[]>,
 *   readError: import('vue').Ref<Error | null>,
 *   isReadingFile: import('vue').Ref<boolean>,
 *   readFile: (file?: File | Blob) => Promise<void>
 * }}
 */
export function useSociogramTextReader(
  textFileToRead,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxLines = null,
  maxLineLength = null,
) {
  /** @type {import('vue').Ref<string[]>} */
  const lines = ref([]);
  const readError = ref(null);
  const isReadingFile = ref(false);

  // Tracks the reader for the in-flight read so a new readFile() can cancel it.
  let activeReader = null;

  /**
   * Truncate text to a maximum number of characters, safely handling multi-byte UTF-8.
   * Uses Array.from() to count actual characters, not bytes.
   *
   * @param {string} text
   * @param {number} length Max characters
   * @returns {string} Truncated text
   */
  function truncateLine(text, length) {
    if (length <= 0) return "";
    return Array.from(text).slice(0, length).join("");
  }

  /**
   * A limit is valid when it's a positive integer; `null` means "no limit".
   *
   * @param {number | null} value
   * @returns {boolean}
   */
  function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
  }

  async function readFile(file = textFileToRead) {
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
      readError.value = new Error("No file provided.");
      isReadingFile.value = false;
      return;
    }

    if (!isPositiveInteger(maxFileSize)) {
      readError.value = new Error(
        `Invalid parameters: maxFileSize (${maxFileSize}) must be a positive integer.`
      );
      isReadingFile.value = false;
      return;
    }

    if (maxLines !== null && !isPositiveInteger(maxLines)) {
      readError.value = new Error(
        `Invalid parameters: maxLines (${maxLines}) must be a positive integer or null.`
      );
      isReadingFile.value = false;
      return;
    }

    if (maxLineLength !== null && !isPositiveInteger(maxLineLength)) {
      readError.value = new Error(
        `Invalid parameters: maxLineLength (${maxLineLength}) must be a positive integer or null.`
      );
      isReadingFile.value = false;
      return;
    }

    if (typeof file.stream !== "function") {
      readError.value = new Error("This file cannot be streamed.");
      isReadingFile.value = false;
      return;
    }

    isReadingFile.value = true;
    readError.value = null;
    lines.value = [];

    // Trailing characters of the previous chunk that don't end with a newline.
    // Will be finalized once a newline is encountered or stream ends.
    let remainder = "";
    let reader = null;
    let bytesRead = 0;

    // Each limit is applied only when it's enabled (not `null`).
    const hasLineLimit = maxLines !== null;
    const hasLineLengthLimit = maxLineLength !== null;

    try {
      const decoder = new TextDecoder();
      reader = file.stream().getReader();
      activeReader = reader;

      // Read until the line limit is met or `maxFileSize` bytes have been read.
      while (
        (!hasLineLimit || lines.value.length < maxLines) &&
        bytesRead < maxFileSize
      ) {
        const { done, value } = await reader.read();
        if (done) break;

        bytesRead += value.byteLength;

        const chunk = decoder.decode(value, { stream: true });
        const chunkLines = (remainder + chunk).split(/\r\n|\r|\n/);

        // The last element has no trailing newline: carry it to the next chunk.
        remainder = chunkLines.pop();

        for (const line of chunkLines) {
          // Use character-aware truncation to avoid breaking multi-byte sequences.
          lines.value.push(
            hasLineLengthLimit ? truncateLine(line, maxLineLength) : line
          );
          if (hasLineLimit && lines.value.length >= maxLines) break;
        }

        // Guard against unbounded growth of remainder with a very long single line.
        // Still character-aware to avoid corruption.
        if (hasLineLengthLimit && Array.from(remainder).length > maxLineLength) {
          remainder = truncateLine(remainder, maxLineLength);
        }
      }

      // Flush any buffered multi-byte characters from the decoder.
      const tail = decoder.decode();
      if (tail) {
        remainder = remainder + tail;
      }

      // Only add remainder if it's not empty and we haven't hit the line limit.
      if (remainder && (!hasLineLimit || lines.value.length < maxLines)) {
        lines.value.push(
          hasLineLengthLimit ? truncateLine(remainder, maxLineLength) : remainder
        );
      }
    } catch (err) {
      readError.value = err;
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
      isReadingFile.value = false;
    }
  }

  return { lines, readError, isReadingFile, readFile };
}
