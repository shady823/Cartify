import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" replace /> },
  {
    path: "/login",
    lazy: async () => {
      const mod = await import("@/pages/Login");
      return { Component: mod.Login };
    },
  },
  {
    path: "/register",
    lazy: async () => {
      const mod = await import("@/pages/Register");
      return { Component: mod.Register };
    },
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    hydrateFallbackElement: (
      <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-400">
        Loading…
      </div>
    ),
    children: [
      {
        path: "home",
        lazy: async () => {
          const mod = await import("@/pages/Home");
          return { Component: mod.Home };
        },
      },
      {
        path: "about",
        lazy: async () => {
          const mod = await import("@/pages/About");
          return { Component: mod.About };
        },
      },
      {
        path: "products",
        lazy: async () => {
          const mod = await import("@/pages/Products");
          return { Component: mod.Products };
        },
      },
      {
        path: "products/:id",
        lazy: async () => {
          const mod = await import("@/pages/ProductDetails");
          return { Component: mod.ProductDetails };
        },
      },
      {
        path: "categories",
        lazy: async () => {
          const mod = await import("@/pages/Categories");
          return { Component: mod.Categories };
        },
      },
      {
        path: "brands",
        lazy: async () => {
          const mod = await import("@/pages/Brands");
          return { Component: mod.Brands };
        },
      },
      {
        path: "cart",
        lazy: async () => {
          const mod = await import("@/pages/Cart");
          return { Component: mod.Cart };
        },
      },
      {
        path: "checkout",
        lazy: async () => {
          const mod = await import("@/pages/Checkout");
          return { Component: mod.Checkout };
        },
      },
      {
        path: "wishlist",
        lazy: async () => {
          const mod = await import("@/pages/Wishlist");
          return { Component: mod.Wishlist };
        },
      },
      {
        path: "orders",
        lazy: async () => {
          const mod = await import("@/pages/Orders");
          return { Component: mod.Orders };
        },
      },
      {
        path: "profile",
        lazy: async () => {
          const mod = await import("@/pages/Profile");
          return { Component: mod.Profile };
        },
      },
    ],
  },
  { path: "*", element: <Navigate to="/home" replace /> },
]);
