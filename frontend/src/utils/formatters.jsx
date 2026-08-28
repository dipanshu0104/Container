export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };
  
  export const formatSize = (size) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    return `${size.toFixed(1)} ${units[index]}`;
  };
  



export const calculateFileStats = (files, mode = "size") => {
  const stats = {
    images: 0,
    videos: 0,
    audio: 0,
    docs: 0,
    other: 0,
    total: 0,
  };

  files.forEach((file) => {
    const { size, mimeType } = file;

    const value = mode === "count" ? 1 : size;

    stats.total += value;

    if (mimeType.startsWith("image/")) stats.images += value;
    else if (mimeType.startsWith("video/")) stats.videos += value;
    else if (mimeType.startsWith("audio/")) stats.audio += value;
    else if (
      mimeType.includes("pdf") ||
      mimeType.includes("word") ||
      mimeType.includes("sheet") ||
      mimeType.includes("text")
    )
      stats.docs += value;
    else stats.other += value;
  });

  return stats;
};
