import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLayoutStore = create(
  persist(
    (set) => ({
      layout: "grid", // default layout (grid | list)

      setLayout: (type) => set({ layout: type }),

      toggleLayout: () =>
        set((state) => ({
          layout: state.layout === "grid" ? "list" : "grid",
        })),
    }),
    {
      name: "file-layout-storage", // key in localStorage
    }
  )
);