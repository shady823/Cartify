import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { storage } from "@/utils/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        storage.setUser(user);
        storage.setToken(token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        storage.clearAuth();
        set({ user: null, token: null, isAuthenticated: false });
      },

      hydrate: () => {
        const token = storage.getToken();
        const user = storage.getUser();
        set({
          token,
          user,
          isAuthenticated: !!(token && user),
        });
      },
    }),
    { name: "auth-storage", skipHydration: true }
  )
);
