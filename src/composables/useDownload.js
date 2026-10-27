// Copyright (c) 2026 Pierpaolo Calanna
// SPDX-License-Identifier: MIT

/**
 * Generate an ISO timestamp for filenames.
 * @returns {string} A filename-safe ISO timestamp (colons/dots replaced, milliseconds removed).
 */
export const getTimeStamp = () => {
  return new Date()
  .toISOString()
  .replace(/[:.]/g, "-") // Replace colons with hyphens (invalid in filenames)
  .slice(0, -5); // Remove milliseconds and Z
}

/**
 * Map a MIME type to the file extension used for downloads.
 * @param {string} mimeType - The content type of the file.
 * @returns {string} The file extension (including the dot), or an empty string when unknown.
 */
export const computeFileExtension = (mimeType) => {
  switch (mimeType) {
    case "application/json":
      return ".json";
    case "text/plain":
      return ".txt";
    case "text/encoded":
      return ".txt";
    default:
      return "";
  }
};

/**
 * Browser download helpers.
 *
 * Wraps the "create a Blob, point an <a download> at it, click it" dance so
 * any view can offer a file download without duplicating the plumbing.
 */
export function useDownload() {
  /**
   * Download a string as a file with the given MIME type.
   * @param {string} content - The file contents.
   * @param {string} filename - The suggested file name.
   * @param {string} [mimeType="text/plain"] - The content type of the file.
   * @param {boolean} [addTimeStamp=true] - Whether to append a timestamp to the filename.
   * @param {boolean} [encode=false] - Whether to base64-encode the content before download.
   */
  function download(content, filename, mimeType = "text/plain", addTimeStamp = true, encode = false) {
    // Build the filename with extension
    let filenameWithExtension = addTimeStamp ? `${filename}-${getTimeStamp()}` : filename;
    filenameWithExtension += computeFileExtension(mimeType);

    let contentToDownload = encode ? btoa(content) : content;
    const blob = new Blob([contentToDownload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filenameWithExtension;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  /**
   * Download a value as pretty-printed JSON.
   * @param {*} data - The value to serialize.
   * @param {string} filename - The suggested file name.
   * @param {string} [mimeType="application/json"] - The content type of the file.
   * @param {boolean} [addTimeStamp=true] - Whether to append a timestamp to the filename.
   * @param {boolean} [encode=false] - Whether to base64-encode the content before download.
   */
  function downloadJson(data, filename, mimeType = "application/json", addTimeStamp = true, encode = false) {
    download(JSON.stringify(data, null, 2), filename, mimeType, addTimeStamp, encode);
  }

  return { download, downloadJson };
}
