import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "@/utils/storage";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",

      setTheme: (theme) => {
        storage.setTheme(theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },

      toggleTheme: () => {
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          storage.setTheme(next);
          document.documentElement.classList.toggle("dark", next === "dark");
          return { theme: next };
        });
      },

      hydrate: () => {
        const theme = storage.getTheme();
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },
    }),
    { name: "theme-storage", skipHydration: true }
  )
);
