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
   */
  function download(content, filename, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  /**
   * Download a value as pretty-printed JSON.
   * @param {*} data - The value to serialize.
   * @param {string} filename - The suggested file name.
   */
  function downloadJson(data, filename) {
    download(JSON.stringify(data, null, 2), filename, "application/json");
  }

  return { download, downloadJson };
}
