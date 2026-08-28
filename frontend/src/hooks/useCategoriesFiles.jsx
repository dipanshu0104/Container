import { useMemo } from "react";
import { useFileStore } from "../store/useFileStore";
import useSocket from "./useSocket";

export const useCategoriesFiles = (category) => {
  const files = useFileStore((state) => state.files);
  const getFiles = useFileStore((s) => s.getFiles);

  useSocket({
    "file:list:updated": async () => {
      await getFiles();
    },
  });

  const filteredFiles = useMemo(() => {
    if (!files) return [];

    switch (category) {
      case "starred":
        return files.filter((file) => file.isFavorite && !file.isDeleted);

      case "trash":
        return files.filter((file) => file.isDeleted);

      case "recent":
        return [...files]
          .filter((file) => !file.isDeleted)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      case "shared":
        return files.filter((file) => file.isShared && !file.isDeleted);

      default:
        return files.filter((file) => !file.isDeleted);
    }
  }, [files, category]);

  return filteredFiles;
};
