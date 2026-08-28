// hooks/useFilteredFiles.js
import { useMemo } from "react";
import { useFileStore } from "../store/useFileStore";
import useSocket from "./useSocket";

// utils/fileCategories.js

export const FILE_CATEGORIES = {
  images: ["png", "jpeg", "jpg", "webp", "gif", "bmp", "tiff", "svg"],
  videos: ["mp4", "mkv", "webm", "mov", "avi", "flv"],
  audios: ["mp3", "wav", "m4a", "ogg", "flac", "aac"],
  documents: ["pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
};

export const useFilteredFiles = (category) => {
  const files = useFileStore((state) => state.files);
  const getFiles = useFileStore((s) => s.getFiles);

  useSocket({
    "file:list:updated": async () => {
      await getFiles();
    },
  });

  // Helper: get file extension
  const getFileExtension = (fileName) => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  return useMemo(() => {
    if (!category) return files.filter((f) => !f.isDeleted);

    if (category === "others") {
      const allExtensions = new Set(Object.values(FILE_CATEGORIES).flat());
      return files.filter(
        (file) =>
          !allExtensions.has(getFileExtension(file.name)) && !file.isDeleted,
      );
    }

    const allowedExtensions = new Set(FILE_CATEGORIES[category] || []);
    return files.filter(
      (file) =>
        allowedExtensions.has(getFileExtension(file.name)) && !file.isDeleted,
    );
  }, [files, category]);
};
