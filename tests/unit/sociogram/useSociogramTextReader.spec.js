// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";

import {
  useSociogramTextReader,
  MAX_FILE_SIZE_LIMIT,
  MAX_LINES_LIMIT,
  MAX_LINE_LENGTH_LIMIT,
} from "@/composables/sociogram/useSociogramTextReader.js";

/**
 * Build a `File` with the given text content and MIME type.
 *
 * @param {string} content
 * @param {object} [options]
 * @param {string} [options.type="text/plain"]
 */
function makeFile(content, { type = "text/plain" } = {}) {
  return new File([content], "test.txt", { type });
}

/**
 * Build a minimal file-like object whose `stream()` yields the given chunks in
 * order. String chunks are UTF-8 encoded; `Uint8Array` chunks are passed through
 * untouched, so tests can split multi-byte sequences across chunk boundaries.
 *
 * @param {(string | Uint8Array)[]} chunks
 * @param {object} [options]
 * @param {string} [options.type="text/plain"]
 */
function makeChunkedFile(chunks, { type = "text/plain" } = {}) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(
          typeof chunk === "string" ? encoder.encode(chunk) : chunk,
        );
      }
      controller.close();
    },
  });
  return { type, stream: () => stream };
}

/**
 * Instantiate the composable with no initial file. Each call gets its own refs,
 * so tests cannot leak state into one another.
 *
 * @param {object} [options]
 */
function setup(options = {}) {
  return useSociogramTextReader(null, options);
}

