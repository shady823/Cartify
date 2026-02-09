import type { User } from "@/types";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const THEME_KEY = "theme";

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getTheme: (): "light" | "dark" => {
    const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },
  setTheme: (theme: "light" | "dark") => localStorage.setItem(THEME_KEY, theme),

  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  },
};
