export const getPreviewType = (mime) => {

  if (!mime) return "unknown";

  if (mime.startsWith("image")) return "image";

  if (mime.startsWith("video")) return "video";

  if (mime.startsWith("audio")) return "audio";

  if (mime === "application/pdf") return "pdf";

  if (
    mime.includes("javascript") ||
    mime.includes("json") ||
    mime.includes("html") ||
    mime.includes("css") ||
    mime.includes("text")
  ) {
    return "code";
  }

  return "unknown";
};