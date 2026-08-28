import { Image as ImageIcon, FileText, Video, Music, FileArchive } from "lucide-react";

export const FILE_TYPE_CONFIG = {
  image: {
    icon: ImageIcon,
    color: "text-blue-400",
    hoverBorder: "hover:border-blue-500/70",
    bgColor: "bg-blue-500/10",
  },
  video: {
    icon: Video,
    color: "text-pink-400",
    hoverBorder: "hover:border-pink-500/70",
    bgColor: "bg-pink-500/10",
  },
  audio: {
    icon: Music,
    color: "text-green-400",
    hoverBorder: "hover:border-green-500/70",
    bgColor: "bg-green-500/10",
  },
  doc: {
    icon: FileText,
    color: "text-yellow-400",
    hoverBorder: "hover:border-yellow-500/70",
    bgColor: "bg-yellow-500/10",
  },

  //  NEW — fallback for unknown files
  other: {
    icon: FileArchive,
    color: "text-purple-400",
    hoverBorder: "hover:border-purple-500/70",
    bgColor: "bg-purple-500/10",
  },
};

/**
 * Detect file type from mimeType
 */
export const getFileType = (mimeType = "") => {
  if (!mimeType) return "other";

  if (mimeType.startsWith("image")) return "image";
  if (mimeType.startsWith("video")) return "video";
  if (mimeType.startsWith("audio")) return "audio";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("text") ||
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  ) {
    return "doc";
  }

  return "other"; // ✅ important fallback
};

/**
 * Returns full config for a file
 */
export const getFileIconConfig = (mimeType) => {
  const type = getFileType(mimeType);
  return FILE_TYPE_CONFIG[type] || FILE_TYPE_CONFIG.other;
};