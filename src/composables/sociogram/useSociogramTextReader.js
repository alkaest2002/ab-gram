// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { ref } from "vue";

/** Default ceiling on how many bytes are read from a file. */
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MiB

/** Practical upper bounds to catch config errors early. */
export const MAX_LINES_LIMIT = 10_000; // 10K lines
export const MAX_LINE_LENGTH_LIMIT = 1_000; // 1K chars per line
export const MAX_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MiB

/** Allowed MIME types for text files. Add more as needed. */
export const ALLOWED_MIME_TYPES = [
  "text/plain",
];

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
 * @param {object} options Configuration options
 * @param {number} [options.maxFileSize=DEFAULT_MAX_FILE_SIZE] Max bytes read from the file. Must be > 0 and <= MAX_FILE_SIZE_LIMIT.
 * @param {number | null} [options.maxLines=null] Max lines returned, or `null` for no limit. Must be <= MAX_LINES_LIMIT.
 * @param {number | null} [options.maxLineLength=null] Max characters kept per line, or `null` for no limit. Must be <= MAX_LINE_LENGTH_LIMIT.
 * @param {boolean} [options.validateMimeType=true] If true, reject files that don't match ALLOWED_MIME_TYPES.
 * @param {string[]} [options.allowedMimeTypes=ALLOWED_MIME_TYPES] Custom list of allowed MIME types.
 * @returns {{
 *   lines: import('vue').Ref<string[]>,
 *   readError: import('vue').Ref<Error | null>,
 *   isReadingFile: import('vue').Ref<boolean>,
 *   readFile: (file?: File | Blob) => Promise<void>,
 *   decodingWarnings: import('vue').Ref<string[]>
 * }}
 */
export function useSociogramTextReader(
  textFileToRead,
  options = {},
) {
  // Extract and validate options with defaults
  const {
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    maxLines = null,
    maxLineLength = null,
    validateMimeType = true,
    allowedMimeTypes = ALLOWED_MIME_TYPES,
  } = options;

  /** @type {import('vue').Ref<string[]>} */
  const lines = ref([]);
  const readError = ref(null);
  const isReadingFile = ref(false);
  const decodingWarnings = ref([]);

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

  /**
   * Validate that a limit doesn't exceed a practical upper bound.
   *
   * @param {number | null} value
   * @param {number} upperBound
   * @param {string} name Parameter name for error messages
   * @returns {Error | null} Error if invalid, null if valid
   */
  function validateUpperBound(value, upperBound, name) {
    if (value === null) return null;
    if (!isPositiveInteger(value)) {
      return new Error(
        `Invalid parameters: ${name} (${value}) must be a positive integer or null.`,
      );
    }
    if (value > upperBound) {
      return new Error(
        `Invalid parameters: ${name} (${value}) exceeds maximum of ${upperBound}. This likely indicates a configuration error.`,
      );
    }
    return null;
  }

  /**
   * Check if a file's MIME type is allowed.
   *
   * @param {File | Blob} file
   * @returns {Error | null} Error if not allowed, null if valid
   */
  function checkMimeType(file) {
    if (!validateMimeType || !file.type) {
      return null; // Skip validation if disabled or MIME type unavailable
    }
    if (!allowedMimeTypes.includes(file.type)) {
      return new Error(
        `File type not supported. Expected one of: ${allowedMimeTypes.join(", ")}. Got: "${file.type}"`,
      );
    }
    return null;
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

    // Reset state
    readError.value = null;
    decodingWarnings.value = [];
    lines.value = [];
    isReadingFile.value = true;

    // Input validation
    if (!file) {
      readError.value = new Error("No file provided.");
      isReadingFile.value = false;
      return;
    }

    if (!isPositiveInteger(maxFileSize) || maxFileSize > MAX_FILE_SIZE_LIMIT) {
      readError.value = new Error(
        `Invalid parameters: maxFileSize (${maxFileSize}) must be a positive integer <= ${MAX_FILE_SIZE_LIMIT}.`,
      );
      isReadingFile.value = false;
      return;
    }

    // Validate with upper bounds
    let boundError = validateUpperBound(maxLines, MAX_LINES_LIMIT, "maxLines");
    if (boundError) {
      readError.value = boundError;
      isReadingFile.value = false;
      return;
    }

    boundError = validateUpperBound(
      maxLineLength,
      MAX_LINE_LENGTH_LIMIT,
      "maxLineLength",
    );
    if (boundError) {
      readError.value = boundError;
      isReadingFile.value = false;
      return;
    }

    // MIME type validation
    const mimeError = checkMimeType(file);
    if (mimeError) {
      readError.value = mimeError;
      isReadingFile.value = false;
      return;
    }

    if (typeof file.stream !== "function") {
      readError.value = new Error("This file cannot be streamed.");
      isReadingFile.value = false;
      return;
    }

    // Trailing characters of the previous chunk that don't end with a newline.
    // Will be finalized once a newline is encountered or stream ends.
    let remainder = "";
    let reader = null;
    let bytesRead = 0;

    // Each limit is applied only when it's enabled (not `null`).
    const hasLineLimit = maxLines !== null;
    const hasLineLengthLimit = maxLineLength !== null;

    try {
      const decoder = new TextDecoder("utf-8", { fatal: false });
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

        try {
          const chunk = decoder.decode(value, { stream: true });
          const chunkLines = (remainder + chunk).split(/\r\n|\r|\n/);

          // The last element has no trailing newline: carry it to the next chunk.
          remainder = chunkLines.pop();

          for (const line of chunkLines) {
            // Use character-aware truncation to avoid breaking multi-byte sequences.
            lines.value.push(
              hasLineLengthLimit ? truncateLine(line, maxLineLength) : line,
            );
            if (hasLineLimit && lines.value.length >= maxLines) break;
          }

          // Guard against unbounded growth of remainder with a very long single line.
          // Still character-aware to avoid corruption.
          if (
            hasLineLengthLimit &&
            Array.from(remainder).length > maxLineLength
          ) {
            remainder = truncateLine(remainder, maxLineLength);
          }
        } catch (decodeErr) {
          // Capture decoding errors but continue reading
          const warningMsg = `Decoding error at byte ${bytesRead}: ${decodeErr.message}`;
          decodingWarnings.value.push(warningMsg);
          console.warn(warningMsg);
        }
      }

      // Flush any buffered multi-byte characters from the decoder.
      try {
        const tail = decoder.decode();
        if (tail) {
          remainder = remainder + tail;
        }
      } catch (decodeErr) {
        const warningMsg = `Final decode error: ${decodeErr.message}`;
        decodingWarnings.value.push(warningMsg);
        console.warn(warningMsg);
      }

      // Only add remainder if it's not empty and we haven't hit the line limit.
      if (remainder && (!hasLineLimit || lines.value.length < maxLines)) {
        lines.value.push(
          hasLineLengthLimit
            ? truncateLine(remainder, maxLineLength)
            : remainder,
        );
      }
    } catch (err) {
      // Catch any unexpected errors during the read process
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

  return { lines, readError, isReadingFile, readFile, decodingWarnings };
}
