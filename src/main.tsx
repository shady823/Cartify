import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { Providers } from "@/app/providers";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import "./index.css";

useAuthStore.getState().hydrate();
useThemeStore.getState().hydrate();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);
