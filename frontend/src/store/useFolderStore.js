import { create } from "zustand";
import { toast } from "react-toastify";
import {
  getFoldersAPI,
  getChoiceFolderAPI,
  createFolderAPI,
  editFolderAPI,
  deleteFolderAPI,
  trashFoldersAPI,
  moveItemsAPI
} from "../api/folders.api";

export const useFolderStore = create((set, get) => ({
  folders: [],
  currentFolder: null,
  isLoading: false,
  error: null,

/* =============================
     MOVING STATE
  ============================= */
  movingItems: {
    ids: [],
    isMoving: false,
  },



  // GET ALL FOLDERS
  getFolders: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await getFoldersAPI();

      set({
        folders: res.data, // backend returns array directly
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch folders",
        isLoading: false,
      });
    }
  },

  // GET CHILD FOLDERS
  getChoiceFolder: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await getChoiceFolderAPI(id);

      set({
        currentFolder: res.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Failed to fetch folder",
        isLoading: false,
      });
    }
  },

  // CREATE FOLDER
createFolder: async (folderName, parentId = "root", color) => {
  try {
    const res = await createFolderAPI(folderName, parentId, color);

    set((state) => ({
      folders: [res.data, ...state.folders],
    }));

    toast.success("Folder created");
  } catch (error) {
    set({ error: error.response?.data?.message || "Create failed" });
    toast.error(error.response?.data?.message || "Create failed");
  }
},

  // EDIT FOLDER
editFolder: async (id, newName, color) => {
  try {
    const res = await editFolderAPI(id, newName, color);

    set((state) => ({
      folders: state.folders.map((folder) =>
        folder._id === id
          ? {
              ...folder,
              name: res.data.folder.name,
              color: res.data.folder.color,
            }
          : folder
      ),
    }));

  } catch (error) {
    set({ error: "Folder update failed" });
  }
},

  // DELETE FOLDERS (BULK)
  deleteFolder: async (ids) => {
    try {
      await deleteFolderAPI(ids);

      set((state) => ({
        folders: state.folders.filter(
          (folder) => !ids.includes(folder._id)
        ),
      }));
    } catch (error) {
      set({ error: "Delete failed" });
    }
  },

  // TRASH FOLDERS (TOGGLE)
  trashFolders: async (ids) => {
    try {
      await trashFoldersAPI(ids);

      set((state) => ({
        folders: state.folders.map((folder) =>
          ids.includes(folder._id)
            ? { ...folder, isDeleted: !folder.isDeleted }
            : folder
        ),
      }));

      toast.success("Moved to trash");
    } catch (error) {
      set({ error: "Trash failed" });
      toast.error("Trash failed");
    }
  },

  // SEARCH FOLDERS
  searchFolders: (query) => {
    if (!query) return [];

    const lower = query.toLowerCase();

    return get().folders.filter((folder) => {
      if (folder.isDeleted) return false;

      return folder.name.toLowerCase().includes(lower);
    });
  },

    /* =============================
     START MOVE
  ============================= */
  setMovingItems: (ids) => {
    const items = Array.isArray(ids) ? ids : [ids];

    set({
      movingItems: {
        ids: items,
        isMoving: true,
      },
    });
  },

  /* =============================
     CANCEL MOVE
  ============================= */
  cancelMove: () =>
    set({
      movingItems: {
        ids: [],
        isMoving: false,
      },
    }),


      /* =============================
     CONFIRM MOVE
  ============================= */
  moveItems: async (destinationId) => {
    const { movingItems, getFolders } = get();

    if (!movingItems.ids.length) {
      return { success: false };
    }

    try {
      await moveItemsAPI(movingItems.ids, destinationId);

      set({
        movingItems: {
          ids: [],
          isMoving: false,
        },
      });

      await getFolders();

      return { success: true };
    } catch (error) {
      toast.error("Move failed ❌");
      return { success: false };
    }
  },


}));