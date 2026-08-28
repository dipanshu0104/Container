import { create } from "zustand";
import {
  getDrivesAPI,
  createDriveAPI,
  toggleActiveDriveAPI,
  renameDriveAPI,
  deleteDriveAPI,
  getDriveHealthAPI,
  getStorageStatusAPI
} from "../api/drives.api";

export const useDriveStore = create((set, get) => ({
  // =====================
  // STATE
  // =====================
  drives: [],
  loading: false,
  error: null,
  health: null,

  storageStatus: {
    drives: [],
    files: [],
    folders: [],
  },

  // =====================
  // ACTIONS
  // =====================

  // 1) Get all drives
  getDrives: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getDrivesAPI();

      set({
        drives: res.data.drives || [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch drives",
        loading: false,
      });
    }
  },

  // 2) Create drive
  createDrive: async (data) => {
    try {
      set({ loading: true, error: null });

      const res = await createDriveAPI(data);

      const newDrive = res.data?.data;

      set((state) => ({
        drives: [newDrive, ...state.drives],
        loading: false,
      }));

      return newDrive;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to create drive",
        loading: false,
      });
    }
  },

  // 3) Toggle active drive
  toggleActiveDrive: async (id) => {
    try {
      const res = await toggleActiveDriveAPI(id);
      const updated = res.data?.data;

      set((state) => ({
        drives: state.drives.map((drive) => ({
          ...drive,
          isActive: drive._id === updated._id,
        })),
      }));
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to toggle active drive",
      });
    }
  },

  // 4) Rename drive
  renameDrive: async (id, name) => {
    try {
      const res = await renameDriveAPI(id, name);
      const updated = res.data?.data;

      set((state) => ({
        drives: state.drives.map((d) => (d._id === id ? updated : d)),
      }));
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to rename drive",
      });
    }
  },

  // 5) Delete drive
  deleteDrive: async (id) => {
    try {
      await deleteDriveAPI(id);

      set((state) => ({
        drives: state.drives.filter((d) => d._id !== id),
      }));
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to delete drive",
      });
    }
  },

  // 6) Get system health
  fetchHealth: async () => {
    try {
      const res = await getDriveHealthAPI();
      set({ health: res.data });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to get health",
      });
    }
  },

  // =====================
  // HELPERS
  // =====================

  clearError: () => set({ error: null }),

  getActiveDrive: () => {
    return get().drives.find((d) => d.isActive);
  },


  // 7) Get storage status summary
  fetchStorageStatus: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getStorageStatusAPI();

      // console.log(res)

      set({
        storageStatus: {
          drives: res.data.drives || [],
          files: res.data.files || [],
          folders: res.data.folders || [],
        },
        loading: false,
      });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch storage status",
        loading: false,
      });
    }
  },
}));