describe("useSociogramTextReader", () => {
  it("exposes refs with sensible defaults", () => {
    const { lines, readError, isReadingFile, decodingWarnings } = setup();

    expect(lines.value).toEqual([]);
    expect(readError.value).toBeNull();
    expect(isReadingFile.value).toBe(false);
    expect(decodingWarnings.value).toEqual([]);
  });

  it("reads lines from a text file", async () => {
    const { lines, readError, isReadingFile, readFile } = setup();

    await readFile(makeFile("one\ntwo\nthree"));

    expect(readError.value).toBeNull();
    expect(isReadingFile.value).toBe(false);
    expect(lines.value).toEqual(["one", "two", "three"]);
  });

  it("accepts a Blob without a MIME type", async () => {
    const { lines, readError, readFile } = setup();

    await readFile(new Blob(["a\nb"]));

    expect(readError.value).toBeNull();
    expect(lines.value).toEqual(["a", "b"]);
  });

  it("uses the constructor's file when readFile is called without arguments", async () => {
    const { lines, readFile } = useSociogramTextReader(makeFile("a\nb"));

    await readFile();

    expect(lines.value).toEqual(["a", "b"]);
  });

  it("splits on LF, CRLF, and CR line endings", async () => {
    const { lines, readFile } = setup();

    await readFile(makeFile("a\nb\r\nc\rd"));

    expect(lines.value).toEqual(["a", "b", "c", "d"]);
  });

  it("keeps empty lines between newlines", async () => {
    const { lines, readFile } = setup();

    await readFile(makeFile("a\n\nb"));

    expect(lines.value).toEqual(["a", "", "b"]);
  });

  it("reads a final line without a trailing newline", async () => {
    const { lines, readFile } = setup();

    await readFile(makeFile("first\nsecond"));

    expect(lines.value).toEqual(["first", "second"]);
  });

  it("returns no lines for an empty file", async () => {
    const { lines, readFile } = setup();

    await readFile(makeFile(""));

    expect(lines.value).toEqual([]);
  });

  it("correctly decodes multi-byte UTF-8 characters split across chunks", async () => {
    const bytes = new TextEncoder().encode("café");
    // Split the two-byte "é" (0xC3 0xA9) across the chunk boundary.
    const { lines, readError, readFile } = setup();

    await readFile(makeChunkedFile([bytes.slice(0, 4), bytes.slice(4)]));

    expect(readError.value).toBeNull();
    expect(lines.value).toEqual(["café"]);
  });

  it("leaves decodingWarnings empty for valid input", async () => {
    const { decodingWarnings, readFile } = setup();

    await readFile(makeFile("a\nb"));

    expect(decodingWarnings.value).toEqual([]);
  });

  it("resets lines and errors on a subsequent read", async () => {
    const { lines, readError, readFile } = setup();

    await readFile(makeFile("a\nb"));
    expect(lines.value).toEqual(["a", "b"]);

    await readFile(makeFile("c"));
    expect(lines.value).toEqual(["c"]);
    expect(readError.value).toBeNull();
  });

  it("stops reading at maxLines", async () => {
    const { lines, readFile } = setup({ maxLines: 2 });

    await readFile(makeFile("a\nb\nc\nd\n"));

    expect(lines.value).toEqual(["a", "b"]);
  });

  it("does not emit a final unterminated line once maxLines is reached", async () => {
    const { lines, readFile } = setup({ maxLines: 2 });

    await readFile(makeFile("a\nb\nc"));

    expect(lines.value).toEqual(["a", "b"]);
  });

  it("respects maxLineLength by truncating each line", async () => {
    const { lines, readFile } = setup({ maxLineLength: 3 });

    await readFile(makeFile("abcdef\ngh"));

    expect(lines.value).toEqual(["abc", "gh"]);
  });

  it("truncates without splitting multi-byte UTF-8 characters", async () => {
    const { lines, readFile } = setup({ maxLineLength: 2 });

    await readFile(makeFile("😀😀😀"));

    expect(lines.value).toEqual(["😀😀"]);
  });

  it("stops reading once maxFileSize bytes have been read", async () => {
    const { lines, readFile } = setup({ maxFileSize: 4 });

    await readFile(makeChunkedFile(["a\n", "b\n", "c\n"]));

    expect(lines.value).toEqual(["a", "b"]);
  });

  it("reports an error when no file is provided", async () => {
    const { readError, isReadingFile, readFile } = setup();

    await readFile();

    expect(readError.value).toEqual(new Error("No file provided."));
    expect(isReadingFile.value).toBe(false);
  });

  it("rejects an invalid maxFileSize", async () => {
    for (const maxFileSize of [0, -1, 1.5, MAX_FILE_SIZE_LIMIT + 1]) {
      const { readError, readFile } = setup({ maxFileSize });

      await readFile(makeFile("a"));

      expect(readError.value.message).toContain("maxFileSize");
    }
  });

  it("rejects an invalid maxLines", async () => {
    for (const maxLines of [0, -1, 1.5, MAX_LINES_LIMIT + 1]) {
      const { readError, readFile } = setup({ maxLines });

      await readFile(makeFile("a"));

      expect(readError.value.message).toContain("maxLines");
    }
  });

  it("rejects an invalid maxLineLength", async () => {
    for (const maxLineLength of [0, -1, 1.5, MAX_LINE_LENGTH_LIMIT + 1]) {
      const { readError, readFile } = setup({ maxLineLength });

      await readFile(makeFile("a"));

      expect(readError.value.message).toContain("maxLineLength");
    }
  });

  it("rejects a file whose MIME type is not allowed", async () => {
    const { lines, readError, readFile } = setup();

    await readFile(makeFile("a\nb", { type: "application/json" }));

    expect(readError.value.message).toContain("File type not supported");
    expect(lines.value).toEqual([]);
  });

  it("skips MIME validation when disabled", async () => {
    const { lines, readError, readFile } = setup({ validateMimeType: false });

    await readFile(makeFile("a\nb", { type: "application/json" }));

    expect(readError.value).toBeNull();
    expect(lines.value).toEqual(["a", "b"]);
  });

  it("honors a custom allowed MIME type list", async () => {
    const { lines, readError, readFile } = setup({
      allowedMimeTypes: ["text/csv"],
    });

    await readFile(makeFile("a,b\nc,d", { type: "text/csv" }));

    expect(readError.value).toBeNull();
    expect(lines.value).toEqual(["a,b", "c,d"]);
  });

  it("rejects a file when its type is not in the custom allowed list", async () => {
    const { readError, readFile } = setup({ allowedMimeTypes: ["text/csv"] });

    await readFile(makeFile("a", { type: "text/plain" }));

    expect(readError.value.message).toContain("text/csv");
  });

  it("rejects a file that cannot be streamed", async () => {
    const { readError, readFile } = setup();

    await readFile({ type: "text/plain" });

    expect(readError.value).toEqual(new Error("This file cannot be streamed."));
  });
});
