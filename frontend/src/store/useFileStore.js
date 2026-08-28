import { create } from "zustand";
import { toast } from "react-toastify";
import {
  getFilesAPI,
  previewFileAPI,
  downloadFileAPI,
  uploadFilesAPI,
  renameFileAPI,
  deleteFileAPI,
  downloadSelectedAPI,
  deleteSelectedAPI,
  toggleFavoriteAPI,
  toggleTrashFileAPI,
  moveFilesAPI,
} from "../api/files.api";
import useUploadStore from "./useUploadStore";

export const useFileStore = create((set, get) => ({
  files: [],
  isLoading: false,
  error: null,
  movingFiles: { fileIds: [], isMoving: false },

  // GET FILES

  getFiles: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getFilesAPI();

      set({
        files: response.data.files || response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch files",
        isLoading: false,
      });
    }
  },


// UPLOAD FILES

uploadFiles: async (selectedFiles, parentId = "root") => {
  const { getFiles } = get();

  const {
    addUploadingFile,
    updateUploadingProgress,
    removeUploadingFile,
  } = useUploadStore.getState();

  if (!selectedFiles.length) return;

  for (const file of selectedFiles) {
    const formData = new FormData();
    formData.append("files", file);

    addUploadingFile({
      filename: file.name,
      progress: 0,
    });

    try {
      await uploadFilesAPI(formData, parentId, (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        updateUploadingProgress(file.name, progress);
      });

      removeUploadingFile(file.name);

      await getFiles();
    } catch (error) {
      console.error(`Upload failed: ${file.name}`, error);
      removeUploadingFile(file.name);
    }
  }
},


  //   PREVIEW FILE

  previewFile: async (id) => {
    try {
      // Direct backend URL for streaming/preview
      const url = `/api/files/preview/${id}`;

      // Optionally fetch headers for content-type
      const res = await fetch(url, { method: "HEAD" });
      const contentType = res.headers.get("content-type");

      return { url, type: contentType };
    } catch (error) {
      set({ error: "Preview failed" });
      return null;
    }
  },

  //  DOWNLOAD FILE

  downloadFile: async (id, fileName) => {
    try {
      toast.loading("Preparing download...");

      const res = await downloadFileAPI(id);

      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("File Downloding")
    } catch (error) {
      toast.dismiss();
      toast.error("Download failed");
      set({ error: "Download failed" });
    }
  },


  // RENAME FILE

  renameFile: async (id, newName) => {
    try {
      await renameFileAPI(id, newName);

      set((state) => ({
        files: state.files.map((file) =>
          file._id === id ? { ...file, name: newName } : file
        ),
      }));
    } catch (error) {
      set({ error: "Rename failed" });
    }
  },


  // DELETE FILE

  deleteFile: async (id) => {
    try {
      await deleteFileAPI(id);

      set((state) => ({
        files: state.files.filter((file) => file._id !== id),
      }));
    } catch (error) {
      set({ error: "Delete failed" });
    }
  },


  //  DOWNLOAD MULTIPLE FILES

  downloadSelected: async (fileIds) => {
    try {
      const res = await downloadSelectedAPI(fileIds);
      return res.data;
    } catch (error) {
      set({ error: "Bulk download failed" });
    }
  },


  //  DELETE MULTIPLE FILES

  deleteSelected: async (fileIds) => {
    try {
      await deleteSelectedAPI(fileIds);

      set((state) => ({
        files: state.files.filter((file) => !fileIds.includes(file._id)),
      }));
    } catch (error) {
      set({ error: "Bulk delete failed" });
    }
  },


  // TOGGLE FAVORITE

  toggleFavorite: async (fileId) => {
    try {
      await toggleFavoriteAPI(fileId);

      set((state) => ({
        files: state.files.map((file) =>
          file._id === fileId
            ? { ...file, isFavorite: !file.isFavorite }
            : file
        ),
      }));
    } catch (error) {
      set({ error: "Favorite toggle failed" });
    }
  },


  //  TOGGLE TRASH

  toggleTrash: async (id) => {
    try {
      await toggleTrashFileAPI(id);

      set((state) => ({
        files: state.files.map((file) =>
          file._id === id ? { ...file, isDeleted: !file.isDeleted } : file
        ),
      }));
    } catch (error) {
      set({ error: "Trash toggle failed" });
    }
  },


  // MOVE / COPY FILES

  setMovingFiles: (ids) => {
    const fileIdsArray = Array.isArray(ids) ? ids : [ids];
    set({ movingFiles: { fileIds: fileIdsArray, isMoving: true } });
  },

  cancelMove: () => set({ movingFiles: { fileIds: [], isMoving: false } }),

  MoveFiles: async (targetFolderId) => {
    const { movingFiles, getFiles } = get();
    if (!movingFiles.fileIds.length) return { success: false };

    try {
      const data = { 
        fileIds: movingFiles.fileIds, 
        folderId: targetFolderId // This is the ID of the nested folder
      };

      const response = await moveFilesAPI(data);

      if (response.data.success) {
        set({ movingFiles: { fileIds: [], isMoving: false } });
        if (getFiles) await getFiles(); // Refresh to show files in new location
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Nested Move Error:", error.response?.data || error.message);
      return { success: false };
    }
  },


  // SEARCH FILES

  searchFiles: (query) => {
    if (!query) return [];

    const lower = query.toLowerCase();

    return get().files.filter((file) => {
      if (file.isDeleted) return false;

      return (
        file.name.toLowerCase().includes(lower) ||
        file.extension.toLowerCase().includes(lower)
      );
    });
  },
}));