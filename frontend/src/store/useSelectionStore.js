import { create } from "zustand";

export const useSelectionStore = create((set) => ({
  selected: {
    files: [],
    folders: [],
  },

  selectionMode: false,

  // 🔥 SMART selection handler (FIXED)
  startSelection: (type, id) =>
    set((state) => {
      const isAlreadySelecting = state.selectionMode;

      // ✅ If already selecting → toggle
      if (isAlreadySelecting) {
        const exists = state.selected[type].includes(id);

        const updated = exists
          ? state.selected[type].filter((item) => item !== id)
          : [...state.selected[type], id];

        return {
          selected: {
            ...state.selected,
            [type]: updated,
          },
          selectionMode:
            updated.length > 0 ||
            (type === "files"
              ? state.selected.folders.length > 0
              : state.selected.files.length > 0),
        };
      }

      // ✅ First long press → start selection
      return {
        selectionMode: true,
        selected: {
          ...state.selected,
          [type]: [id],
        },
      };
    }),

  selectAll: (files, folders) =>
    set({
      selected: {
        files: files.map((f) => f._id),
        folders: folders.map((f) => f._id),
      },
      selectionMode: true,
    }),

  clearSelection: () =>
    set({
      selected: {
        files: [],
        folders: [],
      },
      selectionMode: false,
    }),
}));